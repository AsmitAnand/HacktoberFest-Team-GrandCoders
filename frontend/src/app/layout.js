import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import AppShell from '../components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'Hacktoberfest Copilot — AI-Powered Open-Source Contribution Assistant',
  description:
    'Turn "I want to contribute to open source" into "I have a plan and I am ready to submit a PR." AI-powered guidance powered by Google AI Gemma 4, repository exploration, step-by-step implementation roadmaps, test scaffolding, and PR generator.',
  keywords: [
    'hacktoberfest',
    'open source',
    'github',
    'contribution',
    'AI assistant',
    'beginner friendly',
    'good first issue',
    'pull request generator',
    'gemma 4',
    'FastAPI',
    'Next.js',
  ],
  authors: [
    { name: 'Asmit Anand', url: 'https://github.com/AsmitAnand' },
    { name: 'Kartikeya Sorout', url: 'https://github.com/KartikeyaSorout' },
    { name: 'Khushhal Kumar Bansal', url: 'https://github.com/Khushhalbansal' },
  ],
  openGraph: {
    title: 'Hacktoberfest Copilot — AI-Powered Contribution Assistant',
    description:
      'AI guidance for open-source contributors: simplified issue breakdowns, file pointers, unit tests, and 1-click PR templates.',
    url: 'https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders',
    siteName: 'Hacktoberfest Copilot',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hacktoberfest Copilot',
    description:
      'AI-Powered Open-Source Contribution Assistant for Hacktoberfest 2026.',
  },
};

export const viewport = {
  themeColor: '#F5F0E6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
