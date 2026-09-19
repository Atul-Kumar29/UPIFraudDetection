import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "UPI Sentinel • Fraud Intelligence",
  description: "Real-time overview of network health, behavioural deviations, and priority alerts across UPI switch nodes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F2EB] text-[#2C3228] selection:bg-[#8B9A6E] selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
