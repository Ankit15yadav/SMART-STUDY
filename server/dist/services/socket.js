"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        console.log("init socket server");
        this._io = new socket_io_1.Server({
            cors: {
                origin: "*",
                allowedHeaders: ["*"],
            }
        });
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
            });
            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }
}
exports.default = SocketService;
