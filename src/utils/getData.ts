import got from "got";
import { Module } from "../types/nusmods";

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
