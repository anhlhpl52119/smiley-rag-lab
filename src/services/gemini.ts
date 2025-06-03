import { GoogleGenAI } from "@google/genai";
import { GEMINI_EMBEDDING_MODEL } from "../constants/gemini.constant";

const GEMINI_API_KEY = Bun.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function embedContent(content: string) {
  if (!content.length) {
    return [];
  }

  console.log("Embedding Content: ", content);
  console.log("Wait for Gemini response....");
  const response = await ai.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL.TEXT_004,
    contents: content,
  });
  console.log("Embedded Success! Vector Length: ", response?.embeddings?.[0]?.values?.length);
  return response?.embeddings?.[0]?.values || [];
}
