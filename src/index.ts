import { executeQuery, querySimilarItems } from "./services/database";

async function execute() {
  // await executeQuery(`
  //   SELECT id, source_nation, result_nation, source_text
  //   FROM technical_translations
  //   `);

  const rs = await querySimilarItems("sandbox environment");
  console.log(rs);
}

execute();
