import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/product-context';
import { PostHogProvider } from './provider';

// const archivo = Archivo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reposition',
  description: 'Official reposition store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
      <ProductProvider>
        <html lang='en'>
          <body className={`Daikon`}>{children}</body>
        </html>
      </ProductProvider>
    </PostHogProvider>
  );
}
