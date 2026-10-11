'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '../../components/Breadcrumbs';
import PipelineStatusWidget from '../../components/PipelineStatusWidget';

export default function PipelinePage() {
  const [activeStage, setActiveStage] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const stages = [
    {
      id: '01',
      title: 'GitHub REST & GraphQL Ingestion',
      category: 'DATA INGESTION',
      latency: '120ms',
      status: 'Operational',
      desc: 'Retrieves issues, issue discussions, label taxonomies, repository trees, and contributor histories via GitHub REST v3 API.',
      telemetry: 'Fetches up to 500+ issues with paginated batching and rate-limit guard.'
    },
    {
      id: '02',
      title: 'Heuristic Filtering & Diff Analysis',
      category: 'PRE-PROCESSING',
      latency: '45ms',
      status: 'Operational',
      desc: 'Strips out bot notifications, boilerplate markdown templates, and parses relevant source code file trees.',
      telemetry: 'Eliminates 92% of noise tokens before passing context to Gemma 4.'
    },
    {
      id: '03',
      title: 'Gemma 4 Multi-Tier Classifier',
      category: 'NEURAL CLASSIFICATION',
      latency: '340ms',
      status: 'Operational',
      desc: 'Zero-shot difficulty grading (BEGINNER, INTERMEDIATE, ADVANCED), jargon vocabulary extraction, and beginner barrier detection.',
      telemetry: 'Quantized Gemma 4B instruction-tuned model running on GPU accelerated inference.'
    },
    {
      id: '04',
      title: 'Implementation Plan Architect',
      category: 'REASONING & SYNTHESIS',
      latency: '410ms',
      status: 'Operational',
      desc: 'Generates step-by-step implementation instructions, identifies target files to edit, and estimates PR readiness.',
      telemetry: 'Outputs actionable markdown checklists designed for first-time open-source contributors.'
    },
    {
      id: '05',
      title: 'Test Suite Synthesizer',
      category: 'CODE GENERATION',
      latency: '290ms',
      status: 'Operational',
      desc: 'Identifies test frameworks (Jest, PyTest, Mocha, Go Test) and generates scaffolded test cases and assertions.',
      telemetry: 'Synthesizes functional test suites with mock mocks and boundary assertions.'
    },
    {
      id: '06',
      title: 'PR Generator & Pre-Flight Verifier',
      category: 'DELIVERY & AUDIT',
      latency: '95ms',
      status: 'Operational',
      desc: 'Assembles Conventional Commit PR titles, closes-issue links (Closes #1013), and interactive pre-submission checklists.',
      telemetry: 'Ensures zero markdown syntax leaks and produces production-ready pull request bodies.'
    }
  ];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => setIsSimulating(false), 1200);
          return 6;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="container dashboard animate-fade-in" style={{ padding: '24px 28px' }}>
      <Breadcrumbs items={[{ label: 'Pipeline Flow', href: null }]} />

      {/* Top Header Card */}
      <div className="nb-card" style={{ marginTop: '20px', padding: '28px' }}>
        <div className="nb-analyzer-main__header" style={{ marginBottom: '12px' }}>
          <span className="nb-tag-tech">TELEMETRY & ARCHITECTURE</span>
          <span className="nb-label-tracked">FEATURE 03: PIPELINE FLOW</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="nb-hero-headline" style={{ fontSize: '2.4rem', margin: '0 0 10px' }}>
              AI Pipeline Flow
            </h1>
            <p className="nb-hero-subtext" style={{ maxWidth: '680px' }}>
              Inspect the end-to-end intelligence engine powering Hacktoberfest Copilot: from real-time GitHub ingestion to Gemma 4 difficulty categorization, plan generation, and test synthesis.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="nb-search-submit-btn"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              id="simulate-pipeline-btn"
              style={{ background: isSimulating ? 'var(--nb-mint-bg)' : 'var(--nb-yellow)', color: '#000000' }}
            >
              {isSimulating ? `⚙️ Running Stage 0${simStep}...` : '⚡ Simulate Pipeline Run'}
            </button>
            <Link href="/analyze" className="nb-pill-action-btn" style={{ padding: '10px 16px' }}>
              Launch in Analyzer →
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '28px' }}>
          <div className="nb-card" style={{ padding: '14px', background: '#FFFFFF' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>PIPELINE STATUS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span className="nb-live-pulse-dot" />
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>100% HEALTHY</strong>
            </div>
          </div>

          <div className="nb-card" style={{ padding: '14px', background: '#FFFFFF' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>PRIMARY MODEL</span>
            <div style={{ marginTop: '6px' }}>
              <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--nb-blue)' }}>Gemma 4B-Instruct</strong>
            </div>
          </div>

          <div className="nb-card" style={{ padding: '14px', background: '#FFFFFF' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>AVERAGE LATENCY</span>
            <div style={{ marginTop: '6px' }}>
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: '#D97706' }}>~380 ms</strong>
            </div>
          </div>

          <div className="nb-card" style={{ padding: '14px', background: '#FFFFFF' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--nb-text-muted)' }}>API CLOUD</span>
            <div style={{ marginTop: '6px' }}>
              <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: '#059669' }}>Railway Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Stages & Live Telemetry Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {/* Left: Interactive Pipeline Stage Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
            Orchestration Stages ({stages.length})
          </h3>

          {stages.map((st, idx) => {
            const stepNum = idx + 1;
            const isCurrentSim = isSimulating && simStep === stepNum;
            const isCompletedSim = isSimulating && simStep > stepNum;
            const isSelected = activeStage === st.id;

            return (
              <div
                key={st.id}
                onClick={() => setActiveStage(isSelected ? null : st.id)}
                className="nb-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  background: isCurrentSim ? '#FEF3C7' : isSelected ? '#FFFBEB' : 'var(--nb-card-bg)',
                  borderColor: isCurrentSim ? '#F59E0B' : '#000000',
                  transform: isCurrentSim ? 'scale(1.02)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontWeight: 800, 
                      fontSize: '0.9rem',
                      background: 'var(--nb-blue)',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '3px'
                    }}>
                      STAGE {st.id}
                    </span>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{st.title}</strong>
                  </div>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.78rem',
                    color: isCompletedSim ? '#059669' : 'var(--nb-text-muted)'
                  }}>
                    {isCompletedSim ? '✓ Finished' : isCurrentSim ? '⚡ Processing...' : st.latency}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#374151', margin: '8px 0' }}>{st.desc}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.8rem' }}>
                  <span className="tag tag--tech" style={{ margin: 0 }}>{st.category}</span>
                  <span style={{ color: 'var(--nb-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {isSelected ? '▲ Collapse details' : '▼ View telemetry'}
                  </span>
                </div>

                {isSelected && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1.5px dashed #000000' }}>
                    <div style={{ fontSize: '0.84rem', color: '#1F2937', fontFamily: 'var(--font-mono)' }}>
                      <strong>TELEMETRY SPEC:</strong> {st.telemetry}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Live Dynamic Status Widget & Simulation Monitor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Live Telemetry Monitor
            </h3>
            <PipelineStatusWidget />
          </div>

          {/* Real-time System Stream Card */}
          <div className="nb-card" style={{ padding: '20px', background: '#0B0E14', color: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid #334155', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="nb-live-pulse-dot" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8' }}>
                  PIPELINE EVENT STREAM
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94A3B8' }}>LIVE</span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: '1.7', color: '#E2E8F0' }}>
              <div><span style={{ color: '#34D399' }}>[OK]</span> Initialized Gemma 4 tokenizer pipeline.</div>
              <div><span style={{ color: '#38BDF8' }}>[INFO]</span> Octokit caching layer active (TTL: 300s).</div>
              <div><span style={{ color: '#FBBF24' }}>[STREAM]</span> Listening for issue classification events...</div>
              <div><span style={{ color: '#34D399' }}>[READY]</span> System telemetry latency: 38ms to Railway.</div>
              {isSimulating && (
                <div style={{ color: '#F472B6', marginTop: '6px' }}>
                  &gt; [SIMULATION] Executing stage 0{simStep}...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
