<?php
// save_pet_data.php

include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['ID'];
    $name = $_POST['name'];
    $type = $_POST['type'];
    $birthday = $_POST['birthday'];
    $age = $_POST['age'];
    $breed = $_POST['breed'];
    $weight = $_POST['weight'];
    $specialNeeds = $_POST['specialNeeds'];
    $gender = $_POST['gender'];
    $training = $_POST['training'];
    $vaccinationStatus = $_POST['vaccinationStatus'];

    $sql = "INSERT INTO pets (id, name, type, birthday, age, breed, weight, specialNeeds, gender, training, vaccinationStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssissssss", $id, $name, $type, $birthday, $age, $breed, $weight, $specialNeeds, $gender, $training, $vaccinationStatus);

    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
$conn->close();
?>
