import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="nb-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '2.5rem',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }} aria-hidden="true">
          🎃 404
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Page Not Found
        </h1>

        <p style={{ color: 'var(--nb-text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          The repository route or guidance roadmap you are looking for does not exist or has been relocated.
        </p>

        <Link
          href="/"
          className="nb-search-submit-btn"
          style={{ display: 'inline-block', padding: '10px 24px', textDecoration: 'none' }}
          id="not-found-home-btn"
        >
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
