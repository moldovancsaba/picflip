import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PicFlip',
  description: 'PicFlip Slideshow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
