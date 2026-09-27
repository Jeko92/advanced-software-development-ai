import { useState } from 'react';
import { ChatScreen } from './components/chat-screen';
import { JoinScreen } from './components/join-screen';
import { PRESET_ROOMS, type Session } from './lib/chat';
import { DEMO_MESSAGES, DEMO_TYPING_USERS, DEMO_USERS } from './lib/demo-data';

// Scaffold: renders the UI with static demo data and no socket at all.
// CHALLENGE.md, Task 1 replaces the demo data with a Zustand chat store.
function App() {
  const [session, setSession] = useState<Session | null>(null);

  if (!session) {
    return <JoinScreen onJoin={setSession} />;
  }

  return (
    <ChatScreen
      me={session.username}
      room={session.room}
      rooms={PRESET_ROOMS}
      messages={DEMO_MESSAGES}
      users={[...new Set([session.username, ...DEMO_USERS])]}
      typingUsers={DEMO_TYPING_USERS}
      connected
      onSend={(text) => console.log('send', text)}
      onTyping={(isTyping) => console.log('typing', isTyping)}
      onSelectRoom={(room) => setSession({ ...session, room })}
      onLeave={() => setSession(null)}
    />
  );
}

export default App;
