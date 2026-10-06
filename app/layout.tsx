import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: 'Nabil Rakdani — Principal AI & High-Performance Systems Architect',
  description: 'Designing, scaling, and securing enterprise-grade AI infrastructure, distributed GPU clusters, and high-throughput systems.',
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: '/' } } : {}),
  openGraph: {
    title: 'Nabil Rakdani — Intelligence, engineered.',
    description: 'Principal AI & High-Performance Systems Architect · Fractional CTO',
    type: 'website',
    ...(siteUrl ? { images: ['/social-preview.svg'] } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: '#090D13',
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
