'use client';

import { useState, useEffect } from 'react';

export default function PrChecklistModal({ isOpen, onClose, prData, issueNumber, repoUrl }) {
  const [checklist, setChecklist] = useState({
    branch: false,
    commits: false,
    tests: false,
    closesKeyword: false,
    cleanCode: false,
  });
  const [previewTab, setPreviewTab] = useState('rendered'); // 'rendered' | 'raw'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Extract owner and repo from URL (e.g. https://github.com/facebook/react)
  let repoPath = '';
  try {
    const parsed = new URL(repoUrl.startsWith('http') ? repoUrl : `https://github.com/${repoUrl}`);
    repoPath = parsed.pathname.replace(/^\/|\/$/g, '');
  } catch {
    repoPath = repoUrl;
  }

  const githubPrUrl = `https://github.com/${repoPath}/compare/main...feat/issue-${issueNumber}?expand=1&title=${encodeURIComponent(
    prData?.title || `feat: resolve issue #${issueNumber}`
  )}&body=${encodeURIComponent(prData?.body || '')}`;

  const copyMarkdown = () => {
    if (prData?.body) {
      navigator.clipboard.writeText(prData.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-header__title-group">
            <span className="modal-header__icon">🚀</span>
            <div>
              <h2 id="modal-title" className="modal-header__title">
                Pre-Submission PR Checklist & Preview
              </h2>
              <p className="modal-header__subtitle">
                Verify open-source contribution readiness before submitting to GitHub
              </p>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Checklist & Progress Section */}
          <div className="checklist-section">
            <div className="progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-bar-title">PR Readiness Score</span>
                <span className="progress-bar-value">{progressPercent}% ({completedCount}/{totalCount} Completed)</span>
              </div>
              <div className="progress-track">
                <div 
                  className={`progress-fill ${progressPercent === 100 ? 'progress-fill--complete' : ''}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {progressPercent === 100 && (
              <div className="celebration-banner animate-fade-in">
                <span>🎉</span>
                <span><strong>All checks passed!</strong> Your pull request is ready for maintainer review.</span>
              </div>
            )}

            <div className="checklist-items">
              <label className={`checklist-item ${checklist.branch ? 'checklist-item--checked' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={checklist.branch} 
                  onChange={() => toggleItem('branch')} 
                />
                <span className="checklist-item__text">
                  <strong>Dedicated branch:</strong> Created from the latest <code>main</code> (e.g. <code>feat/issue-{issueNumber}</code>)
                </span>
              </label>

              <label className={`checklist-item ${checklist.commits ? 'checklist-item--checked' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={checklist.commits} 
                  onChange={() => toggleItem('commits')} 
                />
                <span className="checklist-item__text">
                  <strong>Conventional Commits:</strong> Clear commit messages with issue tag (e.g. <code>feat: ... (#{issueNumber})</code>)
                </span>
              </label>

              <label className={`checklist-item ${checklist.tests ? 'checklist-item--checked' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={checklist.tests} 
                  onChange={() => toggleItem('tests')} 
                />
                <span className="checklist-item__text">
                  <strong>Local verification:</strong> Unit tests, lint checks, and local build passed green ✅
                </span>
              </label>

              <label className={`checklist-item ${checklist.closesKeyword ? 'checklist-item--checked' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={checklist.closesKeyword} 
                  onChange={() => toggleItem('closesKeyword')} 
                />
                <span className="checklist-item__text">
                  <strong>Issue reference:</strong> Includes <code>Closes #{issueNumber}</code> in PR body for auto-closing
                </span>
              </label>

              <label className={`checklist-item ${checklist.cleanCode ? 'checklist-item--checked' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={checklist.cleanCode} 
                  onChange={() => toggleItem('cleanCode')} 
                />
                <span className="checklist-item__text">
                  <strong>Clean diff:</strong> Removed temporary debug statements, console logs, and unnecessary comments
                </span>
              </label>
            </div>
          </div>

          {/* PR Live Preview Section */}
          <div className="pr-preview-section">
            <div className="pr-preview-header">
              <div className="pr-preview-tabs">
                <button
                  className={`pr-preview-tab ${previewTab === 'rendered' ? 'pr-preview-tab--active' : ''}`}
                  onClick={() => setPreviewTab('rendered')}
                >
                  👁️ Formatted Preview
                </button>
                <button
                  className={`pr-preview-tab ${previewTab === 'raw' ? 'pr-preview-tab--active' : ''}`}
                  onClick={() => setPreviewTab('raw')}
                >
                  📝 Raw Markdown
                </button>
              </div>

              <button 
                className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                onClick={copyMarkdown}
              >
                {copied ? '✓ Copied!' : '📋 Copy Markdown'}
              </button>
            </div>

            <div className="pr-preview-content">
              <div className="pr-preview-title">
                <strong>PR Title:</strong> <code>{prData?.title || `feat: solve issue #${issueNumber}`}</code>
              </div>

              {previewTab === 'raw' ? (
                <pre className="pr-preview-raw">
                  <code>{prData?.body || 'No description generated yet.'}</code>
                </pre>
              ) : (
                <div className="pr-preview-rendered">
                  {prData?.body ? (
                    <div className="markdown-rendered">
                      {prData.body.split('\n').map((line, idx) => {
                        if (line.startsWith('## ')) {
                          return <h3 key={idx} className="preview-h3">{line.replace('## ', '')}</h3>;
                        } else if (line.startsWith('### ')) {
                          return <h4 key={idx} className="preview-h4">{line.replace('### ', '')}</h4>;
                        } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
                          const isDone = line.startsWith('- [x] ');
                          const content = line.replace(/- \[[ x]\] /, '');
                          return (
                            <div key={idx} className="preview-checklist-line">
                              <span>{isDone ? '☑️' : '◻️'}</span> {content}
                            </div>
                          );
                        } else if (line.startsWith('- ')) {
                          return <li key={idx} className="preview-li">{line.replace('- ', '')}</li>;
                        } else if (line.trim() === '') {
                          return <div key={idx} style={{ height: '0.5rem' }} />;
                        }
                        return <p key={idx} className="preview-p">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="preview-empty">No PR body generated.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>
            Close
          </button>
          <a
            href={githubPrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-btn modal-btn--primary"
            id="open-github-pr-btn"
          >
            🚀 Open Pull Request on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
