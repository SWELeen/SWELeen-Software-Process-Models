<?php
$servername = "localhost";  
$username = "root";         
$password = "";             
$dbname = "aleefdatabase";  

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if request is POST to insert data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capture the input data
    $name = $_POST['name'];
    $type = $_POST['type'];
    $birthday = $_POST['birthday'];
    $breed = $_POST['breed'];
    $weight = $_POST['weight'];
    $specialNeeds = isset($_POST['specialNeeds']) ? $_POST['specialNeeds'] : 'No';
    $spayedNeutered = isset($_POST['spayedNeutered']) ? $_POST['spayedNeutered'] : 'No';
    $gender = isset($_POST['gender']) ? $_POST['gender'] : 'Unknown';
    $training = isset($_POST['training']) ? $_POST['training'] : 'None';
    $vaccinationStatus = isset($_POST['vaccinationStatus']) ? $_POST['vaccinationStatus'] : 'Unknown';

    // Prepare and execute SQL query to insert data
    $sql = "INSERT INTO pets (name, type, birthday, breed, weight, specialNeeds, spayedNeutered, gender, training, vaccinationStatus)
            VALUES ('$name', '$type', '$birthday', '$breed', '$weight', '$specialNeeds', '$spayedNeutered', '$gender', '$training', '$vaccinationStatus')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
