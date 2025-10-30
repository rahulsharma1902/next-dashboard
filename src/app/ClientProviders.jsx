'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'blue',
  fontFamily: 'var(--font-geist-sans)',
  fontFamilyMonospace: 'var(--font-geist-mono)',
});

export default function ClientProviders({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-right" />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </div>
  );
}