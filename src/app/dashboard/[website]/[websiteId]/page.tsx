
import { DashboardPage } from "@/components/dashboard-page";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server"; // ✅ This works only in Server Components
import { redirect } from "next/navigation";
import { CreateEventCategoryModal } from "@/components/create-event-category-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { createCheckOutSession } from "@/lib/stripe";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { DashboardPageContent } from "../../dashboard-page-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTrackingPageContent } from "./general-tracking-page-content";

interface PageProps {
    params: { website: string; websiteId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: PageProps) => {
    const {website, websiteId } = params;
    const auth = await currentUser(); // ✅ Now works since it's a Server Component

    if (!auth) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { externalId: auth.id },
    });

    if (!user) {
        redirect("/welcome");
    }

    

    if (searchParams.intent === "upgrade") {
        const session = await createCheckOutSession({
            userEmail: user.email,
            userId: user.id,
        });

        if (session.url) {
            redirect(session.url);
        }
    }

    const success = searchParams.success;


    const websiteData =  await Promise.all([
    db.website_page_views.count({
  where: {
    domain: website
  },
}),

 await db.website_visits.count({
  where: {
    domain: website
  },
})
    ])

   // Destructure the counts from the array
const [pageViewsCount, visitsCount] = websiteData;

// Check if there's any tracking data
const hasTrackings = (pageViewsCount + visitsCount) > 0;
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
                title={website}
            >
                <Tabs defaultValue="general" className="flex flex-col w-full">
                    <TabsList className="flex items-center w-full justify-center">
                    <TabsTrigger value="general">
                       General
                    </TabsTrigger>
                    <TabsTrigger value="Custom Events">Custom Events</TabsTrigger>
                    </TabsList>
                    <TabsContent className="w-full" value="general">
                        <GeneralTrackingPageContent hasTrackings={hasTrackings} website={website}/>
              </TabsContent>
                    <TabsContent value="Custom Events" >
                        <DashboardPageContent website={website} id={websiteId} />
                    </TabsContent>
                </Tabs>
            </DashboardPage>
        </>
    );
};

export default Page;
