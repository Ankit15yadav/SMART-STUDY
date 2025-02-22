'use client'

import React, { Children, createContext, useContext } from "react"

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
}

const socketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    {
        const state = useContext(socketContext);

        if (!state) {
            throw new Error('useSocket must be used within a SocketProvider');
        }

        return state;
    }
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {


    const sendMessage = (msg: string) => {
        console.log(msg);
    };

    return (
        <socketContext.Provider value={{ sendMessage }}>
            {children}
        </socketContext.Provider>
    )
}