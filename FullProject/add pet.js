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



// Enable editing of the form fields
function enableEditing() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input[name="special-needs"], input[name="spayed-neutered"], input[name="gender"], input[name="training"], input[name="vaccination-status"]');
    inputs.forEach(input => {
        if (input.type === 'radio') {
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
        document.getElementById('profile-pic').src = imageUrl;
        localStorage.setItem('petPhoto', imageUrl);  // Save the image as a base64 string in localStorage
    };

    if (file) {
        reader.readAsDataURL(file);  // Read the file and trigger onload event
    }
}

// Handle Form Submission with the image
function handleSubmit() {
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

    localStorage.setItem('petData', JSON.stringify(formData));  // Save all form data in localStorage
}
