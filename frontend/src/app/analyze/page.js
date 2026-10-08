'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnalyzePage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('url');
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!repoUrl) {
      router.push('/');
      return;
    }

    const fetchRepoData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/analyze-repo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_url: repoUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze repository. Make sure the backend is running.');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [repoUrl, router]);

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

      <div className="repo-card">
        <div className="repo-card__header">
          <h1 className="repo-card__name">{data.repo.full_name}</h1>
          <div className="repo-card__stats">
            <span className="repo-card__stat">⭐ {data.repo.stars} stars</span>
            <span className="repo-card__stat">🍴 {data.repo.forks} forks</span>
            <span className="repo-card__stat">🟢 {data.repo.open_issues_count} issues</span>
          </div>
        </div>

        <p className="repo-card__desc">
          {data.readme_summary || data.repo.description || 'No description available.'}
        </p>

        <div className="repo-card__tags">
          {data.repo.language && (
            <span className="tag tag--tech">{data.repo.language}</span>
          )}
          {data.tech_stack.map((tech) => (
            <span key={tech} className="tag tag--tech">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="issues-section">
        <h2 className="issues-section__title">
          🎯 Beginner-Friendly Issues
          <span className="tag tag--beginner">
            {data.beginner_issues.length} Found
          </span>
        </h2>
        
        {data.beginner_issues.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
            No issues specifically labeled for beginners were found. Try looking at all issues.
          </p>
        ) : (
          <div className="issue-list stagger-children">
            {data.beginner_issues.map((issue) => (
              <Link 
                href={`/issue/${issue.number}?url=${encodeURIComponent(repoUrl)}`} 
                key={issue.number}
                className="issue-card animate-fade-in-up"
              >
                <div className="issue-card__header">
                  <h3 className="issue-card__title">{issue.title}</h3>
                  <span className="issue-card__number">#{issue.number}</span>
                </div>
                <div className="issue-card__body">
                  {issue.body || 'No description provided.'}
                </div>
                <div className="issue-card__footer">
                  {issue.labels.map((label) => (
                    <span key={label} className="tag tag--label">
                      {label}
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
