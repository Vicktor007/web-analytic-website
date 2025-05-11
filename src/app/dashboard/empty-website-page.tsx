import { Card } from "@/components/card"
import { Button } from "@/components/ui/button"
import { CreateWebsiteModal } from "@/components/add-website-modal"

export const WebsiteEmptyState = () => {

    return (
        <Card className="flex flex-col items-center justify-center rounded-2xl flex-1 text-center p-6">
            <div className="flex justify-center w-full">
                <img src="/brand-asset-wave.png" alt="no categories" className="size-48 -mt-24" />
            </div>
            <h1 className="mt-2 text-xl/8 font-medium traacking-tight text-gray-900">No website yet</h1>
            <p className="text-sm/6 text-gray-600 max=w-prose mt-2 mb-8">
            Start tracking events by adding your first website.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">

        <CreateWebsiteModal containerClassName="w-full sm:w-auto">
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            <span>Add Website</span>
          </Button>
        </CreateWebsiteModal>
            </div>
        </Card>
    )
}