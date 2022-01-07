import got from "got";
import { Module } from "../types/nusmods";
import { quote, quotes } from "../types/quotes";

export async function getModule(moduleCode: string): Promise<Module> {
  return (await got(
    `https://api.nusmods.com/v2/2021-2022/modules/${moduleCode}.json`,
    { throwHttpErrors: false },
  ).json()) as Module;
}

export async function checkExist(
  moduleCode: string,
): Promise<boolean> {
  const { statusCode } = await got(
    `https://api.nusmods.com/v2/2021-2022/modules/${moduleCode}.json`,
    { throwHttpErrors: false },
  );

  return statusCode === 200;
}

export async function getQuote(): Promise<quote> {
  const quotes = (await got(
    `https://type.fit/api/quotes`,
  ).json()) as quotes;

  const randIndex = Math.floor(Math.random() * quotes.length);

  return quotes[randIndex];
}
