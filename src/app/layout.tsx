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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Botpress AI Chatbot Widget */}
        <BotpressChatbot />
      </body>
    </html>
  );
}
