export default function MyServerComponent({ value }: { value: string }) {
  console.log('---');
  console.log('passend in value: ', value);
  console.log(
    typeof window === 'undefined'
      ? 'running on the server'
      : 'running on the client',
  );
  return (
    <h1>
      My Server Component with value{' '}
      <span style={{ padding: '8px', border: '1px solid black' }}>{value}</span>
    </h1>
  );
}
