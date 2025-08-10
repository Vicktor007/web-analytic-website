import { $Enums } from "@prisma/client"
import { EventData, Id, sendToDiscord } from "./discordSender"
import { sendToTelegram } from "./telegramSender"



export async function sendEventToPlatforms(platform: $Enums.Platform, id: Id, eventData: EventData) {
  
    try {
      switch (platform) {
        case "DISCORD":
          await sendToDiscord(id, eventData)
          break
        case "TELEGRAM":
          await sendToTelegram(id, eventData)
          break
        default:
          await sendToDiscord(id, eventData)
      }
    } catch (err) {
      console.error(`Failed to send to ${platform}:`, err)
    }
  }

