import { Markup } from "telegraf";
import { URL } from "url";

import bot from "../lib/bot";

const parseURL = () => {
  bot.hears(/nusmods.com/, (ctx) => {
    console.log(ctx.message.text);
    const inputURL = new URL(ctx.message.text);
    // inputURL.searchParams.forEach((item) => {
    //   console.log(item.);
    // });
    // console.log(inputURL.searchParams.keys());
    for (const iter of inputURL.searchParams.keys()) {
      console.log(iter);
    }
  });
};

export default parseURL;
