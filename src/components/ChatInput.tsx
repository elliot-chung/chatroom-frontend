import React, { useMemo, useRef, useState } from "react"
import { ChromePicker, ColorResult } from "react-color"

type Props = {
  socket: WebSocket
  color: string
  setColor: (color: string) => void
  user: string
  setUser: (user: string) => void
}

const invert = (color: string) => {
  const hexStr = color.replace("#", "0x")
  const hex = parseInt(hexStr)
  const r = (hex >> 16) & 255
  const g = (hex >> 8) & 255
  const b = hex & 255

  const lumosity = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return lumosity > 128 ? "#000000" : "#ffffff"
}

const ChatInput = (props: Props) => {
  const { socket, color, setColor, user, setUser } = props
  const [messageText, setMessageText] = useState<string>("")
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const colorNum = parseInt(color.replace("#", ""), 16)

  const sendMessage = () => {
    if (messageText === "") {
      return
    }
    const message = {
      Type: "message",
      User: user,
      Text: messageText,
      Color: colorNum,
    }

    socket.send(JSON.stringify(message))
    setMessageText("")
    inputRef.current && (inputRef.current.value = "")
    inputRef.current?.focus()
  }

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      buttonRef.current?.click()
    }
  }

  const setName = () => {
    if (inputRef.current?.value === "") {
      return
    }
    setUser(inputRef.current?.value || "")
    inputRef.current && (inputRef.current.value = "")
    inputRef.current?.focus()
    setDisplayColorPicker(false)
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex)
  }

  // const invertedColor = useMemo(() => invert(color), [color])
  const invertedColor = "#ffffff"

  return (
    <div className="flex h-20 flex-row justify-center bg-[#0d0d1f] px-3 pt-4 pb-8">
      <div
        className="relative mr-3 aspect-square h-full rounded-full border-4"
        style={{ backgroundColor: color, borderColor: invertedColor }}
      >
        {displayColorPicker && (
          <ChromePicker
            className="absolute -top-80"
            disableAlpha
            color={color}
            onChangeComplete={handleColorChange}
          />
        )}
      </div>

      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange={inputHandler}
        className="mr-2 block h-full w-4/5 rounded-lg border border-gray-300 bg-gray-50 p-4 pl-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        placeholder="Message"
        required
      />
      <button
        onClick={user === "" ? setName : sendMessage}
        ref={buttonRef}
        className="h-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Send
      </button>
    </div>
  )
}

export default ChatInput
