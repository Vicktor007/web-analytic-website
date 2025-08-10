import TelegramBot from "node-telegram-bot-api"
import { EventData, Id } from "./discordSender"

export async function sendToTelegram(telegramId: Id, eventData: EventData) {
  if (!telegramId) throw new Error("User missing Telegram Chat ID")

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false })

  // Format the EventData for Telegram
  let message = `*${eventData.title}*\n\n${eventData.description}`

  if (eventData.website) {
    message += `\n🌐 Website: ${eventData.website}`
  }

  if (eventData.fields?.length) {
    eventData.fields.forEach(field => {
      message += `\n${field.name}: ${field.value}`
    })
  }

  await bot.sendMessage(telegramId, message, { parse_mode: "Markdown" })
}
