import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { URL } from "url";
import {
  checkExist,
  getCatURL,
  getConfig,
  getDogURL,
  getModule,
  getQuote,
  numbersTrivia,
} from "../utils/getData";
import { formatDuration, intervalToDuration } from "date-fns";

const prisma = new PrismaClient();

const parseURL = () => {
  bot.hears(/nusmods.com/, async (ctx) => {
    const inputURL = new URL(ctx.message.text);
    const modules: string[] = [];

    //Get current configs from nusmod GH
    const config = await getConfig();

    //to print out list of modules
    let modulesString = "";
    for (const modCode of inputURL.searchParams.keys()) {
      modules.push(modCode);
      modulesString += `${modCode}, `;
    }
    //Remove the last , and space
    modulesString = modulesString.slice(0, -2);
    if (modules.length === 0) {
      return ctx.replyWithPhoto(
        "https://user-images.githubusercontent.com/24467184/148671643-2d42be16-0d08-43b0-a133-e5423390d0ec.png",
        {
          caption:
            "Please send your share/sync link. Something like https://nusmods.com/timetable/sem-2/share?CS1231S=TUT:01,LEC:1&CS2106=LAB:02,TUT:09,LEC:1&ES2660=SEC:G16&GEC1015=LEC:3&MA1521=LEC:1,TUT:8",
        },
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
      if (await checkExist(module, config.academicYear)) {
        const examDate = (
          await getModule(module, config.academicYear)
        ).semesterData[config.semester - 1].examDate;
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
    const examDate = examDates[0];
    let returnString = `Your first exam is on the ${examDate.toString()}, in ${formatDuration(
      intervalToDuration({
        start: new Date(),
        end: examDate,
      }),
    )}\n\n`;
    const random = Math.floor(Math.random() * 4);
    let photoURL: string | undefined;
    if (random === 0) {
      const quote = await getQuote();
      returnString += `<i>${quote.text} <u>${quote.author}</u></i>`;
    } else if (random === 1) {
      returnString += `<i>${await numbersTrivia(
        intervalToDuration({
          start: new Date(),
          end: examDate,
        }).hours || 9,
      )}</i>`;
    } else if (random === 2) {
      photoURL = await getCatURL();
    } else if (random === 3) {
      photoURL = await getDogURL();
    }
    if (photoURL) {
      return ctx
        .replyWithPhoto(photoURL, {
          caption: returnString,
          parse_mode: "HTML",
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return ctx.replyWithHTML(returnString).catch((e) => {
        console.log(e);
      });
    }
  });
};

export default parseURL;
