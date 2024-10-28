// Function to calculate the pet's age based on the birthday
function calculateAge3() {
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
function loadPetData3() {
    const petData3 = JSON.parse(localStorage.getItem('petData3'));
    if (petData3) {
        document.getElementById('ID').value = petData3.ID;
        document.getElementById('name').value = petData3.name;
        document.getElementById('type').value = petData3.type;
        document.getElementById('birthday').value = petData3.birthday;
        document.getElementById('age').value = petData3.age;
        document.getElementById('breed').value = petData3.breed;
        document.getElementById('weight').value = petData3.weight;

        if (petData3.photo) {
            document.getElementById('pet-photo').src = petData3.photo;  // Set the pet photo
        }

        if (petData3.specialNeeds) {
            document.getElementById(`special-${petData3.specialNeeds}`).checked = true;
        }
        if (petData3.spayedNeutered) {
            document.getElementById(`spayed-${petData3.spayedNeutered}`).checked = true;
        }
        if (petData3.gender) {
            document.getElementById(petData3.gender).checked = true;
        }
        if (petData3.training) {
            document.getElementById(petData3.training).checked = true;
        }
        if (petData3.vaccinationStatus) {
            document.getElementById(petData3.vaccinationStatus).checked = true;
        }
    }
}



// Enable editing of the form fields including the file input
function enableEditing3() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[type="file"], input[name="special-needs"], input[name="spayed-neutered"], input[name="gender"], input[name="training"], input[name="vaccination-status"]');
    inputs.forEach(input => {
        // Check if the input is the ID field
        if (input.id === 'ID') {
            input.readOnly = true; // Keep ID readonly
        } else if (input.type === 'radio' || input.type === 'file') {
            input.disabled = false;
        } else {
            input.removeAttribute('readonly');
        }
    });
}
// Function to preview the uploaded image and save it to localStorage
function previewImage3(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = function() {
        const imageUrl = reader.result;
        document.getElementById('pet-photo').src = imageUrl;
        localStorage.setItem('petPhoto3', imageUrl);  // Save the image as a base64 string in localStorage
    };

    if (file) {
        reader.readAsDataURL(file);  // Read the file and trigger onload event
    }
}

// Save the pet data to local storage
function savePetData3() {
    const formData = {
        name: document.getElementById('name').value,
        ID: document.getElementById('ID').value,
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
        photo: localStorage.getItem('petPhoto3')  // Save the photo from localStorage

    };

    localStorage.setItem('petData3', JSON.stringify(formData));
    alert('Pet data saved successfully!');
}

// Function to validate form inputs
function validateForm3() {

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

    // Check if weight and id are number
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
    if (!name || !type || !birthday || !breed || !weight || !specialNeeds || !spayedNeutered || !gender || !training || !vaccinationStatus || !ID) {
        alert('Please fill in all the required fields before proceeding to the next page.');
        isValid = false; // Prevent form submission
    }

    return isValid; // Allow form submission if valid
}

// Handle Form Submission
function handleSubmit3(event) {
    if (validateForm3()) {
        calculateAge3(); // Calculate age before saving
        savePetData3(); // Save the updated data
        // Navigate to the next page
        window.location.href = 'user profile.html';
    } else {
        event.preventDefault(); // Prevent default action if validation fails
    }
}
// Function to delete all saved pet data
function deletePetData3() {
    if (confirm('Are you sure you want to delete all pet data except the ID? This action cannot be undone.')) {
        const petData3 = JSON.parse(localStorage.getItem('petData3')) || {};
        
        // Preserve the ID value
        const preservedID = petData3.ID;

        // Clear all pet data except ID
        localStorage.removeItem('petPhoto3'); // Remove photo as well
        localStorage.setItem('petData3', JSON.stringify({ ID: preservedID })); // Re-save only the ID

        alert('All pet data deleted successfully!');
        window.location.href = 'user profile.html'; // Redirect to user profile page
    }
}

// Function to reset form fields
function resetFormFields3() {
    document.getElementById('ID').value = '3';
    document.getElementById('name').value = '';
    document.getElementById('type').value = '';
    document.getElementById('birthday').value = '';
    document.getElementById('age').value = '';
    document.getElementById('breed').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('pet-photo').src = 'pets.png'; // Reset to default image

    // Uncheck all radio buttons
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}