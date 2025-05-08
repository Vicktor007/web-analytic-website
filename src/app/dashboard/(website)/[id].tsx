

// import { DashboardPage } from "@/components/dashboard-page";
// import { db } from "@/db";
// import { currentUser } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation";
// import { CreateEventCategoryModal } from "@/components/create-event-category-modal";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";
// import { createCheckOutSession } from "@/lib/stripe";
// import { PaymentSuccessModal } from "@/components/payment-success-modal";
// import { DashboardPageContent } from "../dashboard-page-content";
// import { useRouter } from "next/router";

// interface PageProps {
//     searchParams: {
//         [key: string] : string | string[] | undefined
//     }
// }
// const Page =  async({searchParams}: PageProps) => {

//     const router = useRouter();
//     const {id} = router.query;
//     const auth = await currentUser();

//     if(!auth){
//         redirect("/sign-in")
//     }
//         const user = await db.user.findUnique({
//             where: {externalId: auth?.id},
//         })

//         if(!user){
//             redirect("/welcome")
//         }

//         const intent = searchParams.intent;

//         if (intent === "upgrade") {
//             const session = await createCheckOutSession({
//               userEmail: user.email,
//               userId: user.id,
//             })
        
//             if (session.url) redirect(session.url)
//           }
        
//           const success = searchParams.success

    
//     return(
//         <>

//          {success ? <PaymentSuccessModal /> : null}
 
//         <DashboardPage hidBackButtonHref="/"  cta={
//             <CreateEventCategoryModal id={id}>
//                 <Button className=" w-full sm:w-fit">
//                    <PlusIcon className="size-4 mr-2"/> Add Category
//                 </Button>
//             </CreateEventCategoryModal>
//         }
//         title="Dashboard"
//         >
//             <DashboardPageContent id={id}/>
//         </DashboardPage>
//         </>
//     )
// }

// export default Page

"use client";

import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { CreateEventCategoryModal } from "@/components/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckOutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { DashboardPageContent } from "../dashboard-page-content";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { $Enums } from "@prisma/client";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

interface UserData {
    id: string;
    externalId: string | null;
    quotaLimit: number;
    plan: $Enums.plan;
    email: string;
    apiKey: string;
    discordId: string | null;
    createdAt: Date;
    updatedAt: Date;
}


const Page = ({ searchParams }: PageProps) => {
    const router = useRouter();
    const { id } = router.query;
    const websiteId = typeof id === "string" ? id : id?.[0] || "";

    const [user, setUser] = useState<UserData>();
    const [intent, setIntent] = useState<string | string[] | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const auth = await currentUser();

            if (!auth) {
                redirect("/sign-in");
                return;
            }

            const userData = await db.user.findUnique({
                where: { externalId: auth?.id },
            });

            if (!userData) {
                redirect("/welcome");
                return;
            }

            setUser(userData);
            setIntent(searchParams.intent);

            if (searchParams.intent === "upgrade") {
                const session = await createCheckOutSession({
                    userEmail: userData.email,
                    userId: userData.id,
                });

                if (session.url) {
                    redirect(session.url);
                }
            }
        };

        fetchData();
    }, [searchParams.intent]);

    const success = searchParams.success;

    return (
        <>
            {success ? <PaymentSuccessModal /> : null}

            <DashboardPage
                hidBackButtonHref="/"
                cta={
                    <CreateEventCategoryModal id={websiteId}>
                        <Button className="w-full sm:w-fit">
                            <PlusIcon className="size-4 mr-2" /> Add Category
                        </Button>
                    </CreateEventCategoryModal>
                }
                title="Dashboard"
            >
                <DashboardPageContent id={websiteId} />
            </DashboardPage>
        </>
    );
};

export default Page;
