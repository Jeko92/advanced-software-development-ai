'use client';

const Error = ({
  error,
  reset,
}: {
  error: globalThis.Error;
  reset: () => void;
}) => {
  return (
    <div>
      <h2>Could not load deliveries.</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

export default Error;
