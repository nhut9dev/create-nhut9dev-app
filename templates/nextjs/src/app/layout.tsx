import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import SubLayout from '~app/subLayout';
import { cn } from '~lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

type Props = {
  children: ReactNode;
};

export default async function LocaleLayout({ children }: Props) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={cn(
        'flex min-h-screen flex-col bg-slate-100',
        `${geistSans.variable} ${geistMono.variable} antialiased`,
        inter.className,
      )}
    >
      <NextIntlClientProvider>
        <SubLayout>{children}</SubLayout>
      </NextIntlClientProvider>
    </html>
  );
}
