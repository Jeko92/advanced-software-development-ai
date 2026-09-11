import { useState } from 'react';
import { Greeting } from './Greeting.tsx';

export const SetNameOnInputChange = () => {
  const [name, setName] = useState<string>('');
  return (
    <>
      <input
        onChange={(e) => {
          console.log(e.target.value);
          setName(e.target.value);
        }}
      />
      <Greeting name={name} />
    </>
  );
};
