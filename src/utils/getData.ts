import got from "got";
import { catAPIs } from "../types/catAPI";
import { dogAPI } from "../types/dogAPI";
import { appConfig, Module } from "../types/nusmods";
import { quote, quotes } from "../types/quotes";

/**
 * Get config of NUS MODS main website
 * @returns {appConfig}
 */
export async function getConfig(): Promise<appConfig> {
  return (await got(
    `https://raw.githubusercontent.com/nusmodifications/nusmods/master/website/src/config/app-config.json`,
  ).json()) as appConfig;
}

/**
 * Gets module information
 * @param moduleCode Module code to search
 * @param academicYear Academic year data from config
 * @returns {Module}
 */
export async function getModule(
  moduleCode: string,
  academicYear: string,
): Promise<Module> {
  academicYear = academicYear.replace("/", "-");
  return (await got(
    `https://api.nusmods.com/v2/${academicYear}/modules/${moduleCode}.json`,
    { throwHttpErrors: false },
  ).json()) as Module;
}

/**
 * Checks if the module exist in the API
 * @param moduleCode Module code to search
 * @param academicYear Academic year data from config
 * @returns {boolean} true if available
 */
export async function checkExist(
  moduleCode: string,
  academicYear: string,
): Promise<boolean> {
  academicYear = academicYear.replace("/", "-");
  const { statusCode } = await got(
    `https://api.nusmods.com/v2/${academicYear}/modules/${moduleCode}.json`,
    { throwHttpErrors: false },
  );

  return statusCode === 200;
}

/**
 * Finds a random quote
 * @returns {quote}
 */
export async function getQuote(): Promise<quote> {
  const quotes = (await got(
    `https://type.fit/api/quotes`,
  ).json()) as quotes;

  const randIndex = Math.floor(Math.random() * quotes.length);

  return quotes[randIndex];
}

/**
 * Gets a cat pic URL
 * @returns {string}
 */
export async function getCatURL(): Promise<string> {
  const catAPI = (await got(
    `https://api.thecatapi.com/v1/images/search`,
  ).json()) as catAPIs;

  return catAPI[0].url;
}

/**
 * Gets a dog pic url
 * @returns {string}
 */
export async function getDogURL(): Promise<string> {
  const dogAPI = (await got(
    `https://random.dog/woof.json`,
  ).json()) as dogAPI;

  return dogAPI.url;
}

/**
 * Random trivia with the given number
 * @param number relevant number
 * @returns {string}
 */
export async function numbersTrivia(number: number): Promise<string> {
  const { body: body } = await got(`http://numbersapi.com/${number}`);

  return body;
}
