'use client'
import React, { useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import io from 'socket.io-client';

interface Message {
  id: number;
  sender: string;
  message: string;
}

const ChatComponent: React.FC = () => {
  // State to store incoming messages from the WebSocket
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Establish the WebSocket connection when the component mounts
    const socket = io('wss://localhost:7232/ws'); // Replace 'your-backend-url' with the actual WebSocket URL

    // Listen for incoming messages from the WebSocket
    socket.on('ReceiveMessage', (sender: string, message: string) => {
      const newMessage = `${sender}: ${message}`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to send a message to the backend
  const sendMessage = (message: string) => {
    // Send the message to the backend using WebSocket
    // Replace 'your-backend-url' with the actual WebSocket URL
    const socket = io('wss://localhost:7232/ws');
    socket.emit('SendMessage', { sender: 'User1', message });
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