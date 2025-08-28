<?php
// config.php
$host = getenv("MYSQL_HOST") ?: "db";
$user = getenv("MYSQL_USER") ?: "appuser";
$pass = getenv("MYSQL_PASSWORD") ?: "apppass";
$db   = getenv("MYSQL_DATABASE") ?: "appdb";
$port = getenv("MYSQL_PORT") ?: "3306";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "error" => "DB connection failed: " . $e->getMessage()
    ]);
    exit;
}
