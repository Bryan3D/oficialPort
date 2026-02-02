import Footer from "@/components/footer";
import "./globals.css";
import Navbar from "@/components/navbar";
import ThemeProvider from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}