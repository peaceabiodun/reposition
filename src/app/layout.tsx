import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/product-context';

const archivo = Archivo({ subsets: ['latin'] });

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
    <ProductProvider>
      <html lang='en'>
        <body className={archivo.className}>{children}</body>
      </html>
    </ProductProvider>
  );
}
