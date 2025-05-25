import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getQuery() {
  const rs = await pool.query(`
        SELECT * FROM few_shot_prompts;
      `);
  console.log(rs.rows);
};
