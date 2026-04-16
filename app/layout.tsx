import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bogie1 Inter | อุปกรณ์ยุทธวิธีคุณภาพสูง",
  description:
    "Bogie1 Inter แบรนด์อุปกรณ์ยุทธวิธีคุณภาพสูงสัญชาติไทย จำหน่ายรองเท้าคอมแบท เสื้อผ้ายุทธวิธี กางเกงยุทธวิธี เข็มขัด โฮลสเตอร์ กระเป๋ายุทธวิธี และอุปกรณ์เสริม สำหรับทหาร ตำรวจ รปภ. และนักกีฬายิงปืน",
  keywords: [
    "tactical gear",
    "อุปกรณ์ยุทธวิธี",
    "รองเท้าคอมแบท",
    "เสื้อผ้ายุทธวิธี",
    "Bogie1",
    "BOGIE1 INTER",
    "tactical boots",
    "combat shirt",
    "holster",
    "tactical bag",
  ],
  authors: [{ name: "Bogie1 Inter" }],
  openGraph: {
    title: "Bogie1 Inter | อุปกรณ์ยุทธวิธีคุณภาพสูง",
    description:
      "แบรนด์อุปกรณ์ยุทธวิธีคุณภาพสูงสัญชาติไทย สำหรับทหาร ตำรวจ รปภ. และผู้รักในไลฟ์สไตล์ยุทธวิธี",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
