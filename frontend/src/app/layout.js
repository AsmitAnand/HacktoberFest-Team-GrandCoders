import './globals.css';

export const metadata = {
  title: 'Hacktoberfest Copilot — AI-Powered Open-Source Contribution Assistant',
  description:
    'An AI-powered assistant that helps beginners navigate the open-source contribution process. Discover beginner-friendly issues, get step-by-step implementation plans, and generate professional PR descriptions.',
  keywords: [
    'hacktoberfest',
    'open source',
    'github',
    'contribution',
    'AI assistant',
    'beginner',
    'pull request',
    'gemma',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
              <a href="#features" className="header__link" id="nav-features">
                Features
              </a>
              <a href="#how-it-works" className="header__link" id="nav-how-it-works">
                How It Works
              </a>
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
              <a href="/docs" className="footer__link">
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
