import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FocusModeProvider } from '@/providers/FocusModeProvider';
import { WorkspaceProvider } from '@/providers/WorkspaceProvider';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Meetly AI — focused video meetings',
  description:
    'A modern, focused space for design-quality video meetings, scheduling, and recordings.',
  applicationName: 'Meetly AI',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'Meetly AI',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#06090A' },
    { media: '(prefers-color-scheme: light)', color: '#06090A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${grotesk.variable}`}>
      <ClerkProvider
        localization={{
          signIn: {
            start: {
              title: 'Sign in to Meetly AI',
              subtitle: 'Welcome back — pick up where you left off.',
            },
          },
          signUp: {
            start: {
              title: 'Create your Meetly AI account',
              subtitle: 'A calmer way to meet — get set up in seconds.',
            },
          },
        }}
        appearance={{
          layout: {
            logoImageUrl: '/images/logo.svg',
            socialButtonsVariant: 'blockButton',
            helpPageUrl: '',
            privacyPageUrl: '',
            termsPageUrl: '',
          },
          variables: {
            colorText: '#ECEFEF',
            colorPrimary: '#36F0B6',
            colorBackground: '#0E1416',
            colorInputBackground: 'rgba(255,255,255,0.03)',
            colorInputText: '#fff',
            colorTextSecondary: '#A6B0B3',
            borderRadius: '14px',
            fontFamily: 'var(--font-sans)',
          },
          elements: {
            footer: 'hidden',
            footerAction: 'hidden',
            logoBox: 'justify-center mb-2',
            socialButtonsBlockButton:
              'bg-white text-ink-950 border-0 hover:bg-white/90 transition',
            socialButtonsBlockButton__google:
              'bg-white text-ink-950 border-0 hover:bg-white/90 transition',
            socialButtonsBlockButtonText: 'text-ink-950 font-semibold',
            socialButtonsProviderIcon: '',
          },
        }}
      >
        <body
          className="min-h-screen bg-ink-950 font-sans text-white antialiased"
          suppressHydrationWarning
        >
          <div className="pointer-events-none fixed inset-0 -z-10 bg-mesh-dark opacity-90" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-noise opacity-[0.35] mix-blend-overlay" />
          <WorkspaceProvider>
            <FocusModeProvider>
              <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
            </FocusModeProvider>
          </WorkspaceProvider>
          <ServiceWorkerRegister />
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
