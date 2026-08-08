import { config } from "dotenv";
import { Buffer } from "buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "../../database/db.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../../../../.env") });

const env = process.env as Record<string, string | undefined>;
const WPAPI_URL = env.WPAPI_URL;
const WC_CONSUMER_KEY = env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = env.WC_CONSUMER_SECRET;

type Product = {
  id: number;
  wp_product_id: number;
  name: string;
  description: string;
  short_description: string | null;

  generated_description: string | null;
  generated_short_description: string | null;

  ai_status: "queued" | "processing" | "generated" | "failed";
  publish_status: "draft" | "queued" | "publishing" | "published" | "failed";

  retry_count: number;
  last_error: string | null;

  created_at: string;
  updated_at: string;
};

if (!WPAPI_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    throw new Error("Brakuje zmiennych w pliku .env");
}

const insertProduct = db.prepare(`
  INSERT INTO products (
    shop_id,
    wp_product_id,
    name,
    description,
    short_description,
    generated_description,
    generated_short_description
  ) VALUES (
    @shop_id,
    @wp_product_id,
    @name,
    @description,
    @short_description,
    @generated_description,
    @generated_short_description
  )
`);

const createAuth = (): string => {
    return Buffer.from(
        `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString("base64");
}

const fetchProductsDescriptions = async () => {
    try {
        const auth = createAuth();
        const response = await fetch(WPAPI_URL, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
 
      const data = await response.json();
      data.forEach((product: any) => {
        console.log(`Product ID: ${product.id}, Description: ${product.description}`);
        insertProduct.run({
            shop_id: WPAPI_URL,
            wp_product_id: product.id,
            name: product.name,
            description: product.description,
            short_description: product.short_description,
            generated_description: null,
            generated_short_description: null,
        });
      });

    if (!response.ok) {
    console.log("Response body:", await response.text());
    throw new Error(`HTTP error! status: ${response.status}`);
    }

    } catch (error) {
        console.error('Error fetching product descriptions:', error);
        return [];
    }
};

void fetchProductsDescriptions();
