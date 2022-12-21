import React, { useEffect } from 'react'
import ServerMessage from '../types/ServerMessage'

type Props = {
    socket: WebSocket
}

const ChatWindow = (props: Props) => {
    const { socket } = props
    const [messages, setMessages] = React.useState<{ text: string, user: string, color: string }[]>([])
    const scrollRef = React.useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        socket.addEventListener("message", (event) => {
            console.log("Data received from server: ", event.data)
            const message: ServerMessage = JSON.parse(event.data)

            const colorString = "#" + message.Color.toString(16).padStart(6, "0").toUpperCase()

            if (message.Type === 'message') setMessages([...messages, { text: message.Text || "", user: message.User, color: colorString }])
        })
    }, [messages, socket])

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    }, [messages])

    return (
        <div className="w-4/5 m-auto h-1/5 overflow-y-scroll" ref={scrollRef}>
            {messages.map((message, index) => (
                <div className="flex flex-row" key={index}>
                    <p className="py-4 px-8 w-1/6 truncate" style={{color: message.color }}>{message.user}</p>
                    <p className="p-4 w-5/6 text-white">{message.text}</p>
                </div>
            ))}
        </div>
    )
}

export default ChatWindow
