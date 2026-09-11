import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <h4>{count}</h4>
      <button
        type="button"
        className="counter"
        onClick={() => {
          setCount((count: number) => count + 1);
          // console.log(count);
          console.log(`Current count is: ${count + 1}`);
        }}
      >
        Count is {count}
      </button>
    </>
  );
};
