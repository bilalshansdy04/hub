import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@shrimphub/ui/tokens.css";
import "./globals.css";
import { ToasterProvider } from "@/components/toaster-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ShrimpHub — Personal Life & Work OS",
  description: "All-in-one personal operating hub for finance, timebox, reading, notes and snippets.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' fill='%23ec4899' fill-opacity='0.2'/><path d='M7 14.5C8 17 11 18.5 14 18M17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12' stroke='%23ec4899' stroke-width='2' stroke-linecap='round'/><circle cx='10' cy='11' r='1.25' fill='%23f43f5e'/></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen antialiased`}>
        <ThemeProvider>
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
