import {
  PRODUCT_DESCRIPTION_PROMPT,
  SYSTEM_PROMPT,
} from "./product-description.prompt.ts";
import { writeFile } from "node:fs/promises";
import db from "../../database/db.ts";

type Product = {
  id: number;
  wp_product_id: number;
  name: string;
  description: string | null;
  short_description: string | null;
};

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type GeneratedDescription = {
  description: string;
  short_description: string;
};

const products = db.prepare(`
  SELECT
    id,
    wp_product_id,
    name,
    description,
    short_description
  FROM products
  WHERE ai_status = 'queued'
  ORDER BY id
`).all() as Product[];

const saveGeneratedDescription = db.prepare(`
  UPDATE products
  SET
    generated_description = @description,
    generated_short_description = @short_description,
    ai_status = 'generated',
    last_error = NULL,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = @id
`);

const saveGenerationError = db.prepare(`
  UPDATE products
  SET
    ai_status = 'failed',
    retry_count = retry_count + 1,
    last_error = @error,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = @id
`);

const updateDescription = async (product: Product) => {
  try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4.1-mini",
                max_tokens: 8000,
                response_format: { type: "json_object" },
                messages: [
                  {
                    role: "system",
                    content: SYSTEM_PROMPT
                  },
                  {
                    role: "user",
                    content: `
                    ${PRODUCT_DESCRIPTION_PROMPT}

                    DANE PRODUKTU:
                    Nazwa: ${product.name}
                    Obecny opis:
                    ${product.description ?? "Brak opisu"}

                    Obecny krótki opis:
                    ${product.short_description ?? "Brak krótkiego opisu"}
                    `
                  },
                ],
              }),
            });
            if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(`OpenAI HTTP ${response.status}: ${errorBody}`);
            }

            const data = await response.json() as OpenAIResponse;
            await writeFile(
              new URL("./ai-response.json", import.meta.url),
              JSON.stringify(data, null, 2),
              "utf8",
            );
            console.log("Odpowiedź AI zapisana do ai-response.json");
            
            const aiResponse = data.choices?.[0]?.message?.content;
            if (!aiResponse) {
              throw new Error("AI nie zwróciło treści");
            }

            const generated = JSON.parse(aiResponse) as GeneratedDescription;

            if (
              typeof generated.description !== "string" ||
              typeof generated.short_description !== "string"
            ) {
              throw new Error("Odpowiedź AI ma nieprawidłową strukturę");
            }

            saveGeneratedDescription.run({
              id: product.id,
              description: generated.description,
              short_description: generated.short_description,
            });

            console.log(`Opis zapisany w SQLite: ${product.name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    saveGenerationError.run({
      id: product.id,
      error: errorMessage,
    });

    console.error(`Błąd dla produktu ${product.name}:`, errorMessage);
  }
};

for (const product of products) {
  console.log(`Przetwarzanie produktu: ${product.name} (ID: ${product.id})`);
  await updateDescription(product);
}
