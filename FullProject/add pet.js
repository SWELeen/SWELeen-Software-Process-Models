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
    document.getElementById('age').value = age;
}

// Preview uploaded image, display it, and prepare for AJAX upload if needed
function previewImage(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    
    reader.onload = function() {
        const imageUrl = reader.result;
        document.getElementById('pet-photo').src = imageUrl;
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
}

// AJAX function to send data to the server via PHP
function savePetData() {
    const formData = new FormData();

    // Append all form fields
    formData.append('name', document.getElementById('name').value);
    formData.append('ID', document.getElementById('ID').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('birthday', document.getElementById('birthday').value);
    formData.append('age', document.getElementById('age').value);
    formData.append('breed', document.getElementById('breed').value);
    formData.append('weight', document.getElementById('weight').value);
    
    // Instead of using the base64 URL, get the file directly
    const fileInput = document.getElementById('photo-upload');
    if (fileInput.files[0]) {
        formData.append('photo', fileInput.files[0]); // Append the file directly
    }
    
    formData.append('specialNeeds', document.querySelector('input[name="special-needs"]:checked')?.value);
    formData.append('spayedNeutered', document.querySelector('input[name="spayed-neutered"]:checked')?.value);
    formData.append('gender', document.querySelector('input[name="gender"]:checked')?.value);
    formData.append('training', document.querySelector('input[name="training"]:checked')?.value);
    formData.append('vaccinationStatus', document.querySelector('input[name="vaccination-status"]:checked')?.value);

    fetch('save_pet_data.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert('Pet data saved successfully!');
        console.log(data); // Optional: See the response for debugging
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Form validation function
function validateForm() {
    const ID = document.getElementById('ID').value.trim();
    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value.trim();
    const birthday = new Date(document.getElementById('birthday').value);
    const breed = document.getElementById('breed').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const today = new Date();

    // Clear previous messages
    document.getElementById('ID-error').textContent = '';
    document.getElementById('name-error').textContent = '';
    document.getElementById('type-error').textContent = '';
    document.getElementById('breed-error').textContent = '';
    document.getElementById('birthday-error').textContent = '';
    document.getElementById('weight-error').textContent = '';

    let isValid = true;

    if (!['1', '2', '3'].includes(ID)) {
        document.getElementById('ID-error').textContent = "ID must be 1, 2, or 3.";
        isValid = false;
    }

    if (birthday > today) {
        document.getElementById('birthday-error').textContent = "Error: Invalid birthdate.";
        isValid = false;
    }

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

    if (isNaN(weight) || weight.trim() === "") {
        document.getElementById('weight-error').textContent = "Weight must be a number.";
        isValid = false;
    } else if (!/^\d+(\.\d+)?$/.test(weight)) { 
        document.getElementById('weight-error').textContent = "Please enter valid numbers only.";
        isValid = false;
    }

    if (isNaN(ID) || ID.trim() === "") {
        document.getElementById('ID-error').textContent = "ID must be a number.";
        isValid = false;
    } else if (!/^\d+(\.\d+)?$/.test(ID)) { 
        document.getElementById('ID-error').textContent = "Please enter valid numbers only.";
        isValid = false;
    }

    if (!name || !type || !birthday || !breed || !weight || !document.querySelector('input[name="special-needs"]:checked') || !document.querySelector('input[name="spayed-neutered"]:checked') || !document.querySelector('input[name="gender"]:checked') || !document.querySelector('input[name="training"]:checked') || !document.querySelector('input[name="vaccination-status"]:checked') || !ID) {
        alert('Please fill in all the required fields before proceeding to the next page.');
        isValid = false;
    }

    return isValid;
}

// Handle Form Submission
function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
        calculateAge();
        savePetData(); // Save data after validating
        // Redirect to user profile only after the save process (you may handle this in the PHP file)
        window.location.href = 'user profile.html'; // Ensure URL matches your file
    }
}
