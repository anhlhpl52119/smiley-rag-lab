import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { getQuery } from "./services/database.service";

// Load environment variables
dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

(async () => {
  if (process.env.IS_DEV) {
    console.table({
      SlackBotToken: process.env.SLACK_BOT_TOKEN,
      SigningSecret: process.env.SLACK_SIGNING_SECRET,
      AppToken: process.env.SLACK_APP_TOKEN,
    });
    getQuery();
  }

  // Start your app
  await app.start(process.env.PORT || 3000);

  app.logger.info("⚡️ Bolt app is running!");
})();
