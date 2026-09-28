import { useEffect } from 'react';
import { socket } from '@/socket';

export function useSocketConnection() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
}
