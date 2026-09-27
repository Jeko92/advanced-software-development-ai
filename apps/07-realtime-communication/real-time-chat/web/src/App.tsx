import { ChatScreen } from './components/chat-screen';
import { JoinScreen } from './components/join-screen';
import { useChatStore } from './stores/chat-store';

function App() {
  const username = useChatStore((s) => s.username);
  const room = useChatStore((s) => s.room);
  const rooms = useChatStore((s) => s.rooms);
  const messages = useChatStore((s) => s.messages);
  const users = useChatStore((s) => s.users);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const connected = useChatStore((s) => s.connected);
  const error = useChatStore((s) => s.error);
  const connect = useChatStore((s) => s.connect);
  const leave = useChatStore((s) => s.leave);
  const joinRoom = useChatStore((s) => s.joinRoom);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const setTyping = useChatStore((s) => s.setTyping);

  if (!username || !room) {
    return <JoinScreen onJoin={connect} error={error} />;
  }

  return (
    <ChatScreen
      me={username}
      room={room}
      rooms={rooms}
      messages={messages}
      users={users}
      typingUsers={typingUsers}
      connected={connected}
      onSend={sendMessage}
      onTyping={setTyping}
      onSelectRoom={joinRoom}
      onLeave={leave}
    />
  );
}

export default App;
