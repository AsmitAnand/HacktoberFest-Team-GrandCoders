import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle';

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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var pref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  var theme = saved || pref;
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* Animated background glow */}
        <div className="bg-glow" aria-hidden="true" />

        {/* Header */}
        <header className="header">
          <div className="header__inner">
            <a href="/" className="header__logo" id="header-logo">
              <span className="header__logo-icon">🎃</span>
              <span className="header__logo-text">Hacktoberfest Copilot</span>
            </a>
            <nav className="header__nav">
              <a href="/" className="header__link" id="nav-home">
                Home
              </a>
              <a href="/#features" className="header__link" id="nav-features">
                Features
              </a>
              <a href="/#how-it-works" className="header__link" id="nav-how-it-works">
                How It Works
              </a>
              
              {/* Theme Toggle Button (Issue #30) */}
              <ThemeToggle />

              <a
                href="https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders"
                target="_blank"
                rel="noopener noreferrer"
                className="header__github-btn"
                id="nav-github"
              >
                ⭐ GitHub
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="page-content">{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer__content">
            <p className="footer__text">
              Made with ❤️ by Team GrandCoders for Hacktoberfest 2026
            </p>
            <div className="footer__links">
              <a
                href="https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders/blob/main/docs/API.md" 
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Docs
              </a>
              <a
                href="https://hacktoberfest.com"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hacktoberfest
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
