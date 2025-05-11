"use client"
import { client } from "@/app/lib/client"
import { Card } from "@/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import { sunburst } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"


interface PageProps {

 website: string

}
export const EmptyTrackingState = ({website}: PageProps) => {
   
  const router = useRouter();
    const next_url = process.env.NEXT_PUBLIC_APP_URL;


    const {data} = useQuery({
        queryKey: ["website", website, "hasTrackings"],

        queryFn: async () => {
            const res = await client.tracking.pollWebsiteData.$get({
                domain: website
            })

            return await res.json()
        },
        refetchInterval(query){
            return query.state.data?.hasTrackings ? false : 1000
        },
    })

    const hasTrackings = data?.hasTrackings


    useEffect(() => {
        if(hasTrackings) router.refresh()
    }, [hasTrackings, router])

  

       const JS_codeString = `<script defer data-domain="${website}" src="${next_url}/tracking-script.ts"></script>`;
  const NextJS_codeString = `
<Script
defer
data-domain="${website}"
src="${next_url}/tracking-script.ts"/>
   `;

    return (
        <Card
      contentClassName="max-w-2xl w-full flex flex-col items-center p-6"
      className="flex-1 flex items-center justify-center"
    >
      <h2 className="text-xl/8 font-medium text-center tracking-tight text-gray-950">
        Start tracking your {website} website
      </h2>
      <p className="text-sm/6 text-gray-600 mb-8 max-w-md text-center text-pretty">
        Get started by add either of these snippets to your code:
      </p>

     

      <Tabs defaultValue="Js/React" className="w-full space-y-5">
      <TabsList
        className="w-full bg-black rounded-none space-x-5
                         items-center justify-center flex"
      >
        <TabsTrigger value="Js/React" className="rounded-none">
          Js/React
        </TabsTrigger>
        <TabsTrigger className="rounded-none" value="Nextjs">
          Nextjs
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Js/React" >
        <b className="text-red-500 font-normal italic">inside index.html</b>
        
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>

          <span className="text-gray-400 text-sm">index.html</span>
        </div>

        <SyntaxHighlighter
          language="javascript"
          style={atomDark}
          customStyle={{
            borderRadius: "0px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {JS_codeString}
        </SyntaxHighlighter>
      </div>
      </TabsContent>
      <TabsContent value="Nextjs">
        <b className="text-red-500 font-normal italic">inside app/layout.js</b>
        
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>

          <span className="text-gray-400 text-sm">app/layout.js / ts</span>
        </div>

        <SyntaxHighlighter
          language="javascript"
          style={atomDark}
          customStyle={{
            borderRadius: "0px",
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          {NextJS_codeString}
        </SyntaxHighlighter>
      </div>
      </TabsContent>
    </Tabs>

      <div className="mt-8 flex flex-col items-center space-x-2">
        <div className="flex gap-2 items-center">
          <div className="size-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">
            Listening to incoming trackings...
          </span>
        </div>

        <p className="text-sm/6 text-gray-600 mt-2">
          Need help? Check out our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            documentation
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </Card>
    )
}