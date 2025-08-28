<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config.php";
require_once __DIR__ . "/../services/RestaurantsService.php";
require_once __DIR__ . "/../services/OrdersService.php";

// Remove query string → get only the path
$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$raw = $_SERVER['REQUEST_URI'];



switch ($request) {
    case '/':
        http_response_code(200);
        echo json_encode([
            "ok" => true,
            "data" => "Welcome to API root",
            "path" => $request,
            "pdo" => $pdo,
            "raw" => $raw
        ]);
        break;

    case '/api/restaurants':
        $restaurants = getRestaurants($pdo, $_GET); // $_GET carries query params
        echo json_encode([
            "ok" => true,
            "data" => $restaurants
        ]);
        break;

    case '/api/orders':
        $orders = getOrders($pdo, $_GET);
        echo json_encode([
            "ok" => true,
            "data" => $orders
        ]);
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "ok" => false,
            "error" => "Endpoint not found",
            "path" => $request
        ]);
        break;
}
