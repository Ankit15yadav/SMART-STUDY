import { Server } from "socket.io"
import Redis from "ioredis";

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


            socket.on('event:message', async ({ message }: { message: string }) => {
                // console.log(`New message received: ${message}`)

                //publis msg to redis
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            })


            socket.on('disconnect', () => {
                // console.log(`Socket disconnected ${socket.id}`)
            })
        })

        sub.on('message', async (channel, mes) => {
            if (channel === 'MESSAGES') {
                // console.log("new message from redis", mes)
                io.emit('1', mes)
                // await produceMessage(mes);
                // console.log("Message produce to kafka broker");
            }
        })
    }
}

export default SocketService;
