import type { Metadata } from 'next';
import { Tenali_Ramakrishna, Tenor_Sans } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '@/context/product-context';
import { CurrencyProvider } from '@/context/currency-context';
import { PostHogProvider } from './provider';

// const archivo = Archivo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reposition - Modern Menswear & Lifestyle',
  description:
    'Discover Reposition, a premium menswear brand offering modern, sophisticated clothing designed for the contemporary man. Shop our curated collection of high-quality garments.',
  keywords: [
    'menswear',
    'fashion',
    'clothing',
    'modern style',
    'premium fashion',
    'contemporary menswear',
    'male fashion',
    'mens clothing',
    'nigerian brands',
  ],
  authors: [{ name: 'Reposition' }],
  creator: 'Reposition',
  publisher: 'Reposition',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.re-position.co'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Reposition - Modern Menswear & Lifestyle',
    description:
      'Discover Reposition, a premium menswear brand offering modern, sophisticated clothing designed for the contemporary man. Shop our curated collection of high-quality garments.',
    url: 'https://www.re-position.co',
    siteName: 'Reposition',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Reposition - Modern Menswear',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
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
            <head>
              <meta
                name='google-site-verification'
                content='V8xmJkf3HH3aXER1MQyrN0kjQSl2lkje_PxbVcyg0JQ'
              />
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Reposition',
                    description:
                      'A premium menswear brand offering modern, sophisticated clothing designed for the contemporary man.',
                    url: 'https://www.re-position.co',
                    logo: '/logo.png',
                    sameAs: [
                      'https://www.instagram.com/reposition.co',
                      'https://twitter.com/repositionglo',
                      'https://www.tiktok.com/@repositionglobal',
                    ],
                    contactPoint: {
                      '@type': 'ContactPoint',
                      email: 'welcome@re-position.co',
                      contactType: 'customer service',
                      availableLanguage: 'English',
                    },
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'NG',
                      addressLocality: 'Abuja',
                      addressRegion: 'Abuja',
                    },
                    slogan: 'Modern Menswear for the Contemporary Man',
                  }),
                }}
              />
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Reposition',
                    url: 'https://www.re-position.co',
                    description:
                      'Discover Reposition, a premium menswear brand offering modern, sophisticated clothing designed for the contemporary man.',
                    publisher: {
                      '@type': 'Organization',
                      name: 'Reposition',
                    },
                    potentialAction: {
                      '@type': 'SearchAction',
                      target:
                        'https://www.re-position.co/search?q={search_term_string}',
                      'query-input': 'required name=search_term_string',
                    },
                  }),
                }}
              />
              <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Store',
                    name: 'Reposition Store',
                    description:
                      'Premium menswear store offering modern, sophisticated clothing',
                    url: 'https://www.re-position.co',
                    email: 'welcome@re-position.co',
                    address: {
                      '@type': 'PostalAddress',
                      addressCountry: 'NG',
                      addressLocality: 'Abuja',
                      addressRegion: 'Abuja',
                    },
                    openingHours: 'Mo-Fr 09:00-18:00',
                    paymentAccepted:
                      'Credit Card, Bank Transfer, Paystack, Mobile Money',
                    currenciesAccepted: 'NGN',
                  }),
                }}
              />
            </head>
            <body className={`${tenali.variable} ${tenor.variable}`}>
              {children}
            </body>
          </html>
        </CurrencyProvider>
      </ProductProvider>
    </PostHogProvider>
  );
}
