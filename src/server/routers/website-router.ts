import { z } from "zod"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { WEBSITE_VALIDATOR } from "@/lib/validators/website-validator"
import { db } from "@/db"
import { startOfMonth } from "date-fns"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"



const handleError = (c: { json: (arg0: { success: boolean; error: any }, arg1: number) => any }, message: any, status = 500) => {
    return c.json({ success: false, error: message }, status);
  };
  
export const websiteRouter = router({

    addWebsite: privateProcedure 
    .input(
        z.object({
            domain: WEBSITE_VALIDATOR
        })
    )
    .mutation(async({c, ctx, input}) => {
        const {user} = ctx
        const {domain} = input

        try{
            // 1. Determine the user's plan
                  const userPlan = user.plan === "PRO" ? PRO_QUOTA : FREE_QUOTA;
                  const maxWebsitesAllowed = userPlan.maxWebsites;
            
                  // 2. Count existing websites for this user
                  const existingWebsiteCount = await db.website.count({
                    where: { userId: user.id },
                  });
            
                  // 3. Check if the user has reached their quota
                  if (existingWebsiteCount >= maxWebsitesAllowed) {
                    return c.json(
                      { error: "website limit reached for your current plan." },
                      403
                    );
                  }
        const website = await db.website.create({
            data: {
              domain: domain.toLowerCase(),
              userId: user.id
            }
          })
  
          return c.json({website})
        } catch (error) {
            console.error("Error adding website:", error);
            return handleError(c, "Failed to add website");
          }
    }),

    
    getWebsites: privateProcedure.query(async ({ c, ctx }) => {
        const websites = await db.website.findMany({
            where: { userId: ctx.user.id }, // Fetch only websites belonging to the logged-in user
            select: { // Specify fields to avoid over-fetching unnecessary data
                id: true,
                domain: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    
        return c.superjson({ websites }); // Use superjson for better serialization
    }),
    

    getEventCategories: privateProcedure.query(async({c, ctx, input}) =>{
        // Define the type for input
    type WebsiteId = {
        websiteId: string;
    };

    // Extract websiteId from input
    const { websiteId }: WebsiteId = input; // Ensure input contains websiteId
        
        
            const websiteCategories = await db.eventCategory.findMany({
                where: {userId: ctx.user.id, website_id: websiteId},
                
                select: {
                    id: true,
                    name: true,
                    emoji: true,
                    color: true,
                    updatedAt: true,
                    createdAt: true,
                }, orderBy: {updatedAt: "desc"}
            })
    
            const categoriesWithcounts = await Promise.all(
                websiteCategories.map(async(category) => {
                    const now = new Date()
                    const firstDayOfMonth = startOfMonth(now)
    
                    const [uniqueFieldCount, eventsCounts, lastPing] = await Promise.all([
                        db.event.findMany({
                            where: {EventCategory: {id: category.id},
                            createdAt: {gte: firstDayOfMonth},
                        }, 
                        select: {fields: true},
                        distinct: ["fields"],
                        }).then((events) => {
                            const fieldNames = new Set<string>()
                            events.forEach((event) => {
                                Object.keys(event.fields as object).forEach((fieldName) => {
                                    fieldNames.add(fieldName)
                                })
                            })
                            return fieldNames.size
                        }),
                        db.event.count({
                            where: {EventCategory: {id: category.id},
                            createdAt: {gte: firstDayOfMonth},}
                        }),
                        db.event.findFirst({
                            where: {EventCategory: {id: category.id}},
                            orderBy:{createdAt: "desc"},
                            select: {createdAt: true},
                        }),
                    ])
                    return {
                        ...category,
                        uniqueFieldCount,
                        eventsCounts,
                        lastPing: lastPing?.createdAt || null,
                    }
                })
            )
            return c.superjson({categories: categoriesWithcounts})
        }),

        
            deleteWebsite: privateProcedure
            .input(z.object({
              websiteId: z.string()
            }))
            .mutation(async({c, input}) => {
              
                const {websiteId} = input
        
                await db.website.delete({
                    // where: { website_id: websiteId }
                    where: { id: websiteId }

                })
        
                return c.json({success: true})
            }),
    
})

 