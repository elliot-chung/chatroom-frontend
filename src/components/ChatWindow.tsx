import React, { useEffect } from "react"
import ServerMessage from "../types/ServerMessage"

type Props = {
  socket: WebSocket
}

const ChatWindow = (props: Props) => {
  const { socket } = props
  const [messages, setMessages] = React.useState<
    { text: string; user: string; color: string }[]
  >([])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.addEventListener("message", (event) => {
      const message: ServerMessage = JSON.parse(event.data)
      if (message.Type !== "message") return

      const colorString =
        "#" + message.Color.toString(16).padStart(6, "0").toUpperCase()

      setMessages([
        ...messages,
        { text: message.Text || "", user: message.User, color: colorString },
      ])
    })
  }, [socket, messages])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  return (
    <div className="h-2/5 w-full overflow-y-auto shadow-inner" ref={scrollRef}>
      {messages.map((message, index) => (
        <div className="flex flex-row" key={index}>
          <p
            className="w-1/6 truncate py-2 pl-4"
            style={{ color: message.color }}
          >
            {message.user}
          </p>
          <p className="w-5/6 p-2 pr-4 text-white">{message.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatWindow
