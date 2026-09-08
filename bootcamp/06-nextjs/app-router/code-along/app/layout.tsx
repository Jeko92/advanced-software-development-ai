import { Cherry_Bomb_One } from 'next/font/google';

const cherryBomb = Cherry_Bomb_One({
  weight: '400',
  subsets: ['latin'],
});

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" className={cherryBomb.className}>
      <body>
        <header>
          <h1>Kiki's Delivery Service</h1>
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
