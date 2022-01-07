import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { URL } from "url";

const prisma = new PrismaClient();

const parseURL = () => {
  bot.hears(/nusmods.com/, async (ctx) => {
    const inputURL = new URL(ctx.message.text);
    const modules: string[] = [];
    let modulesString = "";
    for (const modCode of inputURL.searchParams.keys()) {
      modules.push(modCode);
      modulesString += `${modCode}, `;
    }
    modulesString = modulesString.slice(0, -2);
    if (modules.length === 0) {
      return ctx.reply(
        "Please send your share/sync link. Like https://nusmods.com/timetable/sem-2/share?CS1231S=TUT:09,LEC:1&CS2106=LAB:07,TUT:12,LEC:1&ES2660=SEC:G18&GEC1015=LEC:3&MA1521=LEC:1,TUT:1",
      );
    }
    await prisma.user.update({
      where: { telegramId: ctx.from.id },
      data: { modules: modules },
    });
    return ctx.reply(
      `You have registered the following modules: ${modulesString}`,
    );
  });
};

export default parseURL;
