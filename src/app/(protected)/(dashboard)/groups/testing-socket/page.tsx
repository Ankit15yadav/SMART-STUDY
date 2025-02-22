'use client'
import { useSocket } from '@/context/SocketProvider';
import React, { useEffect } from 'react'
import io from "socket.io-client"

type Props = {}

const socket = io("http://localhost:8000");

const TestingSocket = (props: Props) => {

    const { sendMessage } = useSocket();

    useEffect(() => {
        socket.on("message", (data) => {
            console.log(data);
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <div>

        </div>
    )
}

export default TestingSocket