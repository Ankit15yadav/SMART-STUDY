import http from "http"
import prisma from "./services/prisma";
import SocketService from "./services/socket";

interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string | null;
    firstName: string | null;
    lastName: string | null;
    emailAddress: string;
    maxGroups: number;
    interests: string[];
}

async function init() {

    const socketService = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })

    socketService.initListener();
}

init();