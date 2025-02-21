import { Server } from "socket.io"

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

            })

            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
            })
        })
    }
}

export default SocketService;