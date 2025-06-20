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
      {children}
    </div>
  );
} 