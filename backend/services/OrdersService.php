<?php

function getOrders($pdo, $query) {
    $sql = "SELECT o.id, o.restaurant_id, r.name AS restaurant_name, o.order_amount, o.order_time
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id";

    $params = [];
    $conditions = [];

    if (!empty($query['restaurant_id'])) {
        $conditions[] = "o.restaurant_id = :restaurant_id";
        $params[':restaurant_id'] = $query['restaurant_id'];
    }

    if (!empty($query['start_date'])) {
        $conditions[] = "o.order_time >= :start_date";
        $params[':start_date'] = $query['start_date'];
    }

    if (!empty($query['end_date'])) {
        $conditions[] = "o.order_time <= :end_date";
        $params[':end_date'] = $query['end_date'];
    }

    if ($conditions) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
