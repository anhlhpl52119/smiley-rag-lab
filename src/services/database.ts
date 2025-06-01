import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const DATABASE_URL = Bun.env.DATABASE_CONNECTION_STRING;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export async function executeQuery(q: string) {
  const res = (await pool.query(q)).command;
}
