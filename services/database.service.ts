import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
function opt() {
  console.log("run!!");
  return {
    connectionString: process.env.DATABASE_URL,
  };
}
const pool = new Pool(opt());

export async function getQuery() {
  const rs = await pool.query(`
        SELECT * FROM few_shot_prompts;
      `);
  console.log(rs.rows);
};
