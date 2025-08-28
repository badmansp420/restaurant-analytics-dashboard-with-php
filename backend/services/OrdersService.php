<?php

function getOrders($pdo, $query) {
    $sql = "SELECT o.id, o.restaurant_id, r.name AS restaurant_name, 
                   o.order_amount, o.order_time
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id";

    $params = [];
    $conditions = [];

    // 🔹 Filter by restaurant
    if (!empty($query['restaurant_id'])) {
        $conditions[] = "o.restaurant_id = :restaurant_id";
        $params[':restaurant_id'] = $query['restaurant_id'];
    }

    // 🔹 Filter by start date
    if (!empty($query['start_date'])) {
        $conditions[] = "o.order_time >= :start_date";
        $params[':start_date'] = $query['start_date'];
    }

    // 🔹 Filter by end date
    if (!empty($query['end_date'])) {
        $conditions[] = "o.order_time <= :end_date";
        $params[':end_date'] = $query['end_date'];
    }

    // Apply WHERE clause if filters exist
    if ($conditions) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    // 🔹 Sorting
    $allowedSort = ['id', 'order_amount', 'order_time', 'restaurant_name'];
    $sortBy = !empty($query['sort_by']) && in_array($query['sort_by'], $allowedSort) 
        ? $query['sort_by'] 
        : 'order_time';

    $sortOrder = (!empty($query['sort_order']) && strtolower($query['sort_order']) === 'asc') 
        ? 'ASC' 
        : 'DESC';

    $sql .= " ORDER BY $sortBy $sortOrder";

    // 🔹 Pagination
    $page = !empty($query['page']) ? max(1, (int)$query['page']) : 1;
    $limit = !empty($query['limit']) ? max(1, (int)$query['limit']) : 10;
    $offset = ($page - 1) * $limit;

    // Count total
    $countSql = "SELECT COUNT(*) FROM orders o";
    if ($conditions) {
        $countSql .= " WHERE " . implode(" AND ", $conditions);
    }
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();

    // Apply LIMIT
    $sql .= " LIMIT :limit OFFSET :offset";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        "data" => $data,
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => (int)$total,
            "pages" => ceil($total / $limit)
        ]
    ];
}
