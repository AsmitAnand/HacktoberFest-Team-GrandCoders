'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

function IssueContent({ params }) {
  const issueNumber = params.id;
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('url');
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('understand');
  const [explainData, setExplainData] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [testsData, setTestsData] = useState(null);
  const [prData, setPrData] = useState(null);

  const [loadingExplain, setLoadingExplain] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingPr, setLoadingPr] = useState(false);

  const [error, setError] = useState('');
  const [copiedPr, setCopiedPr] = useState(false);
  const [copiedTest, setCopiedTest] = useState(false);
  const [toast, setToast] = useState(null);

  // Initial fetch for explanation
  useEffect(() => {
    if (!repoUrl || !issueNumber) {
      router.push('/');
      return;
    }

    const fetchExplanation = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/explain-issue`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo_url: repoUrl, issue_number: parseInt(issueNumber) }),
        });

        if (!response.ok) throw new Error('Failed to fetch explanation.');
        const result = await response.json();
        setExplainData(result);
      } catch (err) {
        setError(err.message);
        setToast({ message: err.message || 'Failed to load explanation.', type: 'error' });
      } finally {
        setLoadingExplain(false);
      }
    };

    fetchExplanation();
  }, [repoUrl, issueNumber, router]);

  // Fetch plan when tab is clicked
  const loadPlan = async () => {
    if (planData || loadingPlan) return;
    setLoadingPlan(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl, issue_number: parseInt(issueNumber) }),
      });
      if (!response.ok) throw new Error('Failed to generate plan.');
      const result = await response.json();
      setPlanData(result);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to generate plan.', type: 'error' });
    } finally {
      setLoadingPlan(false);
    }
  };

  // Fetch tests when tab is clicked
  const loadTests = async () => {
    if (testsData || loadingTests) return;
    setLoadingTests(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/suggest-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_url: repoUrl,
          issue_number: parseInt(issueNumber),
          plan: planData?.approach || '',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate test suggestions.');
      const result = await response.json();
      setTestsData(result);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load test suggestions.', type: 'error' });
    } finally {
      setLoadingTests(false);
    }
  };

  // Fetch PR when tab is clicked
  const loadPr = async () => {
    if (prData || loadingPr) return;
    setLoadingPr(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/generate-pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl, issue_number: parseInt(issueNumber) }),
      });
      if (!response.ok) throw new Error('Failed to generate PR.');
      const result = await response.json();
      setPrData(result);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to generate PR description.', type: 'error' });
    } finally {
      setLoadingPr(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'plan') loadPlan();
    if (tab === 'tests') loadTests();
    if (tab === 'pr') loadPr();
  };

  const copyToClipboard = () => {
    if (prData?.body) {
      navigator.clipboard.writeText(prData.body);
      setCopiedPr(true);
      setToast({ message: 'PR description copied to clipboard!', type: 'success' });
      setTimeout(() => setCopiedPr(false), 2000);
    }
  };

  const copyTestCode = () => {
    if (testsData?.example_code) {
      navigator.clipboard.writeText(testsData.example_code);
      setCopiedTest(true);
      setToast({ message: 'Test code copied to clipboard!', type: 'success' });
      setTimeout(() => setCopiedTest(false), 2000);
    }
  };

  if (loadingExplain) {
    return (
      <div className="container issue-detail">
        <div className="loading animate-fade-in">
          <div className="loading__spinner" />
          <h2 className="loading__text">Gemma 4 is reading Issue #{issueNumber}...</h2>
          <p className="footer__text">Simplifying jargon and determining difficulty.</p>
        </div>
      </div>
    );
  }

  if (error || !explainData) {
    return (
      <div className="container issue-detail">
        <div className="error animate-fade-in">
          <div className="error__icon">⚠️</div>
          <h2 className="error__title">Oops</h2>
          <p className="error__message">{error || 'Something went wrong.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container issue-detail animate-fade-in">
      <Link href={`/analyze?url=${encodeURIComponent(repoUrl)}`} className="dashboard__back">
        ← Back to Repository
      </Link>

      <div className="issue-detail__header">
        <h1 className="issue-detail__title">{explainData.issue.title}</h1>
        <div className="issue-detail__meta">
          <span>Issue #{explainData.issue.number}</span>
          <span className={`tag tag--${explainData.difficulty.toLowerCase()}`}>
            {explainData.difficulty}
          </span>
          <a 
            href={explainData.issue.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--color-accent-blue)', textDecoration: 'underline' }}
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="tabs">
        <div className="tabs__list">
          <button 
            className={`tabs__tab ${activeTab === 'understand' ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabClick('understand')}
          >
            🧠 Understand
          </button>
          <button 
            className={`tabs__tab ${activeTab === 'plan' ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabClick('plan')}
          >
            🗺️ Implementation Plan
          </button>
          <button 
            className={`tabs__tab ${activeTab === 'tests' ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabClick('tests')}
          >
            🧪 Test Suggestions
          </button>
          <button 
            className={`tabs__tab ${activeTab === 'pr' ? 'tabs__tab--active' : ''}`}
            onClick={() => handleTabClick('pr')}
          >
            📝 PR Generator
          </button>
        </div>

        {/* UNDERSTAND TAB */}
        {activeTab === 'understand' && (
          <div className="tabs__panel ai-content">
            <h3>Simplified Explanation</h3>
            <p>{explainData.simplified_explanation}</p>

            <h3>Required Skills</h3>
            <div className="skills-list">
              {explainData.required_skills.map((skill, i) => (
                <span key={i} className="tag tag--tech">{skill}</span>
              ))}
            </div>

            {Object.keys(explainData.jargon_explained || {}).length > 0 && (
              <>
                <h3>Jargon Dictionary</h3>
                <ul>
                  {Object.entries(explainData.jargon_explained).map(([term, explanation]) => (
                    <li key={term}>
                      <strong>{term}:</strong> {explanation}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {explainData.relevant_files?.length > 0 && (
              <>
                <h3>Where to look</h3>
                <div className="file-tree">
                  {explainData.relevant_files.map((file, i) => (
                    <div key={i} className="file-tree__item file-tree__item--highlighted">
                      📄 {file}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* PLAN TAB */}
        {activeTab === 'plan' && (
          <div className="tabs__panel ai-content">
            {loadingPlan ? (
              <div className="loading">
                <div className="loading__spinner" />
                <div className="loading__text">Drafting step-by-step plan...</div>
              </div>
            ) : planData ? (
              <>
                <h3>Approach</h3>
                <p>{planData.approach}</p>

                <h3>Step-by-Step Instructions</h3>
                <ol>
                  {planData.steps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <h3>Testing Approach</h3>
                <p>{planData.testing_approach}</p>

                <h3>PR Checklist</h3>
                <ul>
                  {planData.pr_checklist?.map((item, i) => (
                    <li key={i}>⬜ {item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Failed to load plan.</p>
            )}
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
          <div className="tabs__panel ai-content">
            {loadingTests ? (
              <div className="loading">
                <div className="loading__spinner" />
                <div className="loading__text">Designing test suites and examples with Gemma 4...</div>
              </div>
            ) : testsData ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Recommended Test Framework</h3>
                  {testsData.test_framework && (
                    <span className="tag tag--tech">{testsData.test_framework}</span>
                  )}
                </div>

                <h3>Recommended Test Cases</h3>
                {testsData.test_cases?.length > 0 ? (
                  <ul>
                    {testsData.test_cases.map((tc, i) => (
                      <li key={i}>🧪 {tc}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific test cases generated.</p>
                )}

                {testsData.example_code && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                      <h3>Example Test Code</h3>
                      <button 
                        className={`copy-btn ${copiedTest ? 'copy-btn--copied' : ''}`}
                        onClick={copyTestCode}
                      >
                        {copiedTest ? '✓ Copied!' : '📋 Copy Test Code'}
                      </button>
                    </div>
                    <pre style={{ marginTop: '0.75rem', whiteSpace: 'pre-wrap' }}>
                      <code>{testsData.example_code}</code>
                    </pre>
                  </>
                )}
              </>
            ) : (
              <p>Failed to generate test suggestions.</p>
            )}
          </div>
        )}

        {/* PR TAB */}
        {activeTab === 'pr' && (
          <div className="tabs__panel ai-content">
            {loadingPr ? (
              <div className="loading">
                <div className="loading__spinner" />
                <div className="loading__text">Writing PR description...</div>
              </div>
            ) : prData ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Generated Pull Request</h3>
                  <button 
                    className={`copy-btn ${copiedPr ? 'copy-btn--copied' : ''}`}
                    onClick={copyToClipboard}
                  >
                    {copiedPr ? '✓ Copied!' : '📋 Copy Markdown'}
                  </button>
                </div>
                
                <p><strong>Title:</strong> <code>{prData.title}</code></p>
                
                <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                  <code>{prData.body}</code>
                </pre>
              </>
            ) : (
              <p>Failed to generate PR.</p>
            )}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function IssuePage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="container issue-detail">
          <div className="loading animate-fade-in">
            <div className="loading__spinner" />
            <h2 className="loading__text">Loading issue guidance...</h2>
          </div>
        </div>
      }
    >
      <IssueContent params={params} />
    </Suspense>
  );
}
