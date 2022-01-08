import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { sleep } from "./sleep";
import {
  getCatURL,
  getDogURL,
  getQuote,
  numbersTrivia,
} from "./getData";

const prisma = new PrismaClient();

export async function notifyExams(): Promise<void> {
  const users = await prisma.user.findMany({
    where: { NOT: { firstExam: null } },
  });

  for await (const user of users) {
    if (user.firstExam) {
      let returnString = `Your first exam is in ${formatDuration(
        intervalToDuration({
          start: new Date(),
          end: user.firstExam,
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
            end: user.firstExam,
          }).hours || 9,
        )}</i>`;
      } else if (random === 2) {
        photoURL = await getCatURL();
      } else if (random === 3) {
        photoURL = await getDogURL();
      }
      if (photoURL) {
        bot.telegram
          .sendPhoto(user.telegramId, photoURL, {
            caption: returnString,
            parse_mode: "HTML",
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        bot.telegram
          .sendMessage(user.telegramId, returnString, {
            parse_mode: "HTML",
          })
          .catch((e) => {
            console.log(e);
          });
      }
      await sleep(0.5);
    }
  }
}
