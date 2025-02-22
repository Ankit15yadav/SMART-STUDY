"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = require("ioredis");
const pub = new ioredis_1.Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || "",
});
console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_USERNAME);
console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PASSWORD);
const sub = new ioredis_1.Redis({
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || "",
});
pub.on("error", (err) => console.error("Redis Error:", err));
sub.on("error", (err) => console.error("Redis Error:", err));
class SocketService {
    constructor() {
        console.log("init socket server");
        this._io = new socket_io_1.Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            }
        });
        sub.subscribe('MESSAGES');
    }
    get io() {
        return this._io;
    }
    initListener() {
        const io = this.io;
        console.log("Init socket listener");
        io.on("connect", (socket) => {
            console.log(`Client connected: ${socket.id}`);
            socket.on("message", async ({ message }) => {
                console.log(`Message received : ${message}`);
                await pub.publish('MESSAGES', JSON.stringify({ message }));
            });
            socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
        sub.on('message', async (channel, mes) => {
            if (channel === 'MESSAGES') {
                console.log("msg fron redis", mes);
                io.emit('message:db', mes);
            }
        });
    }
}
exports.default = SocketService;
