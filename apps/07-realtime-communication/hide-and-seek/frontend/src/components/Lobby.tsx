import { X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSocketStore } from '@/store/socketStore';
import { NICKNAME_MAX_LENGTH } from '@/types';
import { CreateRoomForm } from './CreateRoomForm';
import { RoomList } from './RoomList';

export function Lobby() {
  const notice = useSocketStore((s) => s.notice);
  const clearMessages = useSocketStore((s) => s.clearMessages);
  const nickname = useSocketStore((s) => s.nickname);
  const setNickname = useSocketStore((s) => s.setNickname);

  return (
    <div className="grid gap-4 md:grid-cols-[22rem_1fr] md:items-start">
      {notice && (
        <Alert className="md:col-span-2">
          <AlertDescription className="flex items-center justify-between gap-4">
            {notice}
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dismiss"
              onClick={clearMessages}
            >
              <X />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2 md:col-span-2 md:max-w-sm">
        <Label htmlFor="nickname">Your name</Label>
        <Input
          id="nickname"
          value={nickname}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder="Shown in chat when you watch a game"
          autoComplete="nickname"
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <CreateRoomForm />
      <RoomList />
    </div>
  );
}
