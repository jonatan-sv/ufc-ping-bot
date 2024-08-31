import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import { promises as fs } from "fs";
import { fila } from "../index";
import logger from "../logger";

type Match = RegExpExecArray | null;
type UserMessage = TelegramBot.Message;
const conf: SendMessageOptions = { parse_mode: "Markdown" }; // Permite mandar mensagens formatadas
let canSendQR = true; // Evita span do QRCode


async function checkAdmin(username: string) {
  const authorizedUsers = process.env.MODS?.split(", ") ?? [];
  return authorizedUsers.includes(username);
}

async function saveQueueToFile() {
  const queueData = {
    fila: fila.show(),
  };

  try {
    await fs.writeFile(".cache/fila.json", JSON.stringify(queueData, null, 2));
    logger.info("Arquivo fila.json salvo com sucesso!");
  } catch (error) {
    logger.error("Erro ao salvar o arquivo:", error);
  }
}

export async function ping(msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "pong! 🏓");
}

export async function marcar(msg: UserMessage, match: Match, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";
  const args = match![1].split(" ");

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  for (var name of args) {
    if (name === "d'marius") {
      bot.sendMessage(chatId, "🗣️ *Bora d'marius*", conf)
    }
    fila.add(name)
  }

  await saveQueueToFile();
  bot.sendMessage(chatId, fila.listAll(), conf);
}

export async function esquenta (msg: UserMessage, match: Match, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";
  const time = parseInt(match![1]);

  const delayer = async (minutes: number) => {
    bot.sendMessage(
      chatId,
      `🔥 Esquentando... por ${minutes + (minutes === 1 ? " minuto" : " minutos")}! 🔥`
    );
    return new Promise((resolve) => {
      setTimeout(resolve, minutes * 60 * 1000);
    });
  };

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  if (time > 15) {
    bot.sendMessage(chatId, `❌ *${time} minutos?! Compra logo uma mesa!*`, conf);
    return;
  }

  await delayer(time);
  bot.sendMessage(chatId, "🔥 O esquenta acabou!", { reply_to_message_id: msg.message_id });
}

export async function proximo(msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, fila.next());
}

export async function tirar(msg: UserMessage, match: Match, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";
  const args = match![1].split(" ");

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  for (var pessoa of args) {
    fila.remove(pessoa);
  }

  await saveQueueToFile();
  bot.sendMessage(chatId, fila.listAll(), conf);
}

export async function mostrarFila (msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, fila.listAll(), conf);
}

export async function backup (msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const data = JSON.parse(await fs.readFile(".cache/fila.json", "utf-8"));

  fila.clear();
  for (let item of data["fila"]) {
    fila.add(item);
  }

  bot.sendMessage(chatId, fila.listAll(), conf);
  bot.sendMessage(chatId, "✔️ *Última fila obtida com sucesso!*", conf);
}

export async function creditos (msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
`
💻 *Bot desenvolvido por:*
    • Jonatan
    • Elenildo
    • Jefferson
`
, conf);
}

export async function furar (msg: UserMessage, match: Match, bot: TelegramBot,) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  const pessoa = match![1];                       // Captura o nome da pessoa
  const position = parseInt(match![2], 10);       // Captura a posição e converte para número
  fila.remove(pessoa);
  const result = fila.insert(pessoa, position);
  bot.sendMessage(chatId, result, conf);

  await saveQueueToFile();
  bot.sendMessage(chatId, fila.listAll(), conf);
}


export async function trocar(msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  const players = fila.show();
  const buttons = [
    [{text: players[0], callback_data: players[0] }],
    [{text: players[1], callback_data: players[1] }],
  ];

  const options = { reply_markup: { inline_keyboard: buttons } };
  bot.sendMessage(chatId, 'Escolha uma opção:', options);

  bot.on('callback_query', async (callbackQuery) => {
    const clickedUsername = callbackQuery.from.username;
    
    if (clickedUsername !== username) {
      bot.answerCallbackQuery(callbackQuery.id, { text: "❌ Você não pode usar este botão!", show_alert: true });
      return;
    }

    const message = callbackQuery.message;
    const data = callbackQuery.data || "";
  
    bot.editMessageText(`🔁 Trocando ${data}!`, {
      chat_id: message!.chat.id,
      message_id: message!.message_id
    });
    
    fila.moveToEnd(data);
    await saveQueueToFile(); 
    bot.sendMessage(chatId, fila.listAll(), conf); 
  });
}


export async function limpar (msg: UserMessage, bot: TelegramBot) {
  const chatId = msg.chat.id;
  const username = msg.from?.username ?? "";
  const result = fila.clear();

  if (!await checkAdmin(username)) {
    bot.sendMessage(chatId, "❌ *Você não possui permissão para usar este comando!*", conf);
    return;
  }

  await saveQueueToFile();
  bot.sendMessage(chatId, result, conf);
}

export async function qrcode(msg: UserMessage, bot: TelegramBot) {
  if (!canSendQR) return;

  const chatId = msg.chat.id;
  bot.sendPhoto(chatId, "assets/group_qrcode.png", { reply_to_message_id: msg.message_id });
  
  canSendQR = false
  setInterval(() => {
    canSendQR = true
  }, 10000);
}
