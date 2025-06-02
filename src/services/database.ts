import dotenv from "dotenv";
import { Pool } from "pg";
import { embedContent } from "./gemini";

dotenv.config();
const DATABASE_URL = Bun.env.DATABASE_CONNECTION_STRING;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export async function executeQuery(q: string) {
  const res = (await pool.query(q)).rows;
  console.table(res);
}

export async function querySimilarItems(inputText: string, limit = 5) {
  if (!inputText) {
    console.error("Input text for similarity search is required.");
    return null;
  }

  console.log(`\nSearching for items similar to: "${inputText}"`);
  const inputEmbedding = await embedContent(inputText);

  if (!inputEmbedding) {
    console.error("Could not generate embedding for input text. Aborting similarity search.");
    return null;
  }
  console.log(`Input text embedded. Dimension: ${inputEmbedding.length}`);

  try {
    const inputEmbeddingString = `[${inputEmbedding.join(",")}]`;

    // Using cosine distance (<=>).
    // For L2 distance, use <->
    // For inner product, use <#> (but remember it measures similarity differently, higher is more similar)
    const similarityQuery = `
          SELECT id, result_text, source_text, embedding <=> $1 AS distance
          FROM technical_translations
          ORDER BY distance ASC -- ASC for distance (closer to 0 is more similar for cosine/L2)
          LIMIT $2;
      `;
      // If using inner product (<#>), you'd typically want ORDER BY distance DESC

    const result = await pool.query(similarityQuery, [inputEmbeddingString, limit]);

    if (result.rows.length > 0) {
      console.log(`Found ${result.rows.length} similar items:`);
      result.rows.forEach((row) => {
        console.log(`  ID: ${row.id}, Distance: ${row.distance.toFixed(4)}, Text: "${row.text_content}"`);
      });
      return result.rows;
    }
    else {
      console.log("No similar items found.");
      return [];
    }
  }
  catch (error) {
    console.error("Error performing similarity search:", error);
    return null;
  }
}
