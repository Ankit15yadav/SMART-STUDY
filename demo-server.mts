import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinGroup", async ({ groupId, userId }) => {
        socket.join(groupId);

        // Fetch previous messages with sender details
        const messages = await prisma.message.findMany({
            where: { groupId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        socket.emit("previousMessages", messages);
    });


    socket.on("sendMessage", async ({ groupId, senderId, content }) => {
        if (!groupId || !senderId || !content) return;

        const message = await prisma.message.create({
            data: {
                groupId,
                senderId,
                content,
                createdAt: new Date(),
            },
            include: {
                sender: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        io.to(groupId).emit("newMessage", {
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            createdAt: message.createdAt,
            sender: message.sender, // Include sender details
        });
    });


    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(4000, () => console.log("Socket.IO Server running on port 4000"));