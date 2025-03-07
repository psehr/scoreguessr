import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scoreguessr",
  description: "A simple osu! score guesser",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-white w-screen h-screen relative overflow-hidden `}
        >
          {children}
          <Image
            className="absolute object-cover w-full h-full top-0 -z-10 "
            src={"/wallhaven-j8lk95.jpg"}
            alt="bg"
            width={1980}
            height={1280}
          />
          <div className="absolute w-full h-full top-0 -z-10 backdrop-blur-md bg-gray-950/60"></div>
        </body>
      </SessionProvider>
    </html>
  );
}
