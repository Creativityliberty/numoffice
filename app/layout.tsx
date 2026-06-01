import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Nümtema Office',
  description: 'Nümtema Desk - Client Project Tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-slate-100/50 font-sans text-slate-900 select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
