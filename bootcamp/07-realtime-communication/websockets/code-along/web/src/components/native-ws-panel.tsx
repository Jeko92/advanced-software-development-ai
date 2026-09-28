import { useEffect, useRef, useState } from 'react';
import { NATIVE_WS_URL } from '../lib/config';
import { ConnectionBadge } from './connection-badge';
import { MessageLog } from './message-log';
import { Panel } from './panel';

export function NativeWsPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(NATIVE_WS_URL);
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      setConnected(true);
      socket.send('hello from the client');
    });

    socket.addEventListener('message', (event: MessageEvent<string>) => {
      console.log('received: ', event.data);
      setMessages((previous) => [...previous, event.data]);
    });

    socket.addEventListener('close', () => setConnected(false));

    return () => socket.close();
  }, []);

  const send = (text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(text);
    }
  };

  return (
    <Panel
      title="Native WebSocket"
      description="The browser's built-in WebSocket talking to a raw ws server that relays every message to all clients."
      status={<ConnectionBadge connected={connected} />}
    >
      <MessageLog messages={messages} onSend={send} />
    </Panel>
  );
}
