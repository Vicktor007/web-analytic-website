

import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { DashboardPageContent } from "./dashboard-page-content";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckOutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { CreateWebsiteModal } from "@/components/add-website-modal";

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

        if (intent === "upgrade") {
            const session = await createCheckOutSession({
              userEmail: user.email,
              userId: user.id,
            })
        
            if (session.url) redirect(session.url)
          }
        
          const success = searchParams.success

    
    return(
        <>

         {success ? <PaymentSuccessModal /> : null}
 
        <DashboardPage hidBackButtonHref="/"  cta={
            <CreateWebsiteModal>
                <Button className=" w-full sm:w-fit">
                   <PlusIcon className="size-4 mr-2"/> Add Website
                </Button>
            </CreateWebsiteModal>
        }
        title="Dashboard"
        >
            <DashboardPageContent/>
        </DashboardPage>
        </>
    )
}

export default Page