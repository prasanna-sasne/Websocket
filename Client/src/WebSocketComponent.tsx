import { useEffect, useRef, useState } from 'react';

const WebSocketComponent: React.FC = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  
  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8000');

    socketRef.current.onopen = () => {
      console.log('Connected to server');
      socketRef.current?.send('Hello from React');
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('Server says:', data);
      setMessages((prev) => [...prev, data.message]);
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