import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ContactRouter = createTRPCRouter({
    storeContact: protectedProcedure.input(z.object({
        name: z.string(),
        email: z.string(),
        subject: z.string(),
        message: z.string(),
    }))
        .mutation(async ({ ctx, input }) => {

            if (!ctx.user.userId) {
                throw new Error("UnAuthorized client");
            }

            await ctx.db.contact.create({
                data: {
                    name: input.name,
                    email: input.email,
                    subject: input.subject,
                    message: input.message,
                }
            })

        })
})