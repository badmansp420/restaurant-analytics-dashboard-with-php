import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory in Windows-safe way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to orders.json inside db folder
const ordersFile = path.join(__dirname, "orders.json");

if (!fs.existsSync(ordersFile)) {
    throw new Error(`❌ orders.json not found at: ${ordersFile}`);
}

const rawData = fs.readFileSync(ordersFile, "utf-8");
const orders = JSON.parse(rawData);

let sql = "USE restaurant;\n\nINSERT INTO orders (id, restaurant_id, order_amount, order_time) VALUES\n";

sql += orders
    .map(
        (o) =>
            `(${o.id}, ${o.restaurant_id}, ${o.order_amount}, '${o.order_time}')`
    )
    .join(",\n");

sql +=
    "\nON DUPLICATE KEY UPDATE restaurant_id=VALUES(restaurant_id), order_amount=VALUES(order_amount), order_time=VALUES(order_time);\n";

const outputFile = path.join(__dirname, "orders.sql");
fs.writeFileSync(outputFile, sql, "utf-8");

console.log(`✅ orders.sql generated successfully at ${outputFile}`);
