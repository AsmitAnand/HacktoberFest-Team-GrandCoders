'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import PrChecklistModal from '../../components/PrChecklistModal';

export default function TrackerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklist, setChecklist] = useState({
    closesIssue: true,
    testsPass: true,
    conventionalCommit: true,
    cleanDiff: false,
    syncedBranch: true
  });

  const prLogs = [
    {
      id: 'PR-1024',
      repo: 'adithyan-css/Brownie-Bliss',
      title: 'fix(homepage): resolve hotlinked images and dead footer links',
      status: 'MERGED',
      date: 'Oct 08, 2026',
      badgeClass: 'tag--beginner',
      bgPill: '#D1FAE5',
      colorPill: '#065F46'
    },
    {
      id: 'PR-1025',
      repo: 'adithyan-css/Brownie-Bliss',
      title: 'fix(cart): eliminate off-by-one rounding discrepancy on checkout',
      status: 'IN REVIEW',
      date: 'Oct 10, 2026',
      badgeClass: 'tag--intermediate',
      bgPill: '#FEF3C7',
      colorPill: '#92400E'
    },
    {
      id: 'PR-1026',
      repo: 'fastapi/fastapi',
      title: 'docs(api): update dependency override examples in async client',
      status: 'DRAFTED',
      date: 'Oct 11, 2026',
      badgeClass: 'tag--advanced',
      bgPill: '#EFF6FF',
      colorPill: '#1E40AF'
    },
    {
      id: 'PR-1027',
      repo: 'vercel/next.js',
      title: 'docs(middleware): clarify cookie header propagation',
      status: 'PLANNED',
      date: 'Queued',
      badgeClass: 'tag--tech',
      bgPill: '#F3F4F6',
      colorPill: '#4B5563'
    }
  ];

  const milestones = [
    { title: 'First Splash', requirement: '1 PR Merged', icon: '🥉', unlocked: true, desc: 'Made your first open-source contribution.' },
    { title: 'Halfway Hero', requirement: '2 PRs Merged', icon: '🥈', unlocked: true, desc: '50% toward completing the challenge!' },
    { title: 'Hat Trick', requirement: '3 PRs Merged', icon: '🥇', unlocked: false, desc: 'Only one more pull request to go.' },
    { title: 'Hacktoberfest 2026 Champ', requirement: '4 PRs Merged', icon: '🏆', unlocked: false, desc: 'Complete the official 4-PR challenge.' }
  ];

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = 2 / 4;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="container dashboard animate-fade-in" style={{ padding: '24px 28px' }}>
      <Breadcrumbs items={[{ label: 'PR Tracker', href: null }]} />

      {/* Top Header Card */}
      <div className="nb-card" style={{ marginTop: '20px', padding: '28px' }}>
        <div className="nb-analyzer-main__header" style={{ marginBottom: '12px' }}>
          <span className="nb-tag-tech">CHALLENGE DASHBOARD</span>
          <span className="nb-label-tracked">FEATURE 05: PR TRACKER</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="nb-hero-headline" style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>
              Hacktoberfest PR Tracker
            </h1>
            <p className="nb-hero-subtext" style={{ maxWidth: '680px' }}>
              Track all pull requests toward the official 4-PR milestone. Verify pre-submission standards with Gemma 4, log your contributions, and inspect achievement badges.
            </p>
          </div>

          <button
            type="button"
            className="nb-search-submit-btn"
            onClick={() => setIsModalOpen(true)}
            id="open-pr-checklist-modal-btn"
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            🚀 Launch Pre-Flight Checklist
          </button>
        </div>

        {/* Hero Progress Gauge Card */}
        <div 
          className="nb-card" 
          style={{ 
            marginTop: '28px', 
            padding: '24px', 
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Donut Gauge with Motion */}
            <div style={{ position: 'relative', width: '115px', height: '115px' }}>
              <svg width="115" height="115" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="#0E43B9" strokeWidth="16" />
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  fill="none"
                  stroke="#FFC72C"
                  strokeWidth="16"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="nb-gauge-progress-ring"
                  transform="rotate(-90 55 55)"
                />
                <circle cx="55" cy="55" r={radius + 8} fill="none" stroke="#000000" strokeWidth="2.5" />
                <circle cx="55" cy="55" r={radius - 8} fill="none" stroke="#000000" strokeWidth="2.5" />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800
              }}>
                <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>2 / 4</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--nb-text-muted)' }}>MERGED</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="nb-live-pulse-dot" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                  50% MILESTONE REACHED
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: '6px 0' }}>
                2 Merged, 1 In Review, 1 Drafted
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--nb-text-muted)', margin: 0 }}>
                You need 2 more merged pull requests to unlock the Hacktoberfest Champion tier.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div className="nb-card" style={{ padding: '12px 18px', background: 'var(--nb-card-alt)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>TOTAL PRS</span>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>3 Submitted</div>
            </div>
            <div className="nb-card" style={{ padding: '12px 18px', background: 'var(--nb-card-alt)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>DAYS REMAINING</span>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--nb-red)' }}>20 Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: PR Logs & Pre-Flight Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Left: PR Contribution Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
            Tracked Pull Requests ({prLogs.length})
          </h3>

          {prLogs.map((pr) => (
            <div
              key={pr.id}
              className="nb-card"
              style={{
                padding: '20px',
                background: 'var(--nb-card-bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem' }}>
                  {pr.id} • {pr.repo}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1.5px solid #000000',
                    background: pr.bgPill,
                    color: pr.colorPill
                  }}
                >
                  {pr.status}
                </span>
              </div>

              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#000000' }}>
                {pr.title}
              </strong>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.8rem', color: 'var(--nb-text-muted)' }}>
                <span>Date: {pr.date}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--nb-blue)', fontWeight: 600 }}>
                  Verified by Copilot ✓
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Quality Checklist & Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pre-Submission Quality Checklist */}
          <div className="nb-card" style={{ padding: '22px', background: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              Quality Standards Checklist
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--nb-text-muted)', marginBottom: '16px' }}>
              Ensure every pull request complies with Hacktoberfest rules before maintainer review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { key: 'closesIssue', label: 'Reference issue number in description (e.g. Closes #1013)' },
                { key: 'testsPass', label: 'Unit and integration tests passing locally without regressions' },
                { key: 'conventionalCommit', label: 'Conventional Commit message formatted (fix:, feat:, docs:)' },
                { key: 'cleanDiff', label: 'No temporary files, console logs, or stray inline styles' },
                { key: 'syncedBranch', label: 'Branch rebased and synchronized with upstream main branch' }
              ].map((item) => (
                <label
                  key={item.key}
                  onClick={() => toggleChecklist(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: checklist[item.key] ? '#F0FDF4' : 'var(--nb-card-alt)',
                    border: '1.5px solid #000000',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key]}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--nb-blue)', cursor: 'pointer' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Achievement Milestones */}
          <div className="nb-card" style={{ padding: '22px', background: '#FFFFFF' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
              Achievement Milestones
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {milestones.map((m) => (
                <div
                  key={m.title}
                  className="nb-card"
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    background: m.unlocked ? '#FEF3C7' : '#F9FAFB',
                    borderColor: m.unlocked ? '#000000' : '#D1D5DB',
                    opacity: m.unlocked ? 1 : 0.65
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{m.icon}</div>
                  <strong style={{ fontSize: '0.88rem', display: 'block', fontFamily: 'var(--font-display)' }}>
                    {m.title}
                  </strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--nb-text-muted)', display: 'block', marginTop: '2px' }}>
                    {m.requirement}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: m.unlocked ? '#065F46' : '#6B7280'
                    }}
                  >
                    {m.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <PrChecklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prData={{
          title: 'fix(homepage): resolve hotlinked images and dead footer links',
          body: '## Description\nFixes issue #1013 by ensuring asset integrity and cleaning unclosed style tags.\n\nCloses #1013'
        }}
        issueNumber="1013"
        repoUrl="https://github.com/adithyan-css/Brownie-Bliss"
      />
    </div>
  );
}
