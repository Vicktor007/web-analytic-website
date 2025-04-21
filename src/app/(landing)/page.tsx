import { Heading } from "../../components/heading"
import { MaxWidthWrapper } from "../../components/max-width-wrapper"
import {Check} from "lucide-react"
import { ShinyButton } from "../../components/shiny-button"
import { MockDiscordUI } from "@/components/mock-discord-ui"
import { AnimatedList } from "@/components/magicui/animated-list"
import { DiscordMessage } from "@/components/discord-message"

const Page = () => {
  return (
  <>
  <section className="relative py-24 sm:py-32 bg-brand-25">
    <MaxWidthWrapper className="text-center">
      <div className="relative mx-auto text-center flex flex-col items-center gap-10">
        <div>
          <Heading>
            <span>
              Real-Time Saas Insights,
            </span>
            <br/>
            <span className="relative bg-gradient-to-r from-brand-700 to-brand-800 text-transparent bg-clip-text">
              Delivered To Your Discord
            </span>
          </Heading>
        </div>

        <p>PingPanda is the easiest way to monitor your SaaS. Get instant notifications {" "}
          <span className="font-semibold text-gray-700">
            sales  new users, or any other event {" "}
          </span>
          sent directly to your Discord.
        </p>
        <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-start">
          {["Real-time Dicord alerts for critical events",
          "Buy once, use foreever",
          "Track sales, new users, or any other event",].map((item, index) => (
            <li key={index} className="flex gap-1.5 items-center text-left">
              <Check  className="size-5 shrink-0 text-brand-700"/>
              {item}</li>
          ))}
        </ul>
        <div className="w-full max-w-80">
          <ShinyButton href="/sign-up" className="
          relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl
          ">Start for free Today</ShinyButton>
        </div>
      </div>
    </MaxWidthWrapper>
  </section>
  <section className="relative bg-brand-25 pb-4">
    <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-700"/>
      <div className="relative mx-auto">
          <MaxWidthWrapper className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
             <MockDiscordUI>
              <AnimatedList>
                <DiscordMessage 
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="pingpanda avatar"
                username="PingPanda"
                timestamp="Today at 12:31PM"
                badgeText="SignUp"
                badgeColor="#43b581"
                title="👤 New user signed up"
                content={{
                  name: "Olanrewaju Azeez",
                  email: "olazeez@gmail.com"
                }}
                />
                <DiscordMessage 
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="pingpanda avatar"
                username="PingPanda"
                timestamp="Today at 12:31PM"
                badgeText="Subscription"
                badgeColor="#faa61a"
                title="💰 Payment recieved"
                content={{
                  amount: "$49.00",
                  name: "Olanrewaju Azeez",
                  email: "olazeez@gmail.com",
                  plan: "PRO"
                }}
                />
                <DiscordMessage 
                avatarSrc="/brand-asset-profile-picture.png"
                avatarAlt="pingpanda avatar"
                username="PingPanda"
                timestamp="Today at 3:31PM"
                badgeText="Milestone"
                badgeColor="#5865f2"
                title="🚀 Revenue Milestone Achieved"
                content={{
                  recurringRevenue: "$9.00 USD",
                  growth: "+8.2%"
                }}
                />
              </AnimatedList>
             </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
      </div>

  </section>
  <section className="relative bg-brand-25 py-4 sm:py-32">
                <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap:20">
                  <div>
                  <h2 className="text-center text-base/7 font-semibold trxt-brand-600">
                    Inruitive Monitoring
                  </h2>
                  <Heading>Stay ahead with real-time insights</Heading>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    {/* first bento grid element */}
                    <div className="relative lg:row-span-2">
                    <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] "/>
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1)] lg:rounded-l-[calc(2rem+1px)]">
                      <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10 ">
                        <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-950 max-lg:text-center">
                          Real-time notifications
                        </p>
                        <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                          Get notified about critical events the moment they happen, no matter if you are 
                        </p>
                      </div>
                    </div>
                    </div>
                  </div>
                </MaxWidthWrapper>
  </section>
  <section></section>
  </>)
}

export default Page