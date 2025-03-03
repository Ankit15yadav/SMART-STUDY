'use client'

import { useUser } from '@clerk/nextjs'
import { join } from 'path'
import React, { useCallback, createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client"

interface SocketProviderProps {
    children?: React.ReactNode
}

// Update your Message interface to match backend
interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    groupId: string;
    sender: {
        firstName: string,
        lastName: string,
    }
}

interface ISocketContext {
    sendMessage: (msg: string, groupId?: string, userId?: string) => any
    messagess: Message[]
    joinGroup: (groupId: string, userId: string) => any
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext)

    if (!state) {
        throw new Error("State is udefined")

    }

    return state

}


export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>()
    const [messagess, setMessages] = useState<Message[]>([])

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg, groupId, userId) => {
        // console.log('send Message', msg)

        if (socket) {
            socket.emit('event:message', { message: msg, groupId, userId })
        }

    }, [socket])

    const onMessageReceived = useCallback((msg: string) => {
        // console.log('Message received', msg);
        try {
            const message = JSON.parse(msg) as Message;
            // console.log(message.content)
            setMessages((prev) => [...prev, message]);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    }, []); // Ensure dependencies are correct if needed

    const joinGroup = useCallback((groupId: string, userId: string) => {
        if (socket) {
            socket.emit("joinGroup", { groupId, userId })
        }
    }, [socket]);


    useEffect(() => {
        const _socket = io("http://localhost:8000");

        _socket.on('connect_error', (err) => {
            console.log('Connection error:', err);
        });

        _socket.on('message', onMessageReceived);
        _socket.on("previousMessages", (messages) => {
            setMessages(messages)
        })
        setSocket(_socket);

        return () => {
            _socket.disconnect();
            _socket.off('message', onMessageReceived);
            setSocket(undefined);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ sendMessage, messagess, joinGroup }}>
            {children}
        </SocketContext.Provider>
    )
}