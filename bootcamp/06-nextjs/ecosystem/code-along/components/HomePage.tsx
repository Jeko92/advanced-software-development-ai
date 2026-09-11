import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-dusk">
      <Image
        src="/kiki.webp"
        alt="Kiki flying over the city on her broomstick, delivering a package"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-dusk via-dusk/50 to-transparent" />
      <div className="relative z-10 flex w-full max-w-160 flex-col items-start gap-3 px-6 py-12 text-white md:px-16 md:py-16">
        <h1 className="font-heading text-2xl md:text-3xl">
          Kiki&apos;s Delivery Service
        </h1>
        <p className="max-w-[34ch] text-white/80">
          Fast, reliable deliveries across the city.
        </p>
        <Button variant="brand" size="lg" asChild className="mt-1">
          <Link href="/deliveries">View all deliveries</Link>
        </Button>
      </div>
    </section>
  );
};

export default HomePage;
