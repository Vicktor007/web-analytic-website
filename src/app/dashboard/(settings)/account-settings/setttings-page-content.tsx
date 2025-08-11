"use client"

import { client } from "@/app/lib/client"
import { Card } from "@/components/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useState, useMemo } from "react"

export const AccountSettings = ({
  discordId: initialDiscordIdProp,
  telegramId: initialTelegramIdProp
}: {
  discordId: string
  telegramId: string
}) => {
  // Track both the editable IDs and their "saved" initial values
  const [discordId, setDiscordId] = useState(initialDiscordIdProp)
  const [telegramId, setTelegramId] = useState(initialTelegramIdProp)
  const [savedDiscordId, setSavedDiscordId] = useState(initialDiscordIdProp)
  const [savedTelegramId, setSavedTelegramId] = useState(initialTelegramIdProp)

  const findingDiscordIdArticleLink =
    "https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID"

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { discordId?: string; telegramId?: string }) => {
      const res = await client.project.setUserIDs.$post(data)
      return await res.json()
    },
    onSuccess: () => {
      // After save, update the "saved" values so button disables again
      setSavedDiscordId(discordId)
      setSavedTelegramId(telegramId)
    }
  })

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    return discordId !== savedDiscordId || telegramId !== savedTelegramId
  }, [discordId, telegramId, savedDiscordId, savedTelegramId])

  return (
    <Card className="max-w-xl w-full space-y-4">
      {/* Discord ID */}
      <div className="pt-2">
        <Label>Discord ID</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don&apos;t know how to find your Discord ID?{" "}
        <Link
          href={findingDiscordIdArticleLink}
          target="blank"
          className="text-brand-600 hover:text-brand-500"
        >
          Learn how to obtain it here
        </Link>
        .
      </p>

      {/* Telegram ID */}
      <div className="pt-2">
        <Label>Telegram ID</Label>
        <Input
          className="mt-1"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
          placeholder="Enter your Telegram ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don&apos;t know how to find your Telegram ID? Ask your bot with{" "}
        <code>/start</code>.
      </p>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          onClick={() => mutate({ discordId, telegramId })}
          disabled={isPending || !hasChanges || discordId === '' || telegramId === ''}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}


// "use client";

// import { client } from "@/app/lib/client";
// import { Card } from "@/components/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useMutation } from "@tanstack/react-query";
// import Link from "next/link";
// import { useState } from "react";

// export const AccountSettings = ({
//   discordId: initialDiscordId,
//   telegramConnected,
//   userId, // We'll pass this from server so we can make the token
// }: {
//   discordId: string;
//   telegramConnected: boolean;
//   userId: string;
// }) => {
//   const [discordId, setDiscordId] = useState(initialDiscordId);
//   const findingDiscordIdArticleLink =
//     "https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID";

//   // Save Discord ID mutation
//   const { mutate: saveDiscordId, isPending: savingDiscord } = useMutation({
//     mutationFn: async (discordId: string) => {
//       const res = await client.project.setDiscordID.$post({ discordId });
//       return await res.json();
//     },
//   });

//   // Telegram Bot username (without @)
//   const botUsername = "Dingbot"; // TODO: replace with your bot username

//   // Open Telegram connect link
//   const connectTelegram = () => {
//     const token = userId; // could also be a signed token for security
//     window.open(`https://t.me/${botUsername}?start=${token}`, "_blank");
//   };

//   return (
//     <Card className="max-w-xl w-full space-y-4">
//       {/* Discord ID Section */}
//       <div className="pt-2">
//         <Label>Discord ID</Label>
//         <Input
//           className="mt-1"
//           value={discordId}
//           onChange={(e) => setDiscordId(e.target.value)}
//           placeholder="Enter your Discord ID"
//         />
//       </div>

//       <p className="mt-2 text-sm/6 text-gray-600">
//         Don&apos;t know how to find your Discord ID?{" "}
//         <Link
//           href={findingDiscordIdArticleLink}
//           target="blank"
//           className="text-brand-600 hover:text-brand-500"
//         >
//           Learn how to obtain it here
//         </Link>
//         .
//       </p>

//       <div className="pt-4">
//         <Button onClick={() => saveDiscordId(discordId)} disabled={savingDiscord}>
//           {savingDiscord ? "Saving..." : "Save Discord ID"}
//         </Button>
//       </div>

//       {/* Telegram Connect Section */}
//       <div className="pt-6">
//         <Label>Telegram</Label>
//         {telegramConnected ? (
//           <p className="text-green-600 mt-2">✅ Connected</p>
//         ) : (
//           <Button onClick={connectTelegram} className="mt-2">
//             Connect Telegram
//           </Button>
//         )}
//       </div>
//     </Card>
//   );
// };
