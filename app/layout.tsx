import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "./components/sidebar";
import TopBar from "./components/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PineSap",
  description: "PineSap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <div className="drawer min-h-screen lg:drawer-open">
          <input id="pinesap-drawer" type="checkbox" className="drawer-toggle" />

          <div className="drawer-content">
            <TopBar />
            {children}
          </div>

          <SideBar />
        </div>
      </body>
    </html>
  );
}
