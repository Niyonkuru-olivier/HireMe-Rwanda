import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BotpressChatbot from "@/components/BotpressChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobConnect Rwanda - Find Jobs & Hire Talent",
  description: "JobConnect Rwanda connects job seekers with employers across Rwanda. Find your next opportunity or hire top talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Botpress Webchat Scripts */}
        <script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js" async></script>
        <script src="https://files.bpcontent.cloud/2026/02/16/17/20260216175210-EE4UUI1L.json" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Botpress AI Chatbot Component for Custom Styling */}
        <BotpressChatbot />
      </body>
    </html>
  );
}
