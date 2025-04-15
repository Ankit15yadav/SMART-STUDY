import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const chats = createTRPCRouter({
    isChat: protectedProcedure.input(z.object({
        chatId: z.string(),
    })).query(async ({ ctx, input }) => {

        if (!ctx.user.userId) {
            throw new Error('UnAuthorized');
        }

        const foundChat = await ctx.db.chat.findUnique({
            where: {
                id: input.chatId
            }
        })

        return foundChat;
    }),

    createChat: protectedProcedure.input(
        z.object({
            chatId: z.string().optional(),
            title: z.string().optional(),
            prompt: z.string(),
            response: z.string(),
        })
    ).mutation(
        async ({ ctx, input }) => {

            if (!ctx.user.userId) {
                throw new Error("Unauthorized client");
            }

            const { prompt, response, chatId, title } = input;

            const chat = chatId ?
                await ctx.db.chat.upsert({
                    where: { id: chatId },
                    update: {
                        updatedAt: new Date(),
                    },
                    create: {
                        id: chatId,
                        userId: ctx.user.userId,
                        title: title ?? "new chat"
                    }
                })
                :
                await ctx.db.chat.create({
                    data: {
                        userId: ctx.user.userId,
                        title: title ?? "new chat",
                    }
                })

            const message = await ctx.db.resumeMessage.create({
                data: {
                    chatId: chatId!,
                    prompt,
                    response
                }
            })

            return { chat, message };
        }
    ),

    getHistory: protectedProcedure.query(async ({ ctx }) => {

        if (!ctx.user.userId) {
            throw new Error("An Error occured");
        }

        const history = await ctx.db.chat.findMany({
            where: {
                userId: ctx.user.userId,
            },
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                title: true,
                id: true,
                ResumeMessage: {
                    select: {
                        prompt: true,
                        response: true,
                        id: true,

                    }
                }
            }
        })

        return history;
    })
})