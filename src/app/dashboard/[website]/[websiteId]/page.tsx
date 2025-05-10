
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
                <div className="w-full"></div>
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-2 px-4
           gap-6"
                >
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      TOTAL VISITS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      12
                    </p>
                  </div>
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="font-medium text-white/70 py-8  w-full text-center border-b border-white/5">
                      PAGE VIEWS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                      12
                    </p>
                  </div>
                </div>
                <div
                  className="items-center justify-center grid grid-cols-1 bg-black 
           lg:grid-cols-2 mt-12 w-full border-y border-white/5 p-3"
                >
                  {/* top pages */}
                  <div className="flex flex-col text-white bg-black z-40 h-full w-full">
                    <h1 className="label">Top Pages</h1>
                    {/* {groupedPageViews.map((view) => (
                      <div
                        key={view}
                        className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                      >
                        <p className="text-white/70 font-light">/{view.page}</p>
                        <p className="">{abbreviateNumber(view.visits)}</p>
                      </div>
                    ))} */}
                  </div>
                  {/* top sources */}
                  <div
                    className="flex flex-col bg-black z-40 h-full w-full
             lg:border-l border-t lg:border-t-0 border-white/5 text-white"
                  >
                    <h1 className="label relative">
                      Top Visit Sources
                      <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                        add ?utm={"{source}"} to track
                      </p>
                    </h1>
                    {/* {groupedPageSources.map((pageSource) => (
                      <div
                        key={pageSource}
                        className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                      >
                        <p className="text-white/70 font-light">
                          /{pageSource.source}
                        </p>
                        <p className="text-white/70 font-light">
                          <span className="">
                            {abbreviateNumber(pageSource.visits)}
                          </span>
                        </p>
                      </div>
                    ))} */}
                  </div>
                </div>
              </TabsContent>
                    <TabsContent value="Custom Events">
                        <DashboardPageContent website={website} id={websiteId} />
                    </TabsContent>
                </Tabs>
            </DashboardPage>
        </>
    );
};

export default Page;
