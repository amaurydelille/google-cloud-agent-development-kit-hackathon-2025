import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

export const inter = Inter({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter'
});

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-neutral-800/20 to-neutral-700/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neutral-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neutral-700/10 rounded-full blur-3xl"></div>
      </div>
      {children}
    </div>
  );
} 