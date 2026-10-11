'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrTrackerWidget from '../components/PrTrackerWidget';
import PipelineStatusWidget from '../components/PipelineStatusWidget';
import ExamplePresetsWidget from '../components/ExamplePresetsWidget';
import RoadmapSubway from '../components/RoadmapSubway';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const POPULAR_REPOS = [
    { name: 'adithyan-css/Brownie-Bliss', url: 'https://github.com/adithyan-css/Brownie-Bliss', icon: '🧁', badge: '569 Issues' },
    { name: 'fastapi/fastapi', url: 'https://github.com/fastapi/fastapi', icon: '⚡', badge: 'Python' },
    { name: 'facebook/react', url: 'https://github.com/facebook/react', icon: '⚛️', badge: 'UI' },
    { name: 'vercel/next.js', url: 'https://github.com/vercel/next.js', icon: '▲', badge: 'Fullstack' },
  ];

  const [recentRepos, setRecentRepos] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('hf_recent_repos') || '[]');
      if (Array.isArray(stored)) {
        setRecentRepos(stored);
      }
    } catch {
      // Ignore localStorage errors
    }

    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.getElementById('repo-url-input');
        if (input) {
          input.focus();
          input.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const saveRecentRepo = (url) => {
    try {
      const stored = JSON.parse(localStorage.getItem('hf_recent_repos') || '[]');
      const filtered = Array.isArray(stored) ? stored.filter((item) => item !== url) : [];
      const updated = [url, ...filtered].slice(0, 5);
      localStorage.setItem('hf_recent_repos', JSON.stringify(updated));
      setRecentRepos(updated);
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    saveRecentRepo(repoUrl);
    setIsLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(repoUrl)}`);
  };

  const handleQuickSelect = (url) => {
    setRepoUrl(url);
    saveRecentRepo(url);
    setIsLoading(true);
    router.push(`/analyze?url=${encodeURIComponent(url)}`);
  };

  const handleClearRecent = () => {
    try {
      localStorage.removeItem('hf_recent_repos');
      setRecentRepos([]);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="nb-home-container">
      {/* ─── PRIMARY REFERENCE DASHBOARD GRID (Matching Reference Image) ─── */}
      <section className="nb-primary-grid">
        {/* Left/Center Box: REPOSITORY ANALYZER */}
        <div className="nb-card nb-analyzer-main">
          <div className="nb-analyzer-main__header">
            <span className="nb-tag-tech">AI REPOSITORY ENGINE</span>
            <span className="nb-label-tracked">REPOSITORY ANALYZER</span>
          </div>

          {/* Neo-Brutalist Input Bar */}
          <form className="nb-search-form" onSubmit={handleSubmit}>
            <div className="nb-search-input-box">
              <span className="nb-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="nb-search-input"
                placeholder="example-org/starter-kit"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                required
                id="repo-url-input"
              />
              <button
                type="submit"
                className={`nb-search-submit-btn ${isLoading ? 'nb-search-submit-btn--loading' : ''}`}
                disabled={isLoading || !repoUrl}
                id="analyze-btn"
              >
                {isLoading ? 'Scanning...' : 'Analyze →'}
              </button>
            </div>
          </form>

          {/* Hero Headline with Bauhaus Decals */}
          <div className="nb-hero-headline-wrap">
            <div className="nb-hero-text-col">
              <h1 className="nb-hero-headline">
                Contribution,<br />
                Simplified.
              </h1>
              <p className="nb-hero-subtext">
                Turn open-source intimidation into confident pull requests with Google Gemma 4 roadmaps, issue difficulty classifiers, and test scaffolding.
              </p>
            </div>

            {/* Layered Bauhaus Yellow & Red Squares */}
            <div className="nb-bauhaus-decals" aria-hidden="true">
              <div className="nb-decal-box nb-decal-box--yellow" />
              <div className="nb-decal-box nb-decal-box--red" />
            </div>
          </div>

          {/* Contribution Roadmap Subway Graph */}
          <RoadmapSubway />
        </div>

        {/* Right Stack: PR Tracker + Pipeline Status + Example Presets */}
        <div className="nb-widgets-col">
          <PrTrackerWidget />
          <PipelineStatusWidget />
          <ExamplePresetsWidget onSelectPreset={handleQuickSelect} />
        </div>
      </section>

      {/* ─── QUICK REPOS & RECENT SEARCHES BAR ─── */}
      <section className="nb-quick-bar">
        <div className="nb-quick-bar__inner">
          <div className="nb-quick-group">
            <span className="nb-quick-label">⚡ Popular Repos:</span>
            <div className="nb-chips-row">
              {POPULAR_REPOS.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  className="nb-chip-btn"
                  onClick={() => handleQuickSelect(item.url)}
                >
                  <span className="nb-chip-icon">{item.icon}</span>
                  <span className="nb-chip-name">{item.name}</span>
                  <span className="nb-chip-badge">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {recentRepos.length > 0 && (
            <div className="nb-quick-group nb-quick-group--recent">
              <div className="nb-recent-header">
                <span className="nb-quick-label">🕒 Recent:</span>
                <button
                  type="button"
                  className="nb-clear-btn"
                  onClick={handleClearRecent}
                >
                  Clear
                </button>
              </div>
              <div className="nb-chips-row">
                {recentRepos.map((url) => {
                  const shortLabel = url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
                  return (
                    <button
                      key={url}
                      type="button"
                      className="nb-chip-btn nb-chip-btn--recent"
                      onClick={() => handleQuickSelect(url)}
                      title={url}
                    >
                      <span>{shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── NEO-BRUTALIST FEATURES GRID ─── */}
      <section className="nb-features-section" id="features">
        <div className="nb-section-header">
          <span className="nb-tag-badge">CORE CAPABILITIES</span>
          <h2 className="nb-section-title">Everything Needed for Hacktoberfest Success</h2>
          <p className="nb-section-desc">
            No more wandering through massive codebases wondering where to begin.
          </p>
        </div>

        <div className="nb-features-grid">
          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">🎯</span>
              <span className="nb-feature-tag">01 / DISCOVERY</span>
            </div>
            <h3 className="nb-feature-title">Smart Issue Discovery</h3>
            <p className="nb-feature-desc">
              Paginates concurrently through all open issues (even 500+ issues), filtering good first issues, documentation fixes, and triage tickets.
            </p>
          </div>

          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">🧠</span>
              <span className="nb-feature-tag">02 / EXPLANATION</span>
            </div>
            <h3 className="nb-feature-title">Plain-English Explanations</h3>
            <p className="nb-feature-desc">
              Gemma 4 strips away confusing maintainer shorthand and explains the problem in clear, plain language with why it matters.
            </p>
          </div>

          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">🗺️</span>
              <span className="nb-feature-tag">03 / ROADMAP</span>
            </div>
            <h3 className="nb-feature-title">Step-by-Step Plans</h3>
            <p className="nb-feature-desc">
              Receive a concrete implementation roadmap specifying exact file paths to open, functions to alter, and expected code changes.
            </p>
          </div>

          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">🧪</span>
              <span className="nb-feature-tag">04 / TESTING</span>
            </div>
            <h3 className="nb-feature-title">Automated Test Scaffolding</h3>
            <p className="nb-feature-desc">
              Suggests pytest / jest unit test cases tailored to your changes so your PR passes maintainer CI tests on the first try.
            </p>
          </div>

          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">🚀</span>
              <span className="nb-feature-tag">05 / PR GENERATOR</span>
            </div>
            <h3 className="nb-feature-title">1-Click PR Descriptions</h3>
            <p className="nb-feature-desc">
              Generates a professional GitHub markdown pull request template with linked issues, checklist items, and test evidence.
            </p>
          </div>

          <div className="nb-card nb-feature-box">
            <div className="nb-feature-box__top">
              <span className="nb-feature-icon">⚡</span>
              <span className="nb-feature-tag">06 / VERIFIED MERGE</span>
            </div>
            <h3 className="nb-feature-title">Hacktoberfest Compliant</h3>
            <p className="nb-feature-desc">
              Ensures your contributions meet official quality rules, prevent spam flags, and count directly toward your Hacktoberfest badge.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
