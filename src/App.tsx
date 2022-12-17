import { useEffect, useState } from 'react'
import ChatWindow from './components/chatwindow'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function App() {

  const message = {
    text: 'Hello World',
    user: 'John Doe'
  }

  const longMessage = {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eu nunc. Donec auctor, nisl eget ultr',
    user: 'John Doe'
  }

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState("");

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => setLastPong(new Date().toISOString()));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  return (
    <div className="App">
      <h1 className="text-lg text-center">Chat App</h1>
      <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={sendPing}>Send Ping</button>
    </div>
  )
}

export default App

