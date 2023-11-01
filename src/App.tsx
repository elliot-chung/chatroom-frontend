import { useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

const wsHost = "wss://chatroom-backend.fly.dev/chatroom";

const socket = new WebSocket(wsHost);

function App() {
  const [socketState, setSocketState] = useState("loading");
  const [user, setUser] = useState<string>("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    socket.onopen = () => {
      console.log("Connected to server");
      setSocketState("ready");
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
      setSocketState("error");
    };

    socket.onerror = () => {
      console.log("Error connecting to server");
      setSocketState("error");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#141430]">
      <h1 className="text-lg font-bold font-mono text-center pt-4 text-white">
        Chatroom App
      </h1>
      {socketState === "ready" && (
        <>
          <Canvas user={user} color={color} socket={socket} />
          <ChatWindow socket={socket} />
          <div className="mb-8">
            <ChatInput
              user={user}
              setUser={setUser}
              color={color}
              setColor={setColor}
              socket={socket}
            />
          </div>
        </>
      )}

      {socketState === "loading" && (
        <p className="text-center">Connecting...</p>
      )}
      {socketState === "error" && (
        <p className="text-center">Error connecting to server</p>
      )}
    </div>
  );
}

export default App;
