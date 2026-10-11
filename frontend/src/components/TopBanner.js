'use client';

export default function TopBanner({ onToggleSidebar, onOpenCommandPalette }) {
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

        {/* Brand Status Tag (Replaces Countdown) */}
        <div className="nb-banner-brand-pill">
          <span className="nb-brand-dot">🎃</span>
          <span className="nb-brand-pill-text"><strong>Hacktoberfest 2026</strong> Copilot Engine</span>
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
