import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { toEscapeHTMLMsg } from "../utils/messageHandler";
import { getBotCommands } from "../utils/botCommands";
import { checkExist, getModule } from "../utils/getData";

const prisma = new PrismaClient();
//General helper commands
const helper = () => {
  //All bots start with /start
  bot.start(async (ctx) => {
    ctx.setMyCommands(getBotCommands());
    await prisma.user.upsert({
      where: { telegramId: ctx.from.id },
      update: { name: ctx.from.first_name },
      create: { telegramId: ctx.from.id, name: ctx.from.first_name },
    });
    return ctx.replyWithHTML(
      `Welcome to Exam notification bot. Send me your NUS Mods link and I will remind you about your exams!\n/help to learn more about the bot`,
    );
  });

  bot.command("account", async (ctx) => {
    const user = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id },
    });
    if (user) {
      return ctx.replyWithHTML(
        `<b>Name</b>: ${toEscapeHTMLMsg(
          user.name,
        )} \n<b>PhoneNo.</b>: ${user.createdAt}`,
      );
    } else {
      return ctx.reply("Please /start to create an account");
    }
  });
  bot.help((ctx) => ctx.reply("Help message"));
};

export default helper;
