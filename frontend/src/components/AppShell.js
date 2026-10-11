'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBanner from './TopBanner';
import CommandPalette from './CommandPalette';
import BackToTop from './BackToTop';
import PrChecklistModal from './PrChecklistModal';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="nb-root-layout">
      {/* 1. Left Neo-Brutalist Blue Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onOpenCommandPalette={() => setCmdOpen(true)}
      />

      {/* 2. Main Content Canvas */}
      <div className="nb-main-canvas">
        {/* Top Countdown & Status Banner */}
        <TopBanner 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenCommandPalette={() => setCmdOpen(true)}
        />

        {/* Page Content */}
        <main className="nb-content-area">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="nb-footer">
          <div className="nb-footer__inner">
            <div className="nb-footer__left">
              <span className="nb-footer__brand">🎃 Hacktoberfest Copilot 2026</span>
              <p className="nb-footer__desc">
                AI-Powered Open-Source Contribution Assistant. Powered by Google Gemma 4 & GitHub API.
              </p>
            </div>
            <div className="nb-footer__links">
              <a 
                href="https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nb-footer__link"
              >
                GitHub Repo
              </a>
              <a 
                href="https://github.com/AsmitAnand/HacktoberFest-Team-GrandCoders/blob/main/docs/API.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nb-footer__link"
              >
                API Docs
              </a>
              <a 
                href="https://hacktoberfest.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="nb-footer__link"
              >
                Hacktoberfest
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* 3. Global Command Palette Modal */}
      <CommandPalette 
        isOpen={cmdOpen} 
        onClose={() => setCmdOpen(false)} 
      />

      {/* 4. Global PR Checklist Modal */}
      <PrChecklistModal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        repoUrl="https://github.com/adithyan-css/Brownie-Bliss"
        issueNumber={1}
      />

      {/* 5. Back to Top Button */}
      <BackToTop />
    </div>
  );
}
