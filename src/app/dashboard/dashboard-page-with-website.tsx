"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "../lib/client"
import { LoadingSpinner } from "@/components/loading-spinner"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowRight, BarChart2, Clock, Database, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { DashboardEmptyState } from "./dashboard-empty-state"
import { usePathname } from "next/navigation"

export const DashboardPageContentWitWebsite = () => {

    const pathname = usePathname();
    const [deletingWebsite, setDeletingWebsite] = useState<string | null>(null)

    const queryClient = useQueryClient();

    const {data: websites, isPending: isWebsitesLoading} = useQuery({
        queryKey: ["user-websites"],
        queryFn: async () => {
            const res = await client.website.getWebsites.$get()
            const {websites} = await res.json()
            console.log(websites)
            return websites
        },
    })

    const {mutate: deleteWebsite, isPending: isDeletingWebsite} = useMutation({
        mutationFn: async (websiteId: string) => {
            await client.website.deleteWebsite.$post({websiteId})
        }, 
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["user-websites"]})
            setDeletingWebsite(null)
        }
    })

    if(isWebsitesLoading) {
        return(
            <div className="flex items-center justify-center flex-1 h-full w-full">
                <LoadingSpinner/>
            </div>
        )
      }
        if(!websites || websites?.length === 0) {
            return <DashboardEmptyState/>
        }

        return(
            <>
           {
            pathname === "/dashboard" ? <div>dashboard</div> : (
                <>
                     <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {websites?.map((Website) => (
                    <li key={Website.id} className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5">
                        <div className="absolute z-0 inset-px rounded-lg bg-white"/><div className="pointer-events-none z-0 absolute inset-px
                        rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-black/5 "/>
                            <div className="relative p-6 z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    
                                    <div>
                                        <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                                         {Website.domain}
                                        </h3>
                                        <p className="text-gray-600 text-sm/6">
                                        {format(Website.createdAt, "MMM d, yyyy")}</p>
                                    </div>
                                   
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <Link href={`/dashboard/Website/${Website.domain}`}
                                    className={buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                        className: "flex items-center gap-2 text-sm",
                                    })}
                                    >View all <ArrowRight className="size-4"/></Link>
                                    <Button
                                    onClick={() => setDeletingWebsite(Website.domain)}
                                    variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 transition-colors" aria-label={`Delete ${Website.domain}`}>
                                        <Trash2 className="size-5"/>
                                    </Button>
                                </div>
                            </div>
                        
                    </li>
                ))}
            </ul>

            <Modal showModal={!!deletingWebsite} setShowModal={() => setDeletingWebsite(null)}
                className="max-w-md p-8"
                >
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-medium text-lg/7 tracking-tight text-gray-950">
                            Delete Website
                            </h2>
                            <p className="text-sm/6 text-gray-600">
                            Are you sure you want to delete the Website "{deletingWebsite}"?
                            This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button  variant="outline" onClick={() => setDeletingWebsite(null)}> Cancel</Button>
                            <Button variant="destructive"
                            onClick={() => deletingWebsite && deleteWebsite(deletingWebsite)}
                            disabled={isDeletingWebsite}
                            >{isDeletingWebsite ? "Deleting..." : "Delete"}</Button>
                        </div>
                    </div>
                </Modal>
                </>
            )
           }
            </>
        )
    
}