import { useState, type FormEvent } from 'react';
import { Dices } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSocketStore } from '@/store/socketStore';
import {
  DIFFICULTIES,
  GAME_MODES,
  gameLengthFor,
  ROOM_NAME_MAX_LENGTH,
  WORLD_SIZES,
  type Difficulty,
  type GameMode,
  type RoomError,
  type WorldSize,
} from '@/types';

const ROOM_NAME_WORDS = [
  'shadow',
  'whisper',
  'hollow',
  'thicket',
  'lantern',
  'acorn',
  'willow',
  'comet',
  'meadow',
  'ripple',
  'ember',
  'breeze',
  'pebble',
  'harbor',
  'cinder',
  'raven',
  'otter',
  'juniper',
  'marble',
  'thistle',
  'hush',
  'glimmer',
  'dusk',
  'nook',
  'burrow',
  'fox',
  'badger',
  'sparrow',
  'sly',
  'nimble',
  'quiet',
  'swift',
  'clever',
  'sneaky',
  'playful',
  'brave',
  'silent',
  'curious',
  'gentle',
  'lucky',
];

const ROOM_ERROR_TEXT: Record<RoomError, string> = {
  'invalid-name': `Room names need 1–${ROOM_NAME_MAX_LENGTH} characters.`,
  'name-taken': 'A room with that name already exists — join it from the list.',
  'invalid-settings': 'Pick a world size and difficulty.',
  'not-found': 'That room no longer exists.',
  'already-in-room': 'You are already in a room.',
};

const SIZES = Object.keys(WORLD_SIZES) as WorldSize[];
const LEVELS = Object.keys(DIFFICULTIES) as Difficulty[];

function randomRoomName() {
  const pick = () =>
    ROOM_NAME_WORDS[Math.floor(Math.random() * ROOM_NAME_WORDS.length)];
  return `${pick()}-${pick()}`;
}

export function CreateRoomForm() {
  const [roomName, setRoomName] = useState('');
  const [worldSize, setWorldSize] = useState<WorldSize>('small');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [mode, setMode] = useState<GameMode>('classic');
  const createRoom = useSocketStore((s) => s.createRoom);
  const roomError = useSocketStore((s) => s.roomError);
  const clearMessages = useSocketStore((s) => s.clearMessages);
  const roundLength = gameLengthFor(worldSize, difficulty, mode);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = roomName.trim() || randomRoomName();
    setRoomName(name);
    createRoom({ roomName: name, worldSize, difficulty, mode });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a game</CardTitle>
        <CardDescription>
          You start as the seeker — the next player to join hides.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-room" className="grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="room-name">Room name</Label>
            <div className="flex gap-2">
              <Input
                id="room-name"
                value={roomName}
                maxLength={ROOM_NAME_MAX_LENGTH}
                placeholder="e.g. sneaky-otter"
                autoComplete="off"
                onChange={(e) => {
                  setRoomName(e.target.value);
                  clearMessages();
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Random room name"
                onClick={() => setRoomName(randomRoomName())}
              >
                <Dices />
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label id="world-size-label">World size</Label>
            <ToggleGroup
              aria-labelledby="world-size-label"
              variant="outline"
              className="w-full"
              value={[worldSize]}
              onValueChange={(v) => v[0] && setWorldSize(v[0] as WorldSize)}
            >
              {SIZES.map((size) => (
                <ToggleGroupItem key={size} value={size} className="flex-1">
                  {WORLD_SIZES[size].gridSize}×{WORLD_SIZES[size].gridSize}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2">
            <Label id="difficulty-label">Difficulty</Label>
            <ToggleGroup
              aria-labelledby="difficulty-label"
              variant="outline"
              className="w-full"
              value={[difficulty]}
              onValueChange={(v) => v[0] && setDifficulty(v[0] as Difficulty)}
            >
              {LEVELS.map((level) => (
                <ToggleGroupItem key={level} value={level} className="flex-1">
                  {DIFFICULTIES[level].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2">
            <Label id="mode-label">Mode</Label>
            <ToggleGroup
              aria-labelledby="mode-label"
              variant="outline"
              className="w-full"
              value={[mode]}
              onValueChange={(v) => v[0] && setMode(v[0] as GameMode)}
            >
              {(Object.keys(GAME_MODES) as GameMode[]).map((m) => (
                <ToggleGroupItem key={m} value={m} className="flex-1">
                  {GAME_MODES[m].label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-xs text-muted-foreground">
              {GAME_MODES[mode].description}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {roundLength === null
              ? 'No time limit — catch only'
              : `Round length: ${roundLength} s`}
          </p>

          {roomError && (
            <Alert variant="destructive">
              <AlertDescription>{ROOM_ERROR_TEXT[roomError]}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="create-room" className="w-full">
          Create game
        </Button>
      </CardFooter>
    </Card>
  );
}
