'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    setIsLoading(true);
    // Encode the URL so it can be passed safely as a query parameter
    router.push(`/analyze?url=${encodeURIComponent(repoUrl)}`);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          Powered by Gemma 4 & GitHub API
        </div>

        <h1 className="hero__title">
          Open-Source Contribution,{' '}
          <span className="hero__title-gradient">Simplified.</span>
        </h1>

        <p className="hero__subtitle">
          Don't know where to start? Hacktoberfest Copilot analyzes any repository,
          finds beginner-friendly issues, and generates a step-by-step plan to
          help you create your first pull request.
        </p>

        {/* Repo Input */}
        <form className="repo-input" onSubmit={handleSubmit}>
          <div className="repo-input__wrapper">
            <span className="repo-input__icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="url"
              className="repo-input__field"
              placeholder="Paste a GitHub repository URL (e.g., https://github.com/owner/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              id="repo-url-input"
            />
            <button
              type="submit"
              className={`repo-input__btn ${isLoading ? 'repo-input__btn--loading' : ''}`}
              disabled={isLoading || !repoUrl}
              id="analyze-btn"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Repo'}
            </button>
          </div>
        </form>
      </section>

      {/* Features Grid */}
      <section className="features" id="features">
        <h2 className="features__title">Your Open-Source Mentor</h2>
        <p className="features__subtitle">
          Everything you need to confidently make your first contribution.
        </p>

        <div className="features__grid stagger-children">
          <div className="feature-card animate-fade-in-up">
            <span className="feature-card__icon" aria-hidden="true">🎯</span>
            <h3 className="feature-card__title">Issue Discovery</h3>
            <p className="feature-card__desc">
              We automatically scan repositories to find issues specifically labeled
              for beginners, saving you hours of searching.
            </p>
          </div>

          <div className="feature-card animate-fade-in-up">
            <span className="feature-card__icon" aria-hidden="true">🧠</span>
            <h3 className="feature-card__title">Plain-English Explanations</h3>
            <p className="feature-card__desc">
              Gemma 4 translates complex technical jargon into simple,
              easy-to-understand explanations of what needs to be done.
            </p>
          </div>

          <div className="feature-card animate-fade-in-up">
            <span className="feature-card__icon" aria-hidden="true">🗺️</span>
            <h3 className="feature-card__title">Step-by-Step Plans</h3>
            <p className="feature-card__desc">
              Get a detailed implementation plan that tells you exactly which
              files to modify and what changes to make.
            </p>
          </div>

          <div className="feature-card animate-fade-in-up">
            <span className="feature-card__icon" aria-hidden="true">📝</span>
            <h3 className="feature-card__title">PR Generation</h3>
            <p className="feature-card__desc">
              Generate a professional pull request description automatically,
              so your contribution looks polished and ready to merge.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="steps-section" id="how-it-works">
        <h2 className="steps-section__title">How It Works</h2>

        <div className="steps stagger-children">
          <div className="step animate-slide-in-right">
            <div className="step__number">1</div>
            <div className="step__content">
              <h3 className="step__title">Find a Repository</h3>
              <p className="step__desc">
                Paste the URL of any public GitHub repository you'd like to
                contribute to.
              </p>
            </div>
          </div>

          <div className="step animate-slide-in-right">
            <div className="step__number">2</div>
            <div className="step__content">
              <h3 className="step__title">Pick an Issue</h3>
              <p className="step__desc">
                Browse through beginner-friendly issues curated by our AI based on
                your skill level.
              </p>
            </div>
          </div>

          <div className="step animate-slide-in-right">
            <div className="step__number">3</div>
            <div className="step__content">
              <h3 className="step__title">Follow the Plan</h3>
              <p className="step__desc">
                Read the AI-generated implementation plan, fork the repo, and make
                your code changes.
              </p>
            </div>
          </div>

          <div className="step animate-slide-in-right">
            <div className="step__number">4</div>
            <div className="step__content">
              <h3 className="step__title">Submit your PR</h3>
              <p className="step__desc">
                Use our generated PR description to submit your work and celebrate
                your Hacktoberfest contribution! 🎉
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
