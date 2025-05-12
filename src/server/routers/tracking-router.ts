import { WEBSITE_VALIDATOR } from "@/lib/validators/website-validator";
import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { z } from "zod";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { db } from "@/db";
import { HTTPException } from "hono/http-exception";



const handleError = (c: { json: (arg0: { success: boolean; error: any }, arg1: number) => any }, message: any, status = 500) => {
  return c.json({ success: false, error: message }, status);
};

export const trackingRouter = router({

  getWebsiteTrackings: privateProcedure
  .input(
   z.object(
    {
     domain: WEBSITE_VALIDATOR,
     page: z.number(),
     limit: z.number().max(50),
      timeRange: z.enum(["today", "week", "month", "all-time"]),

   }
   )

  ).query(async({c, input}) => {
    const {domain, page, limit, timeRange} = input

    const now = new Date()

    let startDate: Date | undefined

    switch(timeRange){
      case "today":
        startDate = startOfDay(now)
        break
      case "week":
        startDate = startOfWeek(now, {weekStartsOn: 0})
        break
      case "month":
        startDate = startOfMonth(now)
        break
      case "all-time":
        startDate = new Date(0)
        break;
    }

    const filters: any = {
      domain,
    };

    if(startDate){
      filters.createdAt = {
        gte: startDate,
      };
    }

    const [website_visits, pages_viewed] = await Promise.all([
      db.website_visits.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {createdAt: "desc"}
      }),
      db.website_page_views.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {createdAt: "desc"}

      }),

    ])
     return c.superjson({
      website_visits, pages_viewed
    })
  }),

  pollWebsiteData: privateProcedure
  .input(
    z.object({
      domain: z.string(),
    })
  )
  .query(async ({c, input }) => {
    const { domain } = input;

    // Fetch website page views
 const pageViewsCount = await db.website_page_views.count({
  where: {
    domain,
  },
});

const pageViews = await db.website_page_views.findMany({
  where: {
    domain,
  },
});

const visitsCount = await db.website_visits.count({
  where: {
    domain,
  },
});

const visits = await db.website_visits.findMany({
  where: {
    domain,
  },
});

const hasTrackings = pageViewsCount || visitsCount > 0;

// // If neither dataset exists, throw an error
// if (!pageViews.length && !visits.length) {
//   throw new HTTPException(404, {
//     message: `No tracking data found for domain "${domain}"`,
//   });
// }
// console.log({
//   hasTrackings,
//   visits,
//   pageViews,
//   pageViewsCount,
//   visitsCount
// });


return c.json({
  hasTrackings,
  visits,
  pageViews,
  pageViewsCount,
  visitsCount
});

  }),

})