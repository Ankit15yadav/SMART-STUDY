"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
async function init() {
    const socketService = new socket_1.default();
    const httpServer = http_1.default.createServer();
    const PORT = process.env.PORT || 8002;
    socketService.io.attach(httpServer);
    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    socketService.initListener();
}
init();
