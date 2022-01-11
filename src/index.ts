import { Message } from "typegram";
import { Telegraf } from "telegraf";

import config from "./config";

import bot from "./lib/bot";
import helper from "./commands/helper";

import { toEscapeHTMLMsg } from "./utils/messageHandler";
import catchAll from "./commands/catch-all";
import parseURL from "./commands/parse";
import { notifyAllExams } from "./utils/notifier";
import express from "express";
// rest of the code remains same
const app = express();

//Production Settings
if (process.env.NODE_ENV === "production") {
  //Production Logging
  bot.use((ctx, next) => {
    if (
      ctx.message &&
      config.LOG_GROUP_ID &&
      ctx.message.from.id !== config.ADMIN_TELE_ID
    ) {
      let userInfo: string;
      if (ctx.message.from.username) {
        userInfo = `name: <a href="tg://user?id=${
          ctx.message.from.id
        }">${toEscapeHTMLMsg(ctx.message.from.first_name)}</a> (@${
          ctx.message.from.username
        })`;
      } else {
        userInfo = `name: <a href="tg://user?id=${
          ctx.message.from.id
        }">${toEscapeHTMLMsg(ctx.message.from.first_name)}</a>`;
      }
      const text = `\ntext: ${
        (ctx.message as Message.TextMessage).text
      }`;
      const logMessage = userInfo + toEscapeHTMLMsg(text);
      bot.telegram.sendMessage(config.LOG_GROUP_ID, logMessage, {
        parse_mode: "HTML",
      });
    }
    return next();
  });
  bot.telegram.setWebhook(`${config.URL}/telegramBot`);
  app.use(bot.webhookCallback(`/telegramBot`));
} else {
  //Development logging
  bot.use(Telegraf.log());
  bot.launch();
}

helper();
parseURL();

app.get(`/${config.NOTIFY_PATH}`, (req, res) => {
  notifyAllExams();
});

app.get("/", (req, res) => {
  res.redirect("http://go.francisyzy.com/exam-reminder-bot-telegram");
});

app.listen(config.PORT, () => {
  console.log(`⚡️[server]: Server is running at ${config.PORT}`);
});

//Catch all unknown messages/commands
catchAll();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
