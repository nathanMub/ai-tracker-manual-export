import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AIToolHub \u2014 Discover the Best AI Tools',
  description:
    'The world\u2019s most comprehensive AI tools directory. Find, compare, and review 20,000+ AI tools across writing, coding, image, video, and more.',
  openGraph: {
    title: 'AIToolHub \u2014 Discover the Best AI Tools',
    description: 'The world\u2019s most comprehensive AI tools directory.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
