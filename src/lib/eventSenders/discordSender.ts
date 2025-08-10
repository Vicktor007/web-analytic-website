import { DiscordClient } from "@/app/lib/discord-client"

export type Id = string

export interface EventField {
  name: string
  value: string
  inline: boolean
}

export interface EventData {
  title: string
  website?: string
  description: string
  color?: number
  timestamp: string
  fields: EventField[]
}

export async function sendToDiscord(discordId: Id, eventData: EventData) {
  if (!discordId) throw new Error("User missing Discord ID")

  const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN!)
  const dmChannel = await discord.createDM(discordId)
  await discord.sendEmbed(dmChannel.id, eventData)
}
