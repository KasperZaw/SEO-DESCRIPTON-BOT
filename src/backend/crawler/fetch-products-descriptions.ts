import { config } from "dotenv";
import { Buffer } from "buffer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../../../../.env") });

const env = process.env as Record<string, string | undefined>;
const WPAPI_URL = env.WPAPI_URL;
const WC_CONSUMER_KEY = env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = env.WC_CONSUMER_SECRET;

if (!WPAPI_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    throw new Error("Brakuje zmiennych w pliku .env");
}

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
       console.log("Request URL:", response.url);
console.log("Status:", response.status);

if (!response.ok) {
  console.log("Response body:", await response.text());
  throw new Error(`HTTP error! status: ${response.status}`);
}
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching product descriptions:', error);
        return [];
    }
};

void fetchProductsDescriptions();
