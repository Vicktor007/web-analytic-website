// REMOVE "use client"
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

interface PageProps {
    params: { websiteId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: PageProps) => {
    const { websiteId } = params;
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
                title={websiteId}
            >
                <DashboardPageContent id={websiteId} />
            </DashboardPage>
        </>
    );
};

export default Page;
