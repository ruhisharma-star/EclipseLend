import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'EclipseLend | Zero-Knowledge Private Underwriting Protocol',
  description: 'Underwrite decentralized institutional credit loans on Midnight Network without disclosing credit scores or financial records.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-titanium-950 text-slate-100 min-h-screen antialiased bg-grid-pattern`}>
        {children}
      </body>
    </html>
  );
}
