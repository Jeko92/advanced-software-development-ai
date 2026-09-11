import Image from 'next/image';

export const HomePage = () => {
  return (
    <div>
      <h1>Kiki&apos;s Delivery Service</h1>
      <p>Fast, reliable deliveries across the city.</p>
      <Image
        src="/kiki.webp"
        alt="Kiki flying over the city on her broomstick, delivering a package"
        width={320}
        height={480}
        priority
      />
    </div>
  );
};
