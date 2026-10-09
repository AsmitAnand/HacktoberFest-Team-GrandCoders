import Link from 'next/link';

export default function NotFound() {
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
          border: '1px solid rgba(255, 122, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(255, 122, 0, 0.1)',
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }} aria-hidden="true">
          🎃🔍
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F1F5F9' }}>
          404 — Page Not Found
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '1rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          The page or repository route you are looking for does not exist or has moved.
        </p>

        <Link
          href="/"
          className="repo-input__btn"
          style={{ padding: '0.75rem 1.75rem', borderRadius: '0.5rem', display: 'inline-block', textDecoration: 'none' }}
          id="not-found-home-btn"
        >
          🚀 Explore Repositories
        </Link>
      </div>
    </div>
  );
}
