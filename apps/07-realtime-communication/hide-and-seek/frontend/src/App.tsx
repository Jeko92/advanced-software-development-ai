import './App.css';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { GameScreen } from '@/components/GameScreen';
import { Lobby } from '@/components/Lobby';
import { useSocketConnection } from '@/hooks/useSocketConnection';
import { useSocketStore } from '@/store/socketStore';

function App() {
  const role = useSocketStore((s) => s.role);
  useSocketConnection();

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Hide and Seek</h1>
        <ConnectionStatus />
      </header>
      {role ? <GameScreen /> : <Lobby />}
    </main>
  );
}

export default App;
