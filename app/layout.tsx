// Import necessary dependencies
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamically import Chatbot with no SSR to avoid hydration issues
const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ['latin'] });

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Jazeera Airways OTA FAQ',
  description: 'Navitaire DotRez API Integration FAQ',
};

// Root layout component that wraps all pages
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Set HTML language and enable smooth scrolling
    <html lang="en" className="scroll-smooth">
      {/* Apply Inter font to body text */}
      <body className={`${inter.className} relative`}>
        {/* Main content container */}
        <main className="min-h-screen bg-white">
          {children}
          <Chatbot />
        </main>
      </body>
    </html>
  );
}
