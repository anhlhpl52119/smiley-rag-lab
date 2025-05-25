export const SUPPORTED_LANGUAGES = {
  KOREAN: "ko",
  VIETNAMESE: "vi",
  ENGLISH: "en",
} as const;

export const TRANSLATION_DIRECTIONS = {
  KO_TO_EN: "ko-to-en",
  KO_TO_VI: "ko-to-vi",
  VI_TO_EN: "vi-to-en",
  VI_TO_KO: "vi-to-ko",
  EN_TO_KO: "en-to-ko",
  EN_TO_VI: "en-to-vi",
} as const;

export const SLACK_MESSAGE_TYPES = {
  THREAD: "thread",
  CHANNEL: "channel",
  DIRECT_MESSAGE: "direct_message",
} as const;

export const ERROR_MESSAGES = {
  INVALID_LANGUAGE: "Invalid language specified",
  TRANSLATION_FAILED: "Translation failed",
  INVALID_MESSAGE_TYPE: "Invalid message type",
} as const;

export const GEMINI_MODEL = {
  FLASH_20: "gemini-2.0-flash",
} as const;
