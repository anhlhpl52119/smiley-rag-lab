import { writeFile } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import { data } from "../data/dummy1";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getEmbeddedContent(contents: string) {
  return ai.models.embedContent({
    model: "gemini-embedding-exp-03-07",
    contents,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });
}

async function main() {
  const res = await getEmbeddedContent(data[0].content);
  // const res = await Promise.all(data.map(i => getEmbeddedContent(i.content)));

  console.log(res);
}

main();
