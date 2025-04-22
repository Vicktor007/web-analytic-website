import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect, useSearchParams } from "next/navigation";

interface PageProps {
    searchParams: {
        [key: string] : string | string[] | undefined
    }
}
const Page =  async({searchParams}: PageProps) => {

    const auth = await currentUser();

    if(!auth){
        redirect("/sign-in")

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
    }
    return(
        <DashboardPage title="Dashborard">dashboard</DashboardPage>
    )
}

export default DashboardPage