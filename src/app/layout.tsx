import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "../components/providers"
import { EB_Garamond } from "next/font/google"
import { cn } from "@/utils"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "DingDot",
  description: "Created using jStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className={cn(inter.variable, eb_garamond.variable)}>
      <body className=" min-h-[calc(100vh-1px)] flex flex-col  font-sans bg-brand-50 text-brand-950 antialiased">
      <Script
            defer
            data-domain="pingpanda-mbc8.onrender.com"
            src="https://pingpanda-mbc8.onrender.com/tracking-script.js"
          />
        <main className="relative flex-1 flex flex-col">
        <Providers>{children}</Providers>
        </main>
      </body>
    </html>
    </ClerkProvider>
  )
}
