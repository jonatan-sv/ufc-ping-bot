import TelegramBot from "node-telegram-bot-api";
import * as cmd from "./functions";

const registerCommands = (bot: TelegramBot) => {

  bot.onText(/\/marcar (.*)/,      (msg, match) => cmd.marcar(msg, match, bot));
  bot.onText(/\/tirar (.*)/,       (msg, match) => cmd.tirar(msg, match, bot));
  bot.onText(/\/furar (.*) (\d+)/, (msg, match) => cmd.furar(msg, match, bot));
  bot.onText(/\/esquenta (\d+)/,   (msg, match) => cmd.esquenta(msg, match, bot));
  bot.onText(/\/trocar/,           (msg)        => cmd.trocar(msg, bot));
  bot.onText(/\/fila/,             (msg)        => cmd.mostrarFila(msg, bot));
  bot.onText(/\/proximo/,          (msg)        => cmd.proximo(msg, bot));
  bot.onText(/\/limpar/,           (msg)        => cmd.limpar(msg, bot));
  bot.onText(/\/creditos/,         (msg)        => cmd.creditos(msg, bot));
  bot.onText(/\/qrcode/,           (msg)        => cmd.qrcode(msg, bot));
  bot.onText(/\/ping/,             (msg)        => cmd.ping(msg, bot));

  // TODO: Setar os outros comandos
  bot.setMyCommands([
    {command: '/trocar', description: 'Tira uma pessoa jogando'},
    {command: '/fila', description: 'Mostra a fila atual'},
    {command: '/creditos', description: 'Mostra os créditos do bot'}
  ]);

};

export default registerCommands;
