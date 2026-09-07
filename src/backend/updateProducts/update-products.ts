import { Buffer } from "node:buffer";
import { pathToFileURL } from "node:url";
import db from "../../database/db.ts";

const WPAPI_URL = process.env.WPAPI_URL;
const SHOP_ID = process.env.SHOP_ID;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WPAPI_URL || !SHOP_ID || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error("Brakuje SHOP_ID, WPAPI_URL lub danych WooCommerce w pliku .env");
}

type GeneratedProduct = {
  id: number;
  wp_product_id: number;
  generated_description: string;
  generated_short_description: string;
};

const productsReadyToPublish = db.prepare(`
    SELECT
    id,
    wp_product_id,
    generated_description,
    generated_short_description
    FROM products
    WHERE shop_id = @shop_id
    AND ai_status = 'generated'
    AND generated_description IS NOT NULL
    AND generated_short_description IS NOT NULL
    AND publish_status IN ('draft', 'queued', 'failed')
    ORDER BY id
`).all() as GeneratedProduct[];

const markAsPublishing = db.prepare(`
  UPDATE products
  SET
    publish_status = 'publishing',
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const markAsPublished = db.prepare(`
  UPDATE products
  SET
    publish_status = 'published',
    last_error = NULL,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const markAsFailed = db.prepare(`
  UPDATE products
  SET
    publish_status = 'failed',
    retry_count = retry_count + 1,
    last_error = @error,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = @id
`);

const auth = Buffer.from(
  `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`,
).toString("base64");

const updateProduct = async (product: GeneratedProduct): Promise<boolean> => {
  markAsPublishing.run(product.id);

  try {
    const response = await fetch(
      `${WPAPI_URL.replace(/\/$/, "")}/${product.wp_product_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: product.generated_description,
          short_description: product.generated_short_description,
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WooCommerce HTTP ${response.status}: ${errorBody}`);
    }

    markAsPublished.run(product.id);
    console.log(`Opublikowano produkt WooCommerce ID: ${product.wp_product_id}`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    markAsFailed.run({
      id: product.id,
      error: errorMessage,
    });

    console.error(
      `Błąd publikacji produktu WooCommerce ID ${product.wp_product_id}:`,
      errorMessage,
    );
    return false;
  }
};

export const publishAllDescriptions = async () => {
  const products = productsReadyToPublish.all({ shop_id: SHOP_ID }) as GeneratedProduct[];
  let published = 0;
  let failed = 0;

  for (const product of products) {
    const success = await updateProduct(product);
    success ? published++ : failed++;
  }

  return { processed: products.length, published, failed };
};

const isRunDirectly = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isRunDirectly) {
  await publishAllDescriptions();
}
