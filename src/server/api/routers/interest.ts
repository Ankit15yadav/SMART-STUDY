import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const interestRouter = createTRPCRouter({
    insertInterest: protectedProcedure
        .input(z.object({
            name: z.string().min(1)
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user.userId) throw new Error('Unauthorized')

            const user = await ctx.db.user.findUnique({
                where: {
                    id: ctx.user.userId
                }
            })

            if (!user) throw new Error('User not found')

            // initially empty hai usko update kr rhe hai
            try {
                const interest = await ctx.db.user.update({
                    where: { id: ctx.user.userId },
                    data: {
                        interests: [...(user.interests || []), input.name] // ✅ Use set instead of push
                    }
                });

                return interest;
            } catch (error) {
                console.error('Database update failed:', error);
                throw new Error('Database update failed');
            }
        })
})