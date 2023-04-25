import React, { useState } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userMessage.trim() === '') return;

    setMessages([...messages, { sender: 'user', text: userMessage }]);
    setUserMessage('');

    const aiResponse = await getAIResponse(userMessage);
    setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: aiResponse }]);
  };

  const getAIResponse = async (message: string) => {
    const response = `AI response to: ${message}`;
    return new Promise<string>((resolve) => setTimeout(() => resolve(response), 1000));
  };

  return (
    <div className="flex flex-col justify-between w-full max-w-md h-full max-h-[500px] border border-gray-300 rounded p-4 bg-gray-100">
      <div className="flex-grow overflow-y-auto flex flex-col gap-2">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : ''}`}>
            <span className={`inline-block p-2 rounded ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 items-center">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow py-1 px-3 border border-gray-300 rounded text-sm outline-none"
        />
        <button type="submit" className="py-1 px-3 bg-blue-500 text-white rounded text-sm cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
