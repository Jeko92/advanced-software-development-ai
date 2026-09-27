import { useState } from 'react';
import { NativeWsPanel } from './components/native-ws-panel';
import { PollEffectPanel } from './components/poll-effect-panel';
import { PollStorePanel } from './components/poll-store-panel';

const TABS = [
  { id: 'native', label: 'Native WS', Component: NativeWsPanel },
  { id: 'effect', label: 'Poll · useEffect', Component: PollEffectPanel },
  { id: 'store', label: 'Poll · Zustand', Component: PollStorePanel },
] as const;

type TabId = (typeof TABS)[number]['id'];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('native');
  const { Component } = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">WebSockets code-along</h1>
        <p className="text-slate-600">
          Open this page in two tabs side by side to watch messages flow both
          ways.
        </p>
      </header>

      <nav className="flex gap-2 border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab.id === activeTab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Component />
    </main>
  );
}

export default App;
