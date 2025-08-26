import type { Metadata } from 'next';
import { Tenali_Ramakrishna, Tenor_Sans } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/product-context';
import { CurrencyProvider } from '@/context/currency-context';
import { PostHogProvider } from './provider';

// const archivo = Archivo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reposition',
  description: 'Official reposition store',
};

const tenali = Tenali_Ramakrishna({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-tenali',
});

const tenor = Tenor_Sans({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-tenor',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
      <ProductProvider>
        <CurrencyProvider>
          <html lang='en' suppressHydrationWarning={true}>
            {/* <head>
              <script
                src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
                defer
              ></script>
            </head> */}
            <body className={`${tenali.variable} ${tenor.variable}`}>
              {children}
            </body>
          </html>
        </CurrencyProvider>
      </ProductProvider>
    </PostHogProvider>
  );
}
