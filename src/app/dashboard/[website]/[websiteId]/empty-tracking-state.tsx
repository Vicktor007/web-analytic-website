
import { Card } from "@/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import { sunburst } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"


interface PageProps {

 website: string

}
export const EmptyTrackingState = ({website}: PageProps) => {
   
    const next_url = process.env.NEXT_PUBLIC_APP_URL;

    const categoryName = "Name"

    // const {data} = useQuery({
    //     queryKey: ["category", categoryName, "hasEvents"],

    //     queryFn: async () => {
    //         const res = await client.category.pollCategory.$get({
    //             name: categoryName,
    //             websiteId: websiteId
    //         })

    //         return await res.json()
    //     },
    //     refetchInterval(query){
    //         return query.state.data?.hasEvents ? false : 1000
    //     },
    // })

    // const hasEvents = data?.hasEvents


    // useEffect(() => {
    //     if(hasEvents) router.refresh()
    // }, [hasEvents, router])

    const codeSnippet = `await fetch('${next_url}/api/events', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          category: '${categoryName}',
          fields: {
            field1: 'value1', // for example: user id
            field2: 'value2' // for example: user email
          }
        })
      })`

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
            Listening to incoming events...
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