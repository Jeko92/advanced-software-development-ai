'use client';
import { useState } from 'react';
import MyServerComponent from './MyServerComponent';

export default function MyClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(0);
  return (
    <div>
      <button onClick={() => setState(state + 1)}>Increment</button>
      <h1>My Client Component</h1>
      <h2>Called inside client component:</h2>
      <MyServerComponent value={`Current state: ${state}`} />
      <h2>Passed as Children</h2>
      {children}
    </div>
  );
}
