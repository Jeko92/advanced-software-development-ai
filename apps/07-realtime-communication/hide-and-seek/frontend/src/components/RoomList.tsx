import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSocketStore } from '@/store/socketStore';
import { DIFFICULTIES, WORLD_SIZES, type GameStatus } from '@/types';

const STATUS_LABEL: Record<GameStatus, string> = {
  waiting: 'Waiting',
  'ready-check': 'Getting ready',
  countdown: 'Starting',
  running: 'Playing',
  paused: 'Paused',
  finished: 'Finished',
};

export function RoomList() {
  const rooms = useSocketStore((s) => s.rooms);
  const joinRoom = useSocketStore((s) => s.joinRoom);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Games</CardTitle>
        <CardDescription>
          Join a waiting game as the hider, or watch a full one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rooms.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No games yet — create one!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Settings</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => {
                const hasFreeSlot = room.players < 2;
                return (
                  <TableRow key={room.roomId}>
                    <TableCell className="font-medium">{room.roomId}</TableCell>
                    <TableCell>
                      {WORLD_SIZES[room.worldSize].label} ·{' '}
                      {DIFFICULTIES[room.difficulty].label}
                      {WORLD_SIZES[room.worldSize].baseSeconds === null &&
                        ' · ∞'}
                    </TableCell>
                    <TableCell>
                      {room.players}/2
                      {room.observers > 0 && ` · 👀 ${room.observers}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hasFreeSlot ? 'default' : 'secondary'}>
                        {STATUS_LABEL[room.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={hasFreeSlot ? 'default' : 'outline'}
                        onClick={() => joinRoom(room.roomId)}
                      >
                        {hasFreeSlot ? 'Join' : 'Watch'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
