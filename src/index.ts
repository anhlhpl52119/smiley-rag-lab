import { writeFile } from "node:fs";
import data from "../data/source.json";
import { executeQuery } from "./services/database";
import { embedContent } from "./services/gemini";

interface Structure {
  ko: string;
  vi: string;
}
interface DBStruct {
  source_nation: string;
  result_nation: string;
  source_text: string;
  result_text: string;
  embedding: string;
}

function objStruct(source: Structure, embedding: string): DBStruct {
  return {
    source_nation: "Korean",
    result_nation: "Vietnamese",
    source_text: source.ko,
    result_text: source.vi,
    embedding,
  };
}

function queryDb(arr: DBStruct[]) {
  if (!arr.length) {
    console.error("Content Empty");
    return "";
  }
  const into = `(${Object.keys(arr[0]!).join(", ")})`;
  const values = arr.map(i => `(${Object.values(i).map(value => `'${value}'`).join(", ")})`).join(", ");
  return `
  INSERT INTO technical_translations ${into}
  VALUES ${values}
  RETURNING id
  `;
}

async function execute() {
  const struct: Structure[] = JSON.parse(JSON.stringify(data));
  const arr: DBStruct[] = [];

  for (const i of struct) {
    const embedded = await embedContent(i.ko);
    if (!embedded.length) {
      console.log("FAILED to resolve text: ", i.ko);
      return;
    }

    const embeddingString = `[${embedded.join(",")}]`;
    arr.push(objStruct(i, embeddingString));
  }

  const query = queryDb(arr);
  writeFile("/Users/brim/Desktop/project/lab/bun-sqlite/cache/temp.sql", query, err => console.log(err));
  await executeQuery(query);
}

execute();
