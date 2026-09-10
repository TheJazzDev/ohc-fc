import type { Metadata } from "next";
import { Oswald, Work_Sans } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "OHC FC",
  description: "Official site of OHC FC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${workSans.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bg font-body text-fg antialiased">{children}</body>
    </html>
  );
}
