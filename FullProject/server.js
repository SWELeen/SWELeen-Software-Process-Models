const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname));

const dataFilePath = path.join(__dirname, 'data.json');

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/user profile.html');
    });

  // Handle email submission
    app.post('/send-email', (req, res) => {
    const userEmail = req.body.email;

    // Email content
    const msg = {
    to: userEmail,
    from: 'aleef.care@gmail.com', 
    subject: 'Welcome!',
    text: 'Welcome! You\'ve joined us.',
    html: '<strong>Welcome! You\'ve joined us.</strong>',
    };

    // Send email
    sgMail
    .send(msg)
    .then(() => {
        res.send('Email sent successfully!');
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error sending email.');
    });
});


// Serve the user profile page at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'user profile.html'));
});

// Serve the pet profile page
app.get('/pet-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'pet profile.html'));
});

// Serve the map page at a different URL
app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'findNearClinics.html'));
});

// Route to handle sign-in
app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    let users = {};

    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[email] || { pets: [] };
    if (user.password === password) {
        res.cookie('userEmail', email, { httpOnly: true });
        res.status(200).send(`<script>alert('Sign-in successful!'); window.location.href = '/pets.html';</script>`);
    } else {
        res.status(400).send(`<script>alert('Account not found or incorrect password. Please log in to create an account.'); window.location.href = '/user profile.html';</script>`);
    }
});

app.post('/update-user-profile', (req, res) => {
    const updatedUser = req.body;
    const userEmail = req.cookies.userEmail;

    // Check if user is authenticated
    if (!userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    // Check if the user exists
    const user = users[userEmail];
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    users[userEmail] = {
        ...user,  // Retain existing data
        ...updatedUser // Apply updates
    };

    // Write the updated users back to the data file
    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to data.json:", err);
            return res.status(500).json({ message: 'Failed to save data' });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
});



// Route to save user profile data
app.post('/create-profile', (req, res) => {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const emailExists = users[email];
    const phoneExists = Object.values(users).some(user => user.phone === phone);

    if (emailExists || phoneExists) {
        return res.status(400).send(`<script>alert('Account or number already exists'); window.location.href = '/Sign in.html';</script>`);
    }

    users[email] = { email,username, phone, password, pets: [] };

    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to data.json:", err);
            return res.status(500).json({ message: 'Failed to save data' });
        }
        res.status(200).send(`<script>alert('Profile created successfully!'); window.location.href = '/Sign in.html';</script>`);
    });
});

// Route to update pet data
app.put('/pet_data/:email/:petID', (req, res) => {
    const { email, petID } = req.params;
    const updatedPetData = req.body;

    let users = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    const user = users[email];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const petIndex = user.pets.findIndex(pet => pet.ID === petID);
    if (petIndex === -1) return res.status(404).json({ message: 'Pet not found' });

    // Ensure updated ID does not conflict with existing pets
    if (updatedPetData.ID && updatedPetData.ID !== petID) {
        const duplicatePet = user.pets.find(pet => pet.ID === updatedPetData.ID);
        if (duplicatePet) {
            return res.status(400).json({ message: `Pet ID ${updatedPetData.ID} already exists.` });
        }
    }

    user.pets[petIndex] = { ...user.pets[petIndex], ...updatedPetData };

    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    res.json({ message: 'Pet data updated successfully!' });
});

app.post('/pet_data', (req, res) => {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[userEmail] || { pets: [] };
    if (!user.pets) {
        user.pets = [];
    }

    const petData = req.body;
    const requiredFields = ['name', 'ID', 'type', 'breed', 'birthday', 'weight', 'specialNeeds', 'spayedNeutered', 'gender', 'training','vaccinationStatus'];

    // Validate that all required fields are filled
    for (const field of requiredFields) {
        if (!petData[field] || petData[field].toString().trim() === '') {
            return res.status(400).json({ message: `${field} is required and must be filled.` });
        }
    }

    // Check for duplicate pet IDs
    const isDuplicateID = user.pets.some(pet => pet.ID === petData.ID);
    if (isDuplicateID) {
        return res.status(400).json({ message: `A pet with ID ${petData.ID} already exists. Please use a unique ID.` });
    }

    user.pets.push(petData);
    users[userEmail] = user;

    fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing to data.json:", err);
            return res.status(500).json({ message: 'Failed to save pet data' });
        }
        res.status(200).json({ message: 'Pet data saved successfully!' });
    });
});


// Route to fetch pet data for the profile
app.get('/get-pets', (req, res) => {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[userEmail] || { pets: [] };
    if (!user.pets) {
        return res.status(404).json({ message: 'No pets found' });
    }

    res.status(200).json(user.pets);
});

app.get('/get-user-profile', (req, res) => {
    const userEmail = req.cookies.userEmail;
    if (!userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[userEmail];
    if (user) {
        res.status(200).json({
            username: user.username,
            email: userEmail,
            phone: user.phone,
            password: user.password // This should be encrypted for security
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/pet_data/:email/:petID', (req, res) => {
    const { email, petID } = req.params;
    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[email];
    if (user) {
        const pet = user.pets.find(pet => pet.ID === petID);
        if (pet) {
            res.json(pet);
        } else {
            res.status(404).send('Pet not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});


app.get('/pet-profile', (req, res) => {
    const { ID, email } = req.query;
    let users = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            users = JSON.parse(fileData);
        } catch (error) {
            console.error("Error reading or parsing data.json:", error);
            return res.status(500).json({ message: 'Failed to load existing data' });
        }
    }

    const user = users[email];
    if (user) {
        const pet = user.pets.find(pet => pet.ID === ID);
        if (pet) {
            res.render('pet-profile', { pet }); // Use templating to pass pet data to the page
        } else {
            res.status(404).send('Pet not found');
        }
    } else {
        res.status(404).send('User not found');
    }
}); 

app.delete('/pet_data/:email/:petID', (req, res) => {
    const { email, petID } = req.params;

    let users = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    const user = users[email];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const petIndex = user.pets.findIndex(pet => pet.ID === petID);
    if (petIndex === -1) return res.status(404).json({ message: 'Pet not found' });

    user.pets.splice(petIndex, 1); // Remove pet from user's pet array

    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
    res.json({ message: 'Pet data deleted successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`You can access the user profile at http://localhost:${PORT}`);
    console.log(`You can access the pet profile at http://localhost:${PORT}/pet-profile`);
    console.log(`You can access the map page at http://localhost:${PORT}/map`);
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
