import { Server } from "socket.io"
import Redis from "ioredis";
import { produceMessage } from "./kafka";
import { db } from "@/server/db";

const pub = new Redis({
    host: 'valkey-12a88d4b-yadavankit97620-d80a.h.aivencloud.com',
    username: 'default',
    port: 22542,
    password: 'AVNS_Vo7vDvG1s9UfFIb0ddw'
})

const sub = new Redis({
    host: 'valkey-12a88d4b-yadavankit97620-d80a.h.aivencloud.com',
    username: 'default',
    port: 22542,
    password: 'AVNS_Vo7vDvG1s9UfFIb0ddw'
})


class SocketService {
    private _io: Server;

    constructor() {
        console.log("init socket server")
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe('MESSAGES');
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        const io = this.io
        console.log("Init Socket listeners...")
        io.on("connect", (socket) => {
            console.log(`New socket connected ${socket.id}`)

            socket.on('joinGroup', async ({ groupId, userId }: { groupId: string, userId: string }) => {
                socket.join(groupId)
                // console.log(`user ${userId} joined group ${groupId}`)

                const messages = await db.message.findMany({
                    where: { groupId },
                    orderBy: { createdAt: "asc" },
                    include: {
                        sender: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                })

                socket.emit("previousMessages", messages);
            })

            socket.on('event:message', async ({ message, groupId, userId }: { message: string, groupId: string, userId: string }) => {
                // console.log(`New message received: ${message} , ${groupId}`)

                //publis msg to redis
                // In your backend socket service (when publishing messages)
                await pub.publish('MESSAGES', JSON.stringify({        // From database
                    content: message,
                    senderId: userId,
                    createdAt: new Date(),
                    groupId,
                }));
            })


            socket.on('disconnect', () => {
                // console.log(`Socket disconnected ${socket.id}`)
            })
        })

        sub.on('message', async (channel, mes) => {
            if (channel === 'MESSAGES') {
                const message = JSON.parse(mes);

                // Structure message for Kafka with required fields
                const kafkaMessage = {
                    groupId: message.groupId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: new Date().toISOString()
                };

                // console.log('Forwarding to Kafka:', kafkaMessage);
                await produceMessage(JSON.stringify(kafkaMessage));

                io.to(message.groupId).emit('message', JSON.stringify(kafkaMessage));
            }
        });
    }
}

export default SocketService;
