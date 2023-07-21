import React, { useState } from 'react';

interface Props {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={message} onChange={handleChange} />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;
