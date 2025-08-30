<?php
function getRestaurants($pdo, $query) {
    // Base query
    $sql = "SELECT id, name, location, cuisine FROM restaurants";
    $params = [];
    $conditions = [];

    // Filtering
    if (!empty($query['name'])) {
        $conditions[] = "name LIKE :name";
        $params[':name'] = "%" . $query['name'] . "%";
    }
    if (!empty($query['cuisine'])) {
        $conditions[] = "cuisine LIKE :cuisine";
        $params[':cuisine'] = "%" . $query['cuisine'] . "%";
    }
    if (!empty($query['location'])) {
        $conditions[] = "location LIKE :location";
        $params[':location'] = "%" . $query['location'] . "%";
    }

    // Apply conditions
    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    // Sorting (optional: sort by name, cuisine, location)
    if (!empty($query['sort'])) {
        $allowedSort = ['name', 'location', 'cuisine']; // whitelist
        if (in_array($query['sort'], $allowedSort)) {
            $sql .= " ORDER BY " . $query['sort'];
            if (!empty($query['order']) && strtolower($query['order']) === 'desc') {
                $sql .= " DESC";
            } else {
                $sql .= " ASC";
            }
        }
    }

    // Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $restaurants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $restaurants;
}
