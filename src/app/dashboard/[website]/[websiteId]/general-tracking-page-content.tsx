"use client"
import React, { useEffect, useState } from 'react'
import { EmptyTrackingState } from './empty-tracking-state';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/app/lib/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/loading-spinner';

interface PageProps {
    website: string
    hasTrackings: boolean

}


    interface WebsiteVisit {
    id: string;
    domain: string;
    source: string;
    createdAt: Date;
}

interface WebsitePageView {
    id: string;
    domain: string;
    page_visited: string;
    createdAt: Date;
}


export const GeneralTrackingPageContent = ({website, hasTrackings: initialData}: PageProps) => {

  const searchParams = useSearchParams()


const [groupedPageViews, setGroupedPageViews] = useState<{ page: string; visits: number }[]>([]);
const [groupedPageSources, setGroupedPageSources] = useState<{ source: string; visits: number }[]>([]);



  const [activeTab, setActiveTab] = useState<"today" | "week" | "month" | "all-time">("today")

  const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "30", 10)

      const [pagination, setPagination] = useState({
            pageIndex: page - 1,
            pageSize: limit
        })


        const { data: pollingData} = useQuery({
                    queryKey: ["website", website, "hasTrackings"],
                    initialData: {hasTrackings: initialData},
                })


    const {data, isFetching} = useQuery({
      queryKey: ["website-trackings", website, pagination.pageIndex, pagination.pageSize, activeTab],

      queryFn: async () => {
        const response = await client.tracking.getWebsiteTrackings.$get({
          
          domain: website,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          timeRange: activeTab
          
        });
         console.log(response)
        return await response.json()
       
      },
      refetchOnWindowFocus: false,
      enabled: true,
    })            

    useEffect(() => {

      const groupPageSources = (data: { website_visits: WebsiteVisit[]; pages_viewed?: { id: string; createdAt: Date; domain: string; page_visited: string; }[] }) => {
    if (!data?.website_visits) return [];

    const groupedPageSources: Record<string, number> = {};

    data.website_visits.forEach(({ source }) => {
        if (!source) return;
        groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
    });

    return Object.entries(groupedPageSources).map(([source, visits]) => ({
        source,
        visits,
    }));
};

const groupPageViews = (data: { pages_viewed?: WebsitePageView[] }) => {
    if (!data?.pages_viewed) return [];

    const groupedPageViews: Record<string, number> = {};

    data.pages_viewed.forEach(({ page_visited }) => {
        if (!page_visited) return;
        const path = page_visited.replace(/^(?:\/\/|[^/]+)*\//, "");
        groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.entries(groupedPageViews).map(([page, visits]) => ({
        page,
        visits
    }));
};
      if(data){
        setGroupedPageViews(groupPageViews(data));
        setGroupedPageSources(groupPageSources(data));
      }
    }, [data])

    // console.log("Data received from API:", data);


    // Show empty state if there's no tracking data
if (!isFetching && (!data?.website_visits?.length && !data?.pages_viewed?.length)) {
  return <EmptyTrackingState website={website} />;
}


    if(isFetching) {
            return(
                <div className="flex items-center justify-center flex-1 h-[50dvh] w-full">
                    <LoadingSpinner/>
                </div>
            )
          }

  return (
    <>
   
   <div className="space-y-6">
               <Tabs
                 value={activeTab}
                 onValueChange={(value) => {
                   setActiveTab(value as "today" | "week" | "month" | "all-time")
                 }}
               >
                 <TabsList  className=" mb-2 flex items-center w-full justify-center">
                   <TabsTrigger value="today">Today</TabsTrigger>
                   <TabsTrigger value="week">This Week</TabsTrigger>
                   <TabsTrigger value="month">This Month</TabsTrigger>
                   <TabsTrigger value="all-time">All Time</TabsTrigger>
                 </TabsList>
         
                 <TabsContent value={activeTab}>
                   
                    
                    <div className="w-full"></div>
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-2 px-4
           gap-6"
                >
                  <div className="bg-black border-white/5 border text-white text-center rounded-md">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      WEBSITE VISITS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                     {data?.website_visits.length}
                    </p>
                  </div>
                  <div className="bg-black border-white/5 border text-white text-center rounded-md">
                    <p className="font-medium text-white/70 py-8  w-full text-center border-b border-white/5">
                     PAGE VIEWS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                     {data?.pages_viewed.length}
                    </p>
                  </div>
                </div>
                <div
                  className="items-center justify-center grid grid-cols-1 bg-black 
           lg:grid-cols-2 mt-12 w-full border-y border-white/5 p-3 rounded-md"
                >
                  {/* top pages */}
                  <div className="flex flex-col text-white bg-black z-40 h-full w-full">
                    <h1 className="label">Top Pages</h1>
                    {groupedPageViews.map((view) => (
                      <div
                        key={view.page}
                        className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                      >
                        <p className="text-white/70 font-light">/{view.page}</p>
                        <p className="">{view.visits}</p>
                      </div>
                    ))}
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
                    {groupedPageSources.map((pageSource) => (
                      <div
                        key={pageSource.source}
                        className="text-white w-full items-center justify-between 
                  px-6 py-4 border-b border-white/5 flex"
                      >
                        <p className="text-white/70 font-light">
                          /{pageSource.source}
                        </p>
                        <p className="text-white/70 font-light">
                          <span className="">
                            {pageSource.visits}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                   
                  
                 </TabsContent>
               </Tabs>

                
           </div>   
    </>
  )
}
