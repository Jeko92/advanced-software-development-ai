import { Cherry_Bomb_One } from 'next/font/google';
import './globals.css';

const cherryBombOne = Cherry_Bomb_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cherry-bomb-one',
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cherryBombOne.variable}>
      <body>
        <header>
          <h1 style={{ fontFamily: cherryBombOne.style.fontFamily }}>
            Kiki's Delivery Service
          </h1>
        </header>
        {children}
      </body>
    </html>
  );
}
