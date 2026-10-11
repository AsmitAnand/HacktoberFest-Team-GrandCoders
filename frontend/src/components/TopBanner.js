'use client';

import { useState, useEffect } from 'react';

export default function TopBanner({ onToggleSidebar, onOpenCommandPalette }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 19,
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  // Calculate live countdown to Hacktoberfest closing date
  useEffect(() => {
    // Target: End of Hacktoberfest (Oct 31, 23:59:59 UTC)
    const targetDate = new Date(Date.UTC(2026, 9, 31, 23, 59, 59)).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="nb-top-banner">
      <div className="nb-top-banner__left">
        {/* Mobile menu trigger */}
        <button 
          type="button" 
          className="nb-hamburger-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <span className="nb-hamburger-line" />
          <span className="nb-hamburger-line" />
          <span className="nb-hamburger-line" />
        </button>

        {/* Live Countdown Box */}
        <div className="nb-countdown-box">
          <span className="nb-countdown-label">ENDS IN:</span>
          <span className="nb-countdown-digits">
            <strong>{timeLeft.days}</strong> d : <strong>{String(timeLeft.hours).padStart(2, '0')}</strong> h :{' '}
            <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong> m :{' '}
            <strong className="nb-countdown-sec">{String(timeLeft.seconds).padStart(2, '0')}</strong> s
          </span>
        </div>
      </div>

      <div className="nb-top-banner__right">
        {/* Command palette search shortcut */}
        <button 
          type="button" 
          className="nb-search-shortcut-btn"
          onClick={onOpenCommandPalette}
          title="Open Command Palette (Ctrl+K)"
        >
          <span>🔍</span>
          <span className="nb-search-shortcut-text">Search Repos</span>
          <kbd className="nb-kbd">Ctrl+K</kbd>
        </button>

        {/* Registration Live Badge */}
        <div className="nb-registration-badge">
          <span className="nb-badge-dot" />
          <span className="nb-badge-text">Registration Live</span>
        </div>
      </div>
    </header>
  );
}
