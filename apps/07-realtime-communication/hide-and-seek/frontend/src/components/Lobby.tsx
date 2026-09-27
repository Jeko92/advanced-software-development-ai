import { X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/store/socketStore';
import { CreateRoomForm } from './CreateRoomForm';
import { RoomList } from './RoomList';

export function Lobby() {
  const notice = useSocketStore((s) => s.notice);
  const clearMessages = useSocketStore((s) => s.clearMessages);

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
      <CreateRoomForm />
      <RoomList />
    </div>
  );
}
