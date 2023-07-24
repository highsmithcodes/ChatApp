'use client'
import React, { useEffect, useState } from 'react';
import ChatInput from './ChatInput';

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Establish the WebSocket connection when the component mounts
    const ws = new WebSocket('wss://localhost:7232/api/chat/ws');

    // Listen for incoming messages from the WebSocket
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMessage = `${data.sender}: ${data.message}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Set the socket state to the WebSocket instance
    setSocket(ws);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    // Send the message to the WebSocket server
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ sender: 'User1', message }));
    }
  };

  return (
    <div>
      <h1>Chat History</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>{message}</p>
          </li>
        ))}
      </ul>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatComponent;
