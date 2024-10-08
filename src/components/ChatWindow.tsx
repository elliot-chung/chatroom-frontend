import React, { useEffect } from "react"
import ServerMessage from "../types/ServerMessage"

type Props = {
  socket: WebSocket
}

const invert = (color: string) => {
  const hexStr = color.replace("#", "0x")
  const hex = parseInt(hexStr)
  const r = (hex >> 16) & 255
  const g = (hex >> 8) & 255
  const b = hex & 255

  const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminosity > 128 ? "#000000" : "#ffffff"
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
    <div
      className="mx-auto h-full w-11/12 overflow-y-auto overflow-x-hidden shadow-inner"
      ref={scrollRef}
    >
      {messages.map((message, index) => (
        <div
          className="m-1 flex flex-row rounded-md"
          key={index}
          style={{ backgroundColor: message.color }}
        >
          <p
            className="w-1/6 truncate py-2 pl-4"
            style={{ color: invert(message.color) }}
          >
            {message.user}
          </p>
          <p
            className="text-balance w-5/6 break-words p-2 pr-8"
            style={{ color: invert(message.color) }}
          >
            {message.text}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ChatWindow
