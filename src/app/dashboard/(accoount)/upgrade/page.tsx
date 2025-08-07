import { DashboardPage } from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UpgradePageContent } from "./upgrade-page-content"

const Page = async ()=> {
    const auth =  await currentUser()

    if(!auth) {
        redirect("/sign-in")
    }

    const user = await db.user.findUnique({
        where: {externalId: auth.id},
    })

    if(!user){
        redirect("/sign-in")
    }

    const capitalizedUserPlan = user.plan.charAt(0).toUpperCase() + user.plan.slice(1).toLowerCase();

    return(
        <DashboardPage title={`${capitalizedUserPlan} Subscription` }>
            <UpgradePageContent plan={user.plan} />
        </DashboardPage>
    )
        
}

export default Page