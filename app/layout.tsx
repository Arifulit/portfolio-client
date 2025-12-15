import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import BodyWrapper from '../components/BodyWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MyPortfolio - Web Developer',
  description: 'Personal portfolio showcasing my projects and blog posts',
  keywords: ['portfolio', 'web developer', 'blog', 'projects'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'),
  openGraph: {
    siteName: 'MyPortfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased" style={{ backgroundColor: 'transparent' }} suppressHydrationWarning>
        <BodyWrapper>
          <ClientLayout>
            {children}
          </ClientLayout>
        </BodyWrapper>
      </body>
    </html>
  );
}

// app/layout.tsx
