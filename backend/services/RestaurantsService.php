<?php

function getRestaurants($pdo, $query) {
    // Basic query
    $sql = "SELECT * FROM restaurants";

    // Optional filtering by name or cuisine
    $params = [];
    if (!empty($query['name'])) {
        $sql .= " WHERE name LIKE :name";
        $params[':name'] = "%" . $query['name'] . "%";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
