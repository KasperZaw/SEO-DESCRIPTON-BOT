import express from "express";
import db from "../../database/db.ts";

const app = express();

const PORT = 3000;

// funkcja do obsługi żądania GET na endpoint /api/test
app.get("/api/test", (request, response) => {
response.json({ message: "backend stoi i dziala" });
});

app.get("/api/products", (request, response) => {
  const products = db.prepare(`
    SELECT *
    FROM products
    ORDER BY id
  `).all();

  response.json(products);
});

// funkcja do odpalenia serwera na porcie 3000
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});