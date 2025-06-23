import type { Metadata } from "next";
import StyledComponentsRegistry from "../lib/styled";
import { SettingsProvider } from "../lib/settings-context";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Picito",
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
          <SettingsProvider>
            <Header />
            {children}
          </SettingsProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
