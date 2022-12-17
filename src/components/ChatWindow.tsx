import React from 'react'

type Props = {
    messages: {
        text: string,
        user: string,
    }[]
}

const ChatWindow = (props: Props) => {

    const { messages } = props

    // Display messages

    // Scrolling chatbox of messages
    return (
        <div className="">
            {messages.map((message, index) => (
                <div className="inline-flex" key={index}>
                    <p className="py-4 px-8 whitespace-nowrap">{message.user}</p>
                    <p className="p-4">{message.text}</p>
                </div>
            ))}
        </div>
    )
}

export default ChatWindow
