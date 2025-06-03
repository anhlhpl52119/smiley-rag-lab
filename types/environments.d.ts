// src/global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY: string;
    DATABASE_CONNECTION_STRING: string;
    ENVIRONMENT: "DEV" | "PROD";
  }
}
