'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function FirstIssuesPage() {
  const [selectedTech, setSelectedTech] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const curatedIssues = [
    {
      id: 1013,
      repo: 'adithyan-css/Brownie-Bliss',
      repoUrl: 'https://github.com/adithyan-css/Brownie-Bliss',
      title: 'Hotlinked product images, dead footer links, and stray inline-style text leaking onto homepage',
      difficulty: 'Beginner',
      tech: 'CSS / HTML',
      labels: ['good first issue', 'bug', 'hacktoberfest', 'html/css'],
      githubUrl: 'https://github.com/adithyan-css/Brownie-Bliss/issues/1013',
      desc: 'Asset integrity issues: replace hotlinked external CDN images with local files in public/ and fix unclosed style tag.'
    },
    {
      id: 1014,
      repo: 'adithyan-css/Brownie-Bliss',
      repoUrl: 'https://github.com/adithyan-css/Brownie-Bliss',
      title: 'Order cart checkout total subtotal discount rounding discrepancy',
      difficulty: 'Beginner',
      tech: 'JavaScript',
      labels: ['good first issue', 'bug', 'hacktoberfest', 'javascript'],
      githubUrl: 'https://github.com/adithyan-css/Brownie-Bliss/issues/1014',
      desc: 'Floating point rounding error in cart summary calculations resulting in 1-cent mismatch during checkout.'
    },
    {
      id: 1020,
      repo: 'adithyan-css/Brownie-Bliss',
      repoUrl: 'https://github.com/adithyan-css/Brownie-Bliss',
      title: 'Missing accessibility aria-labels and alt text on dessert product showcase carousel',
      difficulty: 'Beginner',
      tech: 'CSS / HTML',
      labels: ['accessibility', 'good first issue', 'documentation'],
      githubUrl: 'https://github.com/adithyan-css/Brownie-Bliss/issues/1020',
      desc: 'Lighthouse audit flagged dessert image gallery cards for lacking descriptive alt attributes and aria tags.'
    },
    {
      id: 8921,
      repo: 'fastapi/fastapi',
      repoUrl: 'https://github.com/fastapi/fastapi',
      title: 'Improve tutorial documentation for async dependency overrides in test client',
      difficulty: 'Beginner',
      tech: 'Python',
      labels: ['documentation', 'good first issue'],
      githubUrl: 'https://github.com/fastapi/fastapi/issues/8921',
      desc: 'Update the Async Tests chapter to clarify how app.dependency_overrides behaves when using httpx.AsyncClient.'
    },
    {
      id: 4210,
      repo: 'vercel/next.js',
      repoUrl: 'https://github.com/vercel/next.js',
      title: 'Clarify middleware rewrite cookie header propagation docs in App Router',
      difficulty: 'Beginner',
      tech: 'TypeScript',
      labels: ['documentation', 'area: docs'],
      githubUrl: 'https://github.com/vercel/next.js/issues/4210',
      desc: 'Add code sample demonstrating how to forward custom authentication cookies in Next.js edge middleware rewrite.'
    },
    {
      id: 1105,
      repo: 'facebook/react',
      repoUrl: 'https://github.com/facebook/react',
      title: 'Fix typo in development console warning for hook call ordering invariant',
      difficulty: 'Beginner',
      tech: 'JavaScript',
      labels: ['Component: Developer Tools', 'good first issue'],
      githubUrl: 'https://github.com/facebook/react/issues/1105',
      desc: 'Clean up misspelled phrase in error message string inside react-reconciler development warning.'
    }
  ];

  const filteredIssues = useMemo(() => {
    return curatedIssues.filter((issue) => {
      const matchesTech = selectedTech === 'ALL' || issue.tech === selectedTech;
      if (!matchesTech) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.repo.toLowerCase().includes(q) ||
        issue.labels.some((l) => l.toLowerCase().includes(q))
      );
    });
  }, [curatedIssues, selectedTech, searchQuery]);

  return (
    <div className="container dashboard animate-fade-in" style={{ padding: '24px 28px' }}>
      <Breadcrumbs items={[{ label: 'First Issues', href: null }]} />

      {/* Header Banner */}
      <div className="nb-card" style={{ marginTop: '20px', padding: '28px' }}>
        <div className="nb-analyzer-main__header" style={{ marginBottom: '12px' }}>
          <span className="nb-tag-tech">CURATED OPPORTUNITIES</span>
          <span className="nb-label-tracked">FEATURE 04: FIRST ISSUES</span>
        </div>

        <h1 className="nb-hero-headline" style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>
          Good First Issues Hub
        </h1>
        <p className="nb-hero-subtext" style={{ maxWidth: '680px', marginBottom: '24px' }}>
          Discover verified beginner-friendly issues across top open-source projects. Every issue is pre-screened to ensure clear scope, accessible code, and complete Gemma 4 AI guidance.
        </p>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search Box */}
          <div className="filter-search-box" style={{ maxWidth: '600px' }}>
            <span className="filter-search-icon">🔍</span>
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search issues by title, label, or repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="first-issues-search"
            />
            {searchQuery && (
              <button
                className="filter-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tech Stack Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700 }}>
              FILTER BY TECH:
            </span>
            {['ALL', 'CSS / HTML', 'JavaScript', 'Python', 'TypeScript'].map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setSelectedTech(tech)}
                className={`filter-btn ${selectedTech === tech ? 'filter-btn--active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Count & List */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
            Showing {filteredIssues.length} Recommended Issues
          </h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--nb-text-muted)' }}>
            Hacktoberfest 2026 Eligible
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredIssues.map((issue) => (
            <div
              key={`${issue.repo}-${issue.id}`}
              className="nb-card"
              style={{
                padding: '24px',
                background: 'var(--nb-card-bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 700, 
                    fontSize: '0.82rem',
                    background: '#EFF6FF',
                    color: 'var(--nb-blue)',
                    border: '1.5px solid #000000',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>
                    {issue.repo}
                  </span>
                  <span className="tag tag--beginner">
                    {issue.difficulty}
                  </span>
                  <span className="tag tag--tech">
                    {issue.tech}
                  </span>
                </div>

                <a
                  href={issue.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: '0.85rem', 
                    fontFamily: 'var(--font-mono)', 
                    color: 'var(--nb-blue)', 
                    textDecoration: 'underline',
                    fontWeight: 700 
                  }}
                >
                  View on GitHub #{issue.id} ↗
                </a>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#000000' }}>
                {issue.title}
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                {issue.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '6px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {issue.labels.map((lbl) => (
                    <span key={lbl} style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'var(--font-mono)', 
                      background: '#F3F4F6', 
                      color: '#4B5563',
                      border: '1px solid #D1D5DB',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      #{lbl}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/issue/${issue.id}?url=${encodeURIComponent(issue.repoUrl)}`}
                  className="nb-search-submit-btn"
                  style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                >
                  🚀 Analyze Issue with Gemma 4 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
