import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { getBotCommands } from "../utils/botCommands";
import { notifyExams } from "../utils/notifier";
import config from "../config";

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
      `Welcome to Exam notification bot ${ctx.from.first_name}. Send me your NUS Mods share link and I will remind you about your exams!\n/help to learn more about the bot`,
    );
  });

  bot.command("send", async (ctx) => {
    if (ctx.from.id === config.ADMIN_TELE_ID) {
      notifyExams();
    }
  });

  bot.help((ctx) =>
    ctx.replyWithHTML(
      `Hi ${ctx.from.first_name}, send a link like the following from <a href="https://nusmods.com">nusmods</a> and I will set your exam reminder. https://nusmods.com/timetable/sem-2/share?CS1231S=TUT:01,LEC:1&CS2106=LAB:02,TUT:09,LEC:1&ES2660=SEC:G16&GEC1015=LEC:3&MA1521=LEC:1,TUT:8\n\n<i>For bug reports, please create an issue at <a href="http://go.francisyzy.com/exam-reminder-bot-issues">Github</a></i>`,
    ),
  );
};

export default helper;
