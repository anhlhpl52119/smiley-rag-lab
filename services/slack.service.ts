import type { App, BlockAction } from "@slack/bolt";
import { SUPPORTED_LANGUAGES } from "../constants";
// import { MessageParser } from "../utils/messageParser";
// import { GeminiService } from "./gemini.service";

export class SlackService {
  private static instance: SlackService;
  private app: App;
  // private gemini: GeminiService;
  // private parser: MessageParser;

  private constructor(app: App) {
    this.app = app;
    // this.gemini = GeminiService.getInstance();
    // this.parser = MessageParser.getInstance();
    this.setupEventHandlers();
  }

  public static getInstance(app: App): SlackService {
    if (!SlackService.instance) {
      SlackService.instance = new SlackService(app);
    }
    return SlackService.instance;
  }

  private outgoingMessageHandler() {
    //  Handle outgoing messages
    this.app.message(async ({ message, say }) => {
      try {
        console.log("passed", message);

        const typedMessage = message as any;
        if (typedMessage.subtype || typedMessage.bot_id) {
          // Skip bot messages and message subtypes
        }
        // const parsedMessage = this.parser.parseMessage(typedMessage.text);
        // const detectedLang = await this.gemini.detectLanguage(parsedMessage.text);

        // Translate to other languages
        // const translations = await Promise.all(
        //   Object.values(SUPPORTED_LANGUAGES)
        //     .filter(lang => lang !== detectedLang)
        //     .map(async (targetLang) => {
        //       const translatedText = await this.gemini.translate(
        //         parsedMessage.text,
        //         detectedLang,
        //         targetLang,
        //       );
        //       return {
        //         lang: targetLang,
        //         text: this.parser.reconstructMessage(translatedText, parsedMessage),
        //       };
        //     }),
        // );

        // Send translations directly in the channel
        // await Promise.all(
        //   translations.map(async ({ lang, text }) => {
        //     await say({
        //       // ts: typedMessage.ts,
        //       channel: typedMessage.channel,
        //       blocks: [
        //         {
        //           type: "divider",
        //         },
        //         {
        //           type: "context",
        //           elements: [
        //             {
        //               type: "mrkdwn",
        //               text: `[${lang.toUpperCase()}] ${text}`,
        //             },
        //           ],
        //         },
        //       ],
        //       token: typedMessage.token,
        //       text: `[${lang.toUpperCase()}] ${text}`,
        //     });
        //   }),
        // );

        // await say({
        //   channel: typedMessage.channel,
        //   blocks: [
        //     {
        //       type: "divider",
        //     },
        //     {
        //       type: "context",
        //       elements: [
        //         {
        //           type: "mrkdwn",
        //           text: `[${"EN".toUpperCase()}] ${message}`,
        //         },
        //       ],
        //     },
        //   ],
        //   token: typedMessage.token,
        //   text: `[${"en".toUpperCase()}] ${message}`,
        // });
      }
      catch (error) {
        console.error("Error handling outgoing message:", error);
      }
    });
  }

  private incomingMessageHandler() {
    this.app.action({ action_id: "translate_message" }, async ({ ack, body, client }) => {
      await ack();
      try {
        const actionBody = body as BlockAction;
        const messageTs = actionBody.message?.ts;
        const channelId = actionBody.channel?.id;
        const messageText = actionBody.message?.text;

        if (!messageTs || !channelId || !messageText) {
          throw new Error("Missing required message data");
        }

        const parsedMessage = this.parser.parseMessage(messageText);
        const detectedLang = await this.gemini.detectLanguage(parsedMessage.text);

        // Translate to other languages
        const translations = await Promise.all(
          Object.values(SUPPORTED_LANGUAGES)
            .filter(lang => lang !== detectedLang)
            .map(async (targetLang) => {
              const translatedText = await this.gemini.translate(
                parsedMessage.text,
                detectedLang,
                targetLang,
              );
              return {
                lang: targetLang,
                text: this.parser.reconstructMessage(translatedText, parsedMessage),
              };
            }),
        );

        // Send translations directly in the channel
        await Promise.all(
          translations.map(async ({ lang, text }) => {
            await client.chat.update({
              ts: messageTs,
              channel: channelId,
              text: `[${lang.toUpperCase()}] ${text}`,
            });
          }),
        );
      }
      catch (error) {
        console.error("Error handling translation request:", error);
      }
    });
  }

  private setupEventHandlers(): void {
    this.outgoingMessageHandler();
    // this.incomingMessageHandler()
  }
}
