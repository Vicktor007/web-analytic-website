
// import { db } from "../db";
// import TelegramBot from "node-telegram-bot-api";


// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// bot.onText(/\/start (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const token = match?.[1]; // This is the unique_user_token from your link

//   try {
//     // Direct DB update — no API call
//     await db.user.update({
//       where: { id: token },
//       data: { telegramChatId: String(chatId) },
//     });

//     await bot.sendMessage(chatId, "✅ Telegram connected successfully!");
//   } catch (err) {
//     console.error("Failed to save Telegram ID:", err);
//     await bot.sendMessage(chatId, "❌ Failed to connect Telegram.");
//   }
// });

// export default bot;
