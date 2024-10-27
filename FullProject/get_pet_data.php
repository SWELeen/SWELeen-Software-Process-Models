<?php
// get_pet_data.php

include 'db_connection.php';

$sql = "SELECT * FROM pets";
$result = $conn->query($sql);

$pets = array();
while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

echo json_encode($pets);

$conn->close();
?>
