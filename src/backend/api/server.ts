import express from "express";
import db from "../../database/db.ts";
import { fetchProductsDescriptions } from "../crawler/fetch-products-descriptions.ts";
import { generateAllDescriptions } from "../AI/update_desc.ts";
import { publishAllDescriptions } from "../updateProducts/update-products.ts";

const app = express();
const PORT = 3000;

app.get("/api/products", (request, response) => {
  const products = db.prepare(`
    SELECT *
    FROM products
    ORDER BY id
  `).all();

  response.json(products);
});

app.post("/api/refresh", async (request, response) => {
  await fetchProductsDescriptions();

  response.json({
    success: true,
    message: "Products fetched and refreshed successfully.",
  })
});

app.post("/api/descriptions/generate-all", async (request, response) => {
  try {
    const result = await generateAllDescriptions();
    response.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ success: false, message });
  }
});

app.post("/api/descriptions/publish-all", async (request, response) => {
  try {
    const result = await publishAllDescriptions();
    response.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    response.status(500).json({ success: false, message });
  }
});

// funkcja do odpalenia serwera na porcie 3000
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
