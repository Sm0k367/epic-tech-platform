import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Epic Tech AI Agent™️',
  description: 'Cinematic AI Creative Platform - Image Generation, Intelligent Chat & Media Player',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Epic Tech AI Agent™️',
    description: 'Create cinematic visuals with AI',
    images: [{ url: 'https://epic-tech-platform-production.up.railway.app/og-image.jpg' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-[#050505] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
