import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomNumber, setRoomNumber] = useState(0);

  const joinRoom = () => {
    if (roomNumber !== "") {
      socket.emit("join_room", roomNumber);
    } else {
      alert("Please enter a room number");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { message, roomNumber });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Chat App</h1>
      <div>
        <input
          type="text"
          value={roomNumber}
          placeholder="Enter room number"
          className="border p-2 rounded"
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <button 
          onClick={joinRoom}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
        >Join Room</button>
      </div>

      <div className="w-80 h-60 border p-2 overflow-auto bg-gray-100 text-gray-800">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm p-1">
            {msg}
          </p>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
