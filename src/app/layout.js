import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ai Quiz Generator",
  description: "This is my custom Next.js app",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full py-2 bg-gray-800 text-gray-300 text-center text-md md:text-sm leading-tight">
          <div className="container mx-auto">
            <p>© {new Date().getFullYear()} Abishek S. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
