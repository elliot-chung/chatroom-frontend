import { useEffect, useState } from 'react'
import Canvas from './components/Canvas'
import ChatInput from './components/ChatInput'
import ChatWindow from './components/ChatWindow'

const socket = new WebSocket('ws://localhost:3333')

function App() {
  const [socketState, setSocketState] = useState("loading")
  const [color, setColor] = useState("#000000")

  useEffect(() => {
    socket.onopen = () => {
      console.log("Connected to server")
      setSocketState("ready")
    }

    socket.onclose = () => {
      console.log("Disconnected from server")
      setSocketState("error")
    }

    socket.onerror = () => {
      console.log("Error connecting to server")
      setSocketState("error")
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#141430]">
      <h1 className="text-lg font-bold font-mono text-center text-white">Chatroom App</h1>
      {socketState === "ready" && (<>
      <Canvas color={color} socket={socket} />
      <ChatWindow socket={socket} />
      <ChatInput color={color} setColor={setColor} socket={socket}/>
      </>)}



      {socketState === "loading" && (
      <p className="text-center">Connecting...</p> 
      )}
      {socketState === "error" && (
      <p className="text-center">Error connecting to server</p>
      )}
    </div>
  )
}

export default App

