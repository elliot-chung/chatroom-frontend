import React, { useRef, useState } from 'react'
import { SketchPicker, ColorResult } from 'react-color'

type Props = {
  socket: WebSocket
  color: string
  setColor: (color: string) => void
  user: string
  setUser: (user: string) => void
}

const ChatInput = (props: Props) => {
  const { socket, color, setColor, user, setUser } = props
  const [messageText, setMessageText] = useState<string>('')
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(true)

  const inputRef = useRef<HTMLInputElement>(null)

  const colorNum = parseInt(color.replace("#", ""), 16)

  const sendMessage = () => {
    if (messageText === '') {
      return
    }
    const message = {
      Type: 'message',
      User: user,
      Text: messageText,
      Color: colorNum,
    }

    socket.send(JSON.stringify(message))
    setMessageText('')
    inputRef.current && (inputRef.current.value = '')
    inputRef.current?.focus()
  }

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (user === '') {
        setName()
      } else {
        sendMessage()
      }
    }
  }

  const setName = () => {
    if (inputRef.current?.value === '') {
      return
    }
    setUser(inputRef.current?.value || '')
    inputRef.current && (inputRef.current.value = '')
    inputRef.current?.focus()
    setDisplayColorPicker(false)
  }

  const handleColorChange = (color: ColorResult) => {
    setColor(color.hex)
  }
  
  return (
    <div className="flex flex-row justify-center">
      <div className="rounded-full h-14 w-14 mr-3 relative" style={{backgroundColor: color }}>
        {displayColorPicker && <SketchPicker className="absolute -top-80" color={color} onChange={handleColorChange} /> }
      </div>
      
      {user === "" ? (<>
      <input ref={inputRef} onKeyDown={handleKeyDown} className="block w-4/5 mr-2 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Set Name and Color" required/>
      <button onClick={setName} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Confirm</button>
      </>) : (<>
      <input ref={inputRef} onKeyDown={handleKeyDown} onChange={inputHandler} className="block w-4/5 mr-2 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Message" required/>
      <button onClick={sendMessage} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
      </>)}
    </div>
  )
}

export default ChatInput