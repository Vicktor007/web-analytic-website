"use client"; // Ensure this runs on the client

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GeneralTrackingPageContent } from "./[websiteId]/general-tracking-page-content";
import { DashboardPageContent } from "../dashboard-page-content";

export const TabsWrapper = ({ website, websiteId }: { website: string; websiteId: string }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const activeTab = searchParams.get("tab") || "general"; // Get current tab from URL

    const handleTabChange = (value: string) => {
        // Update URL when the tab changes
        const params = new URLSearchParams(searchParams);
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false }); // Update query param
    };

    return (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="flex flex-col w-full">
            <TabsList className="flex items-center w-full justify-center">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="Custom Events">Custom Events</TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="general">
                <GeneralTrackingPageContent hasTrackings={true} website={website} />
            </TabsContent>
            <TabsContent value="Custom Events">
                <DashboardPageContent website={website} id={websiteId} />
            </TabsContent>
        </Tabs>
    );
};
