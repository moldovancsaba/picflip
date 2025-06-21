import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PicFlip - Simple Background Tiling',
  description: 'A simple background tiling demonstration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
