import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mamos gimtadienis',
  description: 'Šiltas gimtadienio puslapis mamai su prisiminimais ir palinkėjimais.',
  openGraph: {
    title: 'Mamos gimtadienis',
    description:
      'Šiltas gimtadienio puslapis mamai su prisiminimais ir palinkėjimais.',
    images: [
      {
        url: '/og.png',
        width: 1648,
        height: 900,
        alt: 'Mamos gimtadienis',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mamos gimtadienis',
    description:
      'Šiltas gimtadienio puslapis mamai su prisiminimais ir palinkėjimais.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}
