import bot from "../lib/bot";
import { PrismaClient } from "@prisma/client";
import { formatDuration, intervalToDuration } from "date-fns";
import { sleep } from "./sleep";
import { getQuote } from "./getData";

const prisma = new PrismaClient();

export async function notifyExams(): Promise<void> {
  const users = await prisma.user.findMany({
    where: { NOT: { firstExam: null } },
  });

  for await (const user of users) {
    if (user.firstExam) {
      const quote = await getQuote();
      bot.telegram
        .sendMessage(
          user.telegramId,
          `Your first exam is in ${formatDuration(
            intervalToDuration({
              start: new Date(),
              end: user.firstExam,
            }),
          )}\n\n<i>${quote.text} <u>${quote.author}</u></i>`,
          { parse_mode: "HTML" },
        )
        .catch((e) => {
          console.log(e);
        });
      await sleep(0.5);
    }
  }
}
