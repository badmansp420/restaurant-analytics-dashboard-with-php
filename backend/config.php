<?php
$host = getenv("MYSQL_HOST") ?: "db"; // default to 'db'
$user = getenv("MYSQL_USER") ?: "appuser";
$pass = getenv("MYSQL_PASSWORD") ?: "apppass";
$db   = getenv("MYSQL_DATABASE") ?: "appdb";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
