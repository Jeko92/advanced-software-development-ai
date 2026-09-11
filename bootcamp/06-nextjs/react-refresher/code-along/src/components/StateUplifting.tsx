// Callback functions example
import { useState } from 'react';
import { DataForm } from './DataForm.tsx';
import { Greeting } from './Greeting.tsx';

export const StateUplifting = () => {
  const [name, setName] = useState('');

  return (
    <>
      <DataForm setName={setName} />
      <Greeting name={name} />
    </>
  );
};
