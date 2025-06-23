import type { Metadata } from "next";
import StyledComponentsRegistry from "../lib/styled";

export const metadata: Metadata = {
  title: "PicFlip",
  description: "Image processing app - 2025-04-13T12:34:56.789Z",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
