import React from 'react'
import io from "socket.io-client"

type Props = {}

const socket = io("http://localhost:8000");

const TestingSocket = (props: Props) => {
    return (
        <div>TestingSocket</div>
    )
}

export default TestingSocket