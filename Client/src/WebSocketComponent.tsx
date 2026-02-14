import { useEffect, useRef, useState } from 'react';
import type { IMessage } from './models/message';

const WebSocketComponent: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    fetch("http://localhost:8000/messages")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.map((m: IMessage) => m.message));
      })
      .catch((err) => console.error(err));

    socketRef.current = new WebSocket('ws://localhost:8000');

    socketRef.current.onopen = () => {
      console.log('Connected to server');
      socketRef.current?.send(JSON.stringify({ message: 'Hello from React' }));
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.messages.map((m: IMessage) => m.message));
      } else if (data.type === "new_message") {
        setMessages((prev) => [...prev, data.message.message]);
      }
    };

    socketRef.current.onclose = () => {
      console.log('Connection closed');
    };

    socketRef.current.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;

    socketRef.current?.send(JSON.stringify({ message: input }));
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2>React WebSocket Chat 🚀</h2>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default WebSocketComponent;