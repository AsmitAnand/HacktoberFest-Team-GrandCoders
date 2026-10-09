'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="card animate-fade-in"
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem',
          borderRadius: '1rem',
          background: 'rgba(26, 27, 38, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }}
          aria-hidden="true"
        >
          ⚠️
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#F87171' }}>
          Something went wrong
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {error?.message || 'An unexpected error occurred while processing your request. Please try again.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            className="repo-input__btn"
            style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
            id="error-retry-btn"
          >
            🔄 Try Again
          </button>

          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F1F5F9',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
            }}
            id="error-home-btn"
          >
            🏠 Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
