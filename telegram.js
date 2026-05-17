import TelegramBot from "node-telegram-bot-api";
import 'dotenv/config';

// Telegram token
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

// 👉 WhatsApp socket reference (index.js থেকে আসবে)
let QasimDev = global.QasimDev;

// START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`🤖 Kazi-md-bot-4X

Use:
/pair 8801XXXXXXXXX`
  );
});

// PAIR COMMAND
bot.onText(/\/pair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  let number = match[1].replace(/[^0-9]/g, "");

  if (!QasimDev) {
    return bot.sendMessage(chatId, "❌ WhatsApp not connected");
  }

  try {
    await bot.sendMessage(chatId, "⏳ Generating Pair Code...");

    let code = await QasimDev.requestPairingCode(number);

    code = code?.match(/.{1,4}/g)?.join("-") || code;

    bot.sendMessage(
      chatId,
`✅ Pair Code Generated

📱 Number: ${number}
🔑 Code: ${code}`
    );

  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Failed to generate code");
  }
});

console.log("🤖 Telegram Bot Running...");
