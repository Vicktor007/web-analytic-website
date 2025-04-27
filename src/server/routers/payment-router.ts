import { router } from "../__internals/router";
import { privateProcedure } from "../procedures";
import { createCheckOutSession } from "@/lib/stripe";

export const paymentRouter = router({
    createCheckOutSession: privateProcedure.mutation(async({c, ctx}) => {
        const {user} = ctx
        const session = await createCheckOutSession({
            userEmail: user.email,
            userId: user.id
        })
        return c.json({url: session.url})
    }),

    getUserPlan: privateProcedure.query(async({c,ctx})=>{
        const {user} = ctx
        return c.json({plan:user.plan})
    })
})