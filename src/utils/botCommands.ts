import { BotCommand } from "typegram";
/**
 * All admin commands here
 * @return {BotCommand[]} List of admin commands
 */
export function getBotCommands(): BotCommand[] {
  // Update this list of commands
  const rawBotCommands = [
    {
      command: "help",
      description: "Find out more on the bot",
    },
    {
      command: "checkexam",
      description: "Check how many days you're from the exam",
    },
  ];

  let botCommands: BotCommand[] = [];
  rawBotCommands.forEach((botCommand) => {
    botCommands.push({
      command: botCommand.command.toLowerCase(),
      description: botCommand.description.substring(0, 256),
    });
  });
  return botCommands;
}
