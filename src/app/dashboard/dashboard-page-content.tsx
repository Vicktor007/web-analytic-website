import { useQuery } from "@tanstack/react-query"

export const DashboardPageContent = () => {
    const {} = useQuery({
        queryKey: ["user-event-categories"],
        queryFn: async () => {
            
        }
    })
}