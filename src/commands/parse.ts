import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { URL } from "url";
import { checkExist, getModule } from "../utils/getData";

const prisma = new PrismaClient();

const semester = 2;

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
        "Please send your share/sync link. Like https://nusmods.com/timetable/sem-2/share?CS1231S=TUT:01,LEC:1&CS2106=LAB:02,TUT:09,LEC:1&ES2660=SEC:G16&GEC1015=LEC:3&MA1521=LEC:1,TUT:8",
      );
    }
    await prisma.user.update({
      where: { telegramId: ctx.from.id },
      data: { modules: modules, firstExam: null },
    });
    ctx.reply(
      `You have registered the following modules: ${modulesString}`,
    );

    let examDates: Date[] = [];
    for await (const module of modules) {
      if (await checkExist(module)) {
        const examDate = (await getModule(module)).semesterData[
          semester - 1
        ].examDate;
        if (examDate) {
          examDates.push(new Date(examDate));
        }
      }
    }
    examDates.sort(
      (date1, date2) => date1.getTime() - date2.getTime(),
    );
    if (examDates.length === 0) {
      return ctx.reply("You have no exams");
    }
    await prisma.user.update({
      where: { telegramId: ctx.from.id },
      data: { firstExam: examDates[0] },
    });
    return ctx.reply(
      `Your first exam is on the ${examDates[0].toString()}`,
    );
  });
};

export default parseURL;
