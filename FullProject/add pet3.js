// Function to calculate the pet's age based on the birthday
function calculateAge() {
    const birthdayInput = document.getElementById('birthday').value;
    if (!birthdayInput) {
        alert('Please enter the birthday.');
        return;
    }

    const birthday = new Date(birthdayInput);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    // Update the age field in the profile page
    document.getElementById('age').value = age; // Ensure this is the correct ID for the age input
}

// Load Pet Data on the Profile Page, including the image
function loadPetData() {
    const petData = JSON.parse(localStorage.getItem('petData'));
    if (petData) {
        document.getElementById('name').value = petData.name;
        document.getElementById('type').value = petData.type;
        document.getElementById('birthday').value = petData.birthday;
        document.getElementById('age').value = petData.age;
        document.getElementById('breed').value = petData.breed;
        document.getElementById('weight').value = petData.weight;
        
        if (petData.photo) {
            document.getElementById('pet-photo').src = petData.photo;  // Set the pet photo
        }

        if (petData.specialNeeds) {
            document.getElementById(`special-${petData.specialNeeds}`).checked = true;
        }
        if (petData.spayedNeutered) {
            document.getElementById(`spayed-${petData.spayedNeutered}`).checked = true;
        }
        if (petData.gender) {
            document.getElementById(petData.gender).checked = true;
        }
        if (petData.training) {
            document.getElementById(petData.training).checked = true;
        }
        if (petData.vaccinationStatus) {
            document.getElementById(petData.vaccinationStatus).checked = true;
        }
    }
}



// Enable editing of the form fields including the file input
function enableEditing() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[type="file"], input[name="special-needs"], input[name="spayed-neutered"], input[name="gender"], input[name="training"], input[name="vaccination-status"]');
    inputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'file') {
            input.disabled = false;
        } else {
            input.removeAttribute('readonly');
        }
    });
}
// Function to preview the uploaded image and save it to localStorage
function previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    
    reader.onload = function() {
        const imageUrl = reader.result;
        document.getElementById('pet-photo').src = imageUrl;
        localStorage.setItem('petPhoto', imageUrl);  // Save the image as a base64 string in localStorage
    };
    
    if (file) {
        reader.readAsDataURL(file);  // Read the file and trigger onload event
    }
}

// Save the pet data to local storage
function savePetData() {
    const formData = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        birthday: document.getElementById('birthday').value,
        age: document.getElementById('age').value,
        breed: document.getElementById('breed').value,
        weight: document.getElementById('weight').value,
        specialNeeds: document.querySelector('input[name="special-needs"]:checked')?.id.split('-')[1],
        spayedNeutered: document.querySelector('input[name="spayed-neutered"]:checked')?.id.split('-')[1],
        gender: document.querySelector('input[name="gender"]:checked')?.id,
        training: document.querySelector('input[name="training"]:checked')?.id,
        vaccinationStatus: document.querySelector('input[name="vaccination-status"]:checked')?.id,
        photo: localStorage.getItem('petPhoto')  // Save the photo from localStorage

    };

    localStorage.setItem('petData', JSON.stringify(formData));
    alert('Pet data saved successfully!');
}

// Function to validate form inputs
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value.trim();
    const birthday = new Date(document.getElementById('birthday').value);
    const breed = document.getElementById('breed').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const today = new Date();

    // Clear previous messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('type-error').textContent = '';
    document.getElementById('breed-error').textContent = '';
    document.getElementById('birthday-error').textContent = '';
    document.getElementById('weight-error').textContent = '';

    let isValid = true;

    // Check if birthdate is valid or not
    if (birthday > today) {
        document.getElementById('birthday-error').textContent = "Error: Invalid birthdate.";
        isValid = false;
    }

    // Check if name, type, and breed contain invalid characters
    const invalidChars = /[^a-zA-Z\s]/; 
    if (invalidChars.test(name)) {
        document.getElementById('name-error').textContent = "Name is invalid! No numbers or symbols.";
        isValid = false;
    }
    if (invalidChars.test(type)) {
        document.getElementById('type-error').textContent = "Type is invalid! No numbers or symbols.";
        isValid = false;
    }
    if (invalidChars.test(breed)) { 
        document.getElementById('breed-error').textContent = "Breed is invalid! No numbers or symbols.";
        isValid = false;
    }

    // Check if weight is a number
    if (isNaN(weight) || weight.trim() === "") {
        document.getElementById('weight-error').textContent = "Weight must be a number.";
        isValid = false;
    } else if (!/^\d+(\.\d+)?$/.test(weight)) { 
        document.getElementById('weight-error').textContent = "Please enter valid numbers only.";
        isValid = false;
    }

    // Check if all required fields are filled
    const specialNeeds = document.querySelector('input[name="special-needs"]:checked');
    const spayedNeutered = document.querySelector('input[name="spayed-neutered"]:checked');
    const gender = document.querySelector('input[name="gender"]:checked');
    const training = document.querySelector('input[name="training"]:checked');
    const vaccinationStatus = document.querySelector('input[name="vaccination-status"]:checked');
    // Check if all required fields are filled
    if (!name || !type || !birthday || !breed || !weight || !specialNeeds || !spayedNeutered || !gender || !training || !vaccinationStatus) {
        alert('Please fill in all the required fields before proceeding to the next page.');
        isValid = false; // Prevent form submission
    }

    return isValid; // Allow form submission if valid
}

// Handle Form Submission
function handleSubmit(event) {
    if (validateForm()) {
        calculateAge(); // Calculate age before saving
        savePetData(); // Save the updated data
        // Navigate to the next page
        window.location.href = 'user profile.html';
    } else {
        event.preventDefault(); // Prevent default action if validation fails
    }
}