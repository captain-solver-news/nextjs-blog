import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Source_Serif_4, Syne } from 'next/font/google';
import './globals.css';
import '@/styles/themes.scss';
import '@/styles/reset.scss';
import '@/styles/base.scss';
import { Header } from '@/components/blocks/header/header';
import { Footer } from '@/components/blocks/footer/footer';
import { THEME_STORAGE_KEY } from '@/config';

const dmSans = DM_Sans({
  variable: '--font-ui',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  weight: ['400'],
});

const sourceSerif4 = Source_Serif_4({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} ${sourceSerif4.variable} ${syne.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
