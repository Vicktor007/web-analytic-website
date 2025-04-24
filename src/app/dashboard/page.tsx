

import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./dashboard-page-content";

interface PageProps {
    searchParams: {
        [key: string] : string | string[] | undefined
    }
}
const Page =  async({searchParams}: PageProps) => {

    const auth = await currentUser();

    if(!auth){
        redirect("/sign-in")
    }
        const user = await db.user.findUnique({
            where: {externalId: auth?.id},
        })

        if(!user){
            redirect("/welcome")
        }

        const intent = searchParams.intent;

        if(intent === "upgrade") {
            // const session = await createCheck
        }
    
    return(
        <>
        <DashboardPage title="Dashboard">
            <DashboardPageContent/>
        </DashboardPage>
        </>
    )
}

export default Page