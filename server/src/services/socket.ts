import { Server } from "socket.io"
import { Redis } from "ioredis"


const pub = new Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD || "",
})

console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_USERNAME);
console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PASSWORD);

const sub = new Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD || "",
})

pub.on("error", (err: any) => console.error("Redis Error:", err));
sub.on("error", (err: any) => console.error("Redis Error:", err));

class SocketService {
    private _io: Server;

    constructor() {
        console.log("init socket server");
        this._io = new Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            }
        })
        sub.subscribe('MESSAGES')
    }

    get io() {
        return this._io
    }

    public initListener() {
        const io = this.io
        console.log("Init socket listener");
        io.on("connect", (socket) => {
            console.log(`Client connected: ${socket.id}`);

            socket.on("message", async ({ message }: { message: string }) => {
                console.log(`Message received : ${message}`);

                await pub.publish('MESSAGES', JSON.stringify({ message }))

            })

            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            })
        })

        sub.on('message', async (channel, mes) => {
            if (channel === 'MESSAGES') {
                console.log("msg fron redis", mes);

                io.emit('message:db', mes);
            }
        })
    }
}

export default SocketService;