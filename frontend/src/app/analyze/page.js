'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('url');
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state (Issue #29)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    if (!repoUrl) {
      router.push('/');
      return;
    }

    const cacheKey = `hf_analysis_${encodeURIComponent(repoUrl)}`;

    // Try reading from sessionStorage for instant page back/forward navigation
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {
      // Ignore storage error
    }

    const fetchRepoData = async () => {
      try {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') || 'https://hacktoberfest-copilot-backend-production-fe4a.up.railway.app';
        const response = await fetch(`${apiBase}/api/analyze-repo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_url: repoUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze repository. Make sure the backend is running.');
        }

        const result = await response.json();
        setData(result);

        // Store in sessionStorage and save to recent searches
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
          const stored = JSON.parse(localStorage.getItem('hf_recent_repos') || '[]');
          const filtered = Array.isArray(stored) ? stored.filter((item) => item !== repoUrl) : [];
          localStorage.setItem('hf_recent_repos', JSON.stringify([repoUrl, ...filtered].slice(0, 5)));
        } catch {
          // Ignore storage quota errors
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [repoUrl, router]);

  // Derive difficulty and filtered issues
  const allIssues = useMemo(() => {
    if (!data?.beginner_issues) return [];
    return data.beginner_issues.map((issue) => {
      // Determine level based on labels or content
      const labelNames = (issue.labels || []).map((l) => (typeof l === 'string' ? l.toLowerCase() : ''));
      let difficulty = 'BEGINNER';
      if (labelNames.some((l) => l.includes('hard') || l.includes('advanced') || l.includes('expert'))) {
        difficulty = 'ADVANCED';
      } else if (labelNames.some((l) => l.includes('medium') || l.includes('intermediate') || l.includes('help wanted'))) {
        difficulty = 'INTERMEDIATE';
      } else if (labelNames.some((l) => l.includes('good first') || l.includes('beginner') || l.includes('easy') || l.includes('starter'))) {
        difficulty = 'BEGINNER';
      }
      return {
        ...issue,
        difficulty,
      };
    });
  }, [data]);

  // Compute counts per category
  const difficultyCounts = useMemo(() => {
    const counts = {
      ALL: allIssues.length,
      BEGINNER: 0,
      INTERMEDIATE: 0,
      ADVANCED: 0,
    };
    allIssues.forEach((issue) => {
      if (counts[issue.difficulty] !== undefined) {
        counts[issue.difficulty] += 1;
      } else {
        counts.BEGINNER += 1;
      }
    });
    return counts;
  }, [allIssues]);

  // Filtered issues based on query & difficulty
  const filteredIssues = useMemo(() => {
    return allIssues.filter((issue) => {
      const matchesDifficulty = selectedDifficulty === 'ALL' || issue.difficulty === selectedDifficulty;
      if (!matchesDifficulty) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = issue.title?.toLowerCase().includes(q);
      const bodyMatch = issue.body?.toLowerCase().includes(q);
      const labelMatch = (issue.labels || []).some((l) => 
        (typeof l === 'string' ? l.toLowerCase() : '').includes(q)
      );
      const numberMatch = String(issue.number).includes(q);

      return titleMatch || bodyMatch || labelMatch || numberMatch;
    });
  }, [allIssues, searchQuery, selectedDifficulty]);

  if (loading) {
    return (
      <div className="container dashboard">
        <div className="loading animate-fade-in">
          <div className="loading__spinner" />
          <h2 className="loading__text">Analyzing {repoUrl}...</h2>
          <p className="footer__text">
            This might take a moment. Gemma 4 is reading the README and mapping the file tree.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container dashboard">
        <div className="error animate-fade-in">
          <div className="error__icon">⚠️</div>
          <h2 className="error__title">Analysis Failed</h2>
          <p className="error__message">{error}</p>
          <button className="error__retry" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container dashboard animate-fade-in">
      <Link href="/" className="dashboard__back">
        ← Back to Search
      </Link>

      {/* Repo Summary Card */}
      <div className="repo-card">
        <div className="repo-card__header">
          <h1 className="repo-card__name">{data.repo.full_name}</h1>
          <div className="repo-card__stats">
            <span className="repo-card__stat">⭐ {data.repo.stars?.toLocaleString() || 0} stars</span>
            <span className="repo-card__stat">🍴 {data.repo.forks?.toLocaleString() || 0} forks</span>
            <span className="repo-card__stat">🟢 {data.repo.open_issues_count?.toLocaleString() || 0} issues</span>
          </div>
        </div>

        <p className="repo-card__desc">
          {data.readme_summary || data.repo.description || 'No description available.'}
        </p>

        <div className="repo-card__tags">
          {data.repo.language && (
            <span className="tag tag--tech">{data.repo.language}</span>
          )}
          {data.tech_stack?.map((tech) => (
            <span key={tech} className="tag tag--tech">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Search & Difficulty Filters Section */}
      <div className="filter-panel">
        <div className="filter-search-box">
          <span className="filter-search-icon">🔍</span>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search issues by title, body, label, or #number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="issue-search-input"
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

        <div className="filter-pills-row">
          <button
            className={`filter-pill ${selectedDifficulty === 'ALL' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedDifficulty('ALL')}
          >
            All Issues <span className="filter-pill__count">{difficultyCounts.ALL}</span>
          </button>
          <button
            className={`filter-pill filter-pill--beginner ${selectedDifficulty === 'BEGINNER' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedDifficulty('BEGINNER')}
          >
            🌱 Beginner (Good First Issue) <span className="filter-pill__count">{difficultyCounts.BEGINNER}</span>
          </button>
          <button
            className={`filter-pill filter-pill--intermediate ${selectedDifficulty === 'INTERMEDIATE' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedDifficulty('INTERMEDIATE')}
          >
            ⚡ Intermediate <span className="filter-pill__count">{difficultyCounts.INTERMEDIATE}</span>
          </button>
          <button
            className={`filter-pill filter-pill--advanced ${selectedDifficulty === 'ADVANCED' ? 'filter-pill--active' : ''}`}
            onClick={() => setSelectedDifficulty('ADVANCED')}
          >
            🔥 Advanced <span className="filter-pill__count">{difficultyCounts.ADVANCED}</span>
          </button>
        </div>
      </div>

      {/* Issues List Section */}
      <div className="issues-section">
        <div className="issues-section__header-row">
          <h2 className="issues-section__title">
            🎯 Filtered Contribution Opportunities
            <span className="tag tag--beginner">
              {filteredIssues.length} Shown
            </span>
          </h2>
          {(searchQuery || selectedDifficulty !== 'ALL') && (
            <button
              className="filter-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
        
        {filteredIssues.length === 0 ? (
          <div className="empty-filter-card animate-fade-in">
            <span className="empty-filter-icon">🔍</span>
            <h3>No matching issues found</h3>
            <p>
              We couldn&apos;t find any issues matching &ldquo;<strong>{searchQuery}</strong>&rdquo; under the{' '}
              <strong>{selectedDifficulty.toLowerCase()}</strong> difficulty filter.
            </p>
            <button
              className="empty-filter-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('ALL');
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="issue-list stagger-children">
            {filteredIssues.map((issue) => (
              <Link 
                href={`/issue/${issue.number}?url=${encodeURIComponent(repoUrl)}`} 
                key={issue.number}
                className="issue-card animate-fade-in-up"
              >
                <div className="issue-card__header">
                  <h3 className="issue-card__title">{issue.title}</h3>
                  <div className="issue-card__badge-group">
                    <span className={`tag tag--${issue.difficulty.toLowerCase()}`}>
                      {issue.difficulty}
                    </span>
                    <span className="issue-card__number">#{issue.number}</span>
                  </div>
                </div>
                <div className="issue-card__body">
                  {issue.body || 'No description provided.'}
                </div>
                <div className="issue-card__footer">
                  {issue.labels?.map((label) => (
                    <span key={typeof label === 'string' ? label : label.name} className="tag tag--label">
                      {typeof label === 'string' ? label : label.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="container dashboard">
          <div className="loading animate-fade-in">
            <div className="loading__spinner" />
            <h2 className="loading__text">Loading analysis...</h2>
          </div>
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
