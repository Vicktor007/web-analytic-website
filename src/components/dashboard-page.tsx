"use client"

import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "./heading"

interface DashboardPageProps {
    title: string
    children?: ReactNode
    hideBackButton?: boolean
    cta?: ReactNode
    hidBackButtonHref?: string
}

export const DashboardPage = ({title, children, hideBackButton, hidBackButtonHref ="/dashboard", cta}: DashboardPageProps ) => {
    const router = useRouter();

    return(
        <section className="flex-1 h-full w-full flex flex-col">
            <div className="w-full p-6 sm:p-8 flex justify-between border-b border-gray-200">
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex items-center gap-8">
                        {hideBackButton ? null : (
                            <Button
                            onClick={() => router.push(`${hidBackButtonHref}`)}
                            className="w-fit bg-white"
                            variant="outline"
                            >
                                <ArrowLeft className="size-4"/>
                            </Button>
                        )}
                        <Heading>{title}</Heading>
                    </div>
                    {cta? <div className="w-full">{cta}</div> : null}
                </div>
            </div>
            <div className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
                {children}
            </div>
        </section>
    )
}