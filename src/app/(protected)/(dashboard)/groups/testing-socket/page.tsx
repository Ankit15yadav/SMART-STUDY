'use client'
import React from 'react'
// import classes from "./page.module.css"
import { useSocket } from '@/context/SocketProvider'

type Props = {}

const HomePage = (props: Props) => {

    const { sendMessage, messages } = useSocket()
    const [message, setMessage] = React.useState("")

    return (
        <div>
            <div>
                <input
                    //   className={classes["chat-input"]}
                    placeholder='Message..'
                    value={message}

                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    //   className={classes["button"]}
                    onClick={(e) => { sendMessage(message); setMessage("") }}
                >send</button>
            </div>
            <div>
                <h1>All Messages will appear here</h1>
                {
                    messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))
                }
            </div>
        </div>
    )
}

export default HomePage