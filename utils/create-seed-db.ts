import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

async function executeSqlFile(filePath: string, pgClient: Client) {
  try {
    // 1. Read the SQL file content
    console.log(filePath);
    const sqlCommands = await readFileSync(filePath, "utf8");
    console.log(`Read SQL file: ${filePath}`);

    // 2. Execute the SQL commands
    // node-pg can execute multiple statements separated by semicolons in a single query call.
    await pgClient.query(sqlCommands);
    console.log("Successfully executed SQL commands from the file.");
    return true;
  }
  catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    return false;
  }
}

// --- Main Execution ---
async function main() {
  const pgClient = new Client({ connectionString: Bun.env.DATABASE_CONNECTION_STRING });

  try {
    // 1. Connect to the database
    await pgClient.connect();
    console.log("Connected to PostgreSQL database.");

    // 2. Execute the seed file
    console.log("__dirname", __dirname);
    const success = await executeSqlFile(join(__dirname, "../db/seed.sql"), pgClient);

    if (success) {
      console.log("Seed data generation completed successfully.");
    }
    else {
      console.log("Seed data generation failed.");
    }
  }
  catch (error) {
    console.error("Failed to connect or execute main process:", error);
  }
  finally {
    // 3. Close the database connection
    await pgClient.end();
    console.log("Disconnected from PostgreSQL database.");
  }
}

main();
