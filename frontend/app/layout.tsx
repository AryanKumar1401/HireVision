export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeRegistry } from "./theme-registry";
import RoleSwitchProvider from "@/components/RoleSwitchProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HireVision | AI-Powered Interview Insights",
  description:
    "Smarter interviews. Faster hires. Get AI-powered insights for recruiters and instant feedback for applicants.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          <RoleSwitchProvider>{children}</RoleSwitchProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
