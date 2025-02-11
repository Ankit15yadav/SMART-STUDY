import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Tag } from "lucide-react";


export const GroupRouter = createTRPCRouter({
    createGroup: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            description: z.string().min(1),
            Maxmembers: z.number().min(1),
            imageUrl: z.string().optional(),
            category: z.string().min(1),
            isPublic: z.boolean(),
            Tag: z.array(z.string())
        }))
        .mutation(async ({ ctx, input }) => {

            if (!ctx.user.userId) throw new Error('Unauthorized')

            const user = await ctx.db.user.findUnique({
                where: {
                    id: ctx.user.userId,
                }
            })

            if (!user) throw new Error('User not found')

            try {

                const group = await ctx.db.group.create({
                    data: {
                        name: input.name,
                        description: input.description,
                        maxMembers: input.Maxmembers,
                        imageUrl: input.imageUrl,
                        category: input.category,
                        isPublic: input.isPublic,

                        tags: {
                            create: input.Tag.map((tag) => ({
                                name: tag,
                            })),
                        },
                        members: {
                            create: {
                                userId: ctx.user.userId,
                                role: "admin",
                            },
                        },
                        createdBy: {
                            connect: { id: ctx.user.userId },
                        },
                    }

                })

                return group;

            } catch (error) {
                console.error('Database update failed:', error);
                throw new Error('Database update failed');
            }

        }),

    getMyGroups: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.user.userId) {
            throw new Error("User not authenticated")
        }
        const groups = await ctx.db.group.findMany({
            where: {
                createdBy: { id: ctx.user.userId! }
            }
        })
        return groups
    })
})