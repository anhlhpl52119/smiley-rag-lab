import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const DATABASE_URL = Bun.env.DATABASE_CONNECTION_STRING;
const DB_NAME = "technical_translations";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

(async function setup() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE ${DB_NAME} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      source_nation TEXT NOT NULL,
      result_nation TEXT NOT NULL,
      source_text TEXT NOT NULL,
      result_text TEXT NOT NULL ,
      embedding VECTOR(768)
    );
    `);
})();

export async function executeQuery(q: string) {
  const res = (await pool.query(q)).command;
  console.log(res);
}
