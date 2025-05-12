"use client"
import React, { useState } from 'react'
import { EmptyTrackingState } from './empty-tracking-state';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/app/lib/client';

interface PageProps {
    website: string
    hasTrackings: boolean

}

export const GeneralTrackingPageContent = ({website, hasTrackings: initialData}: PageProps) => {

  const searchParams = useSearchParams()

  const [pageViews, setPageViews] = useState([]);
  const [groupedPageViews, setGroupedPageViews] = useState([]);


  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")

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
        })
        return await response.json()
      },
      refetchOnWindowFocus: false,
      enabled: pollingData.hasTrackings
    })            

    console.log("Data received from API:", data);


//  function groupPageViews(pageViews) {
//     const groupedPageViews = {};

//     pageViews && pageViews?.forEach(({ page }) => {
//       // Extract the path from the page URL by removing the protocol and hostname
//       const path = page?.replace(/^(?:\/\/|[^/]+)*\//, "");

//       // Increment the visit count for the page path
//       groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
//     });

//     return Object.keys(groupedPageViews).map((page) => ({
//       page: page,
//       visits: groupedPageViews[page],
//     }));
//   }


    if(!pollingData.hasTrackings) {
        return (
            <EmptyTrackingState website={website}/>
        )
    }

  return (
    <>
   
                <div className="w-full"></div>
                <div
                  className="w-full grid grid-cols-1 md:grid-cols-2 px-4
           gap-6"
                >
                  <div className="bg-black border-white/5 border text-white text-center">
                    <p className="text-white/70 font-medium py-8 w-full text-center border-b border-white/5">
                      WEBSITE VISITS
                    </p>
                    <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                     {data?.website_visits.length}
                    </p>
                  </div>
                  <div className="bg-black border-white/5 border text-white text-center">
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
              
    </>
  )
}
