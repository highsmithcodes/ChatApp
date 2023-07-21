'use client'

import React, { useEffect, useState } from 'react';

interface Message {
  id: number;
  sender: string;
  message: string;
}

const ChatComponent: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]); // Replace 'any' with the type of active users data

  useEffect(() => {
    // Fetch chat history on the client-side
    fetch('https://localhost:7232/api/chat/history')
      .then((response) => response.json())
      .then((data) => setChatHistory(data))
      .catch((error) => console.error('Error fetching chat history:', error));

    console.log(activeUsers)

    // Fetch active users on the client-side
    fetch('https://localhost:7232/api/chat/users')
      .then((response) => response.json())
      .then((data) => setActiveUsers(data))
      .catch((error) => console.error('Error fetching active users:', error));
  }, []);

  return (
    <div>
      <h1>Chat History</h1>
      <ul>
        {/* {chatHistory.map((message) => (
          <li key={message.id}>
            <p>{message.sender}: {message.message}</p>
          </li>
        ))} */}
      </ul>
      {/* Render active users data here */}
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>
            <p>{user}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatComponent;
