import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const GroupRouter = createTRPCRouter({
    createGroup: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            description: z.string().min(1),
            Maxmembers: z.number().min(1),
            imageUrl: z.string().optional(),
            isPublic: z.boolean(),
            Tag: z.array(z.string()),
            privateGroupInfo: z.string().optional(),
            evaluationCriteria: z.string().optional(),
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
                        category: "",
                        isPublic: input.isPublic,
                        privateGroupInfo: input.privateGroupInfo,
                        evaluationCriteria: input.evaluationCriteria,

                        tags: input.Tag,
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
                createdBy: { id: ctx.user.userId! },
            },
            select: {
                tags: true,
                name: true,
                id: true,
                description: true,
                imageUrl: true,
                isPublic: true,
                maxMembers: true,
                category: true,
                members: true,
            }
        })
        return groups
    }),

    getUserInterest: protectedProcedure.query(async ({ ctx }) => {

        if (!ctx.user.userId) throw new Error('User not authenticated')

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId,
            }
        })

        if (!user) throw new Error('User not found')

        try {

            const interests = await ctx.db.user.findUnique({
                where: {
                    id: ctx.user.userId,
                },
                select: {
                    interests: true,
                },
            })

            return interests?.interests.at(-1);

        } catch (error) {
            console.log("Error while getting interests");

        }
    }),

    GetMatchingGroups: protectedProcedure.input(z.object({
        userInterests: z.array(z.string())
    })).query(async ({ ctx, input }) => {

        if (!ctx.user.userId) throw new Error('User not authenticated')

        try {

            const matchingGroup = await ctx.db.group.findMany({
                where: {
                    tags: {
                        hasSome: input.userInterests
                    },
                },
                select: {
                    tags: true,
                    name: true,
                    id: true,
                    description: true,
                    imageUrl: true,
                    isPublic: true,
                    maxMembers: true,
                    category: true,
                    members: true,
                    createdBy: true,
                    createdAt: true,
                    privateGroupInfo: true,
                    evaluationCriteria: true,
                }
            })

            return matchingGroup

        } catch (error) {
            console.log("Error while getting matching groups");
        }

    }),

    JoinGroup: protectedProcedure.input(z.object({
        groupId: z.string()
    })).mutation(async ({ ctx, input }) => {
        if (!ctx.user.userId) throw new Error('User not authenticated')

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId,
            }
        })

        if (!user) throw new Error('User not found')

        try {
            const group = await ctx.db.group.findUnique({
                where: {
                    id: input.groupId,
                },
            })

            if (!group) throw new Error('Group not found')

            const member = await ctx.db.group.update({
                where: {
                    id: input.groupId,
                },
                data: {
                    members: {
                        create: {
                            role: "member",
                            userId: ctx.user.userId,
                        }
                    }
                }
            })

            return member

        } catch (error) {
            console.error('Database update failed:', error);
            throw new Error('Database update failed');
        }
    }),

    getJoinedGroups: protectedProcedure.query(async ({ ctx }) => {

        if (!ctx.user.userId) throw new Error('User not authenticated')

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId,
            }
        })

        if (!user) throw new Error('User not found')

        try {

            const group = await ctx.db.group.findMany({
                where: {
                    members: {
                        some: {
                            userId: ctx.user.userId
                        }
                    },
                },
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    isPublic: true,
                    members: true,
                    maxMembers: true,
                }
            })

            return group;

        } catch (error) {
            console.log("Error while getting joined groups", error);
        }
    }),

    updateGroup: protectedProcedure.input(z.object({ groupId: z.string() })).mutation(async ({ ctx, input }) => {
        if (!ctx.user.userId) throw new Error('authorized');

        const user = await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId,
            }
        })

        if (!user) throw new Error('User not found')

        try {
            const groupUpdate = await ctx.db.group.update({
                where: {
                    id: input.groupId,
                    maxMembers: 4,
                },
                data: {
                    name: "name changed"
                }
            })

            return groupUpdate;
        } catch (error) {
            console.log("error while updating group info");
        }
    }),
})