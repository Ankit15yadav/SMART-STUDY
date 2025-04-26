
import http from "http"
import { startMessageConsumer } from "./sockets/kafka";
import SocketService from "./sockets/socket";

export async function init() {

    startMessageConsumer();
    const socketService = new SocketService();
    const httpServer = http.createServer();
    const PORT = 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server is running on the port ${PORT}`)
    })

    socketService.initListeners();
}

init();