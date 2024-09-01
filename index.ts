import TelegramBot from "node-telegram-bot-api";
import registerCommands from "./commands/register";

import Queue from "./queue";
export const fila = new Queue();

import dotenv from "dotenv";
dotenv.config();

export default function startBot() {
  const token = process.env.TOKEN || "";
  const bot = new TelegramBot(token, { polling: true });

  registerCommands(bot);
}
