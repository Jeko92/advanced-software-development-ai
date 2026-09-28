import { roomLabel, type ChatMessage } from '../lib/chat';
import { Avatar } from './avatar';
import { ConnectionBadge } from './connection-badge';
import { MessageComposer } from './message-composer';
import { MessageList } from './message-list';
import { PresenceList } from './presence-list';
import { RoomSidebar } from './room-sidebar';
import { TypingIndicator } from './typing-indicator';

type ChatScreenProps = {
  me: string;
  room: string;
  rooms: readonly string[];
  messages: ChatMessage[];
  users: string[];
  typingUsers: string[];
  connected: boolean;
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  onSelectRoom: (room: string) => void;
  onSelectUser?: ((user: string) => void) | undefined;
  onLeave: () => void;
};

export function ChatScreen({
  me,
  room,
  rooms,
  messages,
  users,
  typingUsers,
  connected,
  onSend,
  onTyping,
  onSelectRoom,
  onSelectUser,
  onLeave,
}: ChatScreenProps) {
  const roomName = roomLabel(room, me);

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="flex w-64 shrink-0 flex-col gap-6 bg-slate-900 py-4 max-md:hidden">
        <div className="flex items-center gap-2 px-4">
          <span className="text-xl">💬</span>
          <span className="font-bold text-white">Real-time chat</span>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-2">
          <RoomSidebar
            rooms={rooms}
            currentRoom={room}
            me={me}
            onSelectRoom={onSelectRoom}
          />
          <PresenceList users={users} me={me} onSelectUser={onSelectUser} />
        </nav>
        <div className="flex items-center gap-2 border-t border-white/10 px-4 pt-4">
          <Avatar name={me} size="sm" />
          <span className="flex-1 truncate text-sm text-white">{me}</span>
          <button
            type="button"
            onClick={onLeave}
            className="text-xs text-slate-400 hover:text-white"
          >
            Leave
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col bg-slate-50">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div>
            <h1 className="font-semibold">{roomName}</h1>
            <p className="text-xs text-slate-500">
              {users.length} {users.length === 1 ? 'person' : 'people'} here
            </p>
          </div>
          <ConnectionBadge connected={connected} />
        </header>

        <MessageList messages={messages} me={me} roomName={roomName} />
        <TypingIndicator users={typingUsers} />
        <MessageComposer
          key={room}
          placeholder={`Message ${roomName}`}
          disabled={!connected}
          onSend={onSend}
          onTyping={onTyping}
        />
      </main>
    </div>
  );
}
