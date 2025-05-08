import { db } from "@/db";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import {startOfDay, startOfMonth, startOfWeek} from "date-fns";
import { z } from "zod";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { parseColor } from "@/lib/utils";
import { HTTPException } from "hono/http-exception";

// export const dynamic = "force-dynamic"


const handleError = (c: { json: (arg0: { success: boolean; error: any }, arg1: number) => any }, message: any, status = 500) => {
  return c.json({ success: false, error: message }, status);
};


export const categoryRouter = router({
    getEventCategories: privateProcedure.query(async({c, ctx}) =>{
        const categories = await db.eventCategory.findMany({
            where: {userId: ctx.user.id},
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
            categories.map(async(category) => {
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


    createEventCategory: privateProcedure
    .input(
        z.object({
            name:CATEGORY_NAME_VALIDATOR,
            color: z
            .string()
            .min(1, "Color is required")
            .regex(/^#[0-9A-F]{6}$/i,"Invalid color format."),
            emoji: z.string().emoji("Invalid emoji").optional(),
            websiteId: z.string()
        })
    )
    .mutation(async({c, ctx, input}) => {
        const {user} = ctx
        const {color, name, emoji, websiteId} = input

        const eventCategory = await db.eventCategory.create({
            data: {
                name: name.toLowerCase(),
                color: parseColor(color),
                emoji,
                userId: user.id,
                website_id: websiteId
            }
        })

        return c.json({eventCategory})
    }),



    deleteCategory: privateProcedure
    .input(z.object({name: z.string(),
      websiteId: z.string()
    }))
    .mutation(async({c, input, ctx}) => {
      
 

  
        
        const {name, websiteId} = input

        await db.eventCategory.delete({
            where: {name_userId: {name, userId: ctx.user.id},  website_id: websiteId }
        })

        return c.json({success: true})
    }),

    insertQuickStartCategories: privateProcedure
    .input(z.object({
      websiteId: z.string()
    }))
    .mutation(
        async({ctx, c, input}) => {

          const {websiteId} = input;
          try{
            const categories = await db.eventCategory.createMany({
                data: [{name: "Bug", emoji: "🪲", color: 0xff6b6b},
                    {name: "Sale", emoji: "💰", color: 0xffeb3b},
                    {name: "Question", emoji: "❓", color: 0x6c5ce7},
                ].map((category) => ({
                    ...category,
                    userId: ctx.user.id,
                    website_id: websiteId
                })),
            })
            return c.json({success: true, count: categories.count})
          }  catch (error) {
            console.error("Error creating quickstart categories:", error);
            return handleError(c, "Failed to quickstart categories");
          }
        }
    ),

    pollCategory: privateProcedure
    .input(z.object({name: CATEGORY_NAME_VALIDATOR,
      websiteId: z.string()
    }))
    .query(async({c, ctx, input}) => {
        const {name, websiteId } = input

        const category = await db.eventCategory.findUnique({
            where: {
                name_userId: {name, userId: ctx.user.id},
                website_id: websiteId
            },
            include:{
                _count: {
                    select: {
                        events: true,
                    },
                },
            },
        })
        if(!category){
            throw new HTTPException(404, {
                message: `Category "${name}" not found`,
            })
        }

        const hasEvents = category._count.events > 0

        return c.json({hasEvents})
    }),

    getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        websiteId: z.string(),
        page: z.number(),
        limit: z.number().max(50),
        timeRange: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, page, websiteId, limit, timeRange } = input

      const now = new Date()
      let startDate: Date

      switch (timeRange) {
        case "today":
          startDate = startOfDay(now)
          break
        case "week":
          startDate = startOfWeek(now, { weekStartsOn: 0 })
          break
        case "month":
          startDate = startOfMonth(now)
          break
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.event.findMany({
          where: {
            EventCategory: { name, userId: ctx.user.id, website_id: websiteId },
            createdAt: { gte: startDate },
          },
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.event.count({
          where: {
            EventCategory: { name, userId: ctx.user.id, website_id: websiteId },
            createdAt: { gte: startDate },
          },
        }),
        db.event
          .findMany({
            where: {
              EventCategory: { name, userId: ctx.user.id, website_id: websiteId },
              createdAt: { gte: startDate },
            },
            select: {
              fields: true,
            },
            distinct: ["fields"],
          })
          .then((events) => {
            const fieldNames = new Set<string>()
            events.forEach((event) => {
              Object.keys(event.fields as object).forEach((fieldName) => {
                fieldNames.add(fieldName)
              })
            })
            return fieldNames.size
          }),
      ])

      return c.superjson({
        events,
        eventsCount,
        uniqueFieldCount,
      })
    }),
})