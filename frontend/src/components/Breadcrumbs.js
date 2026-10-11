'use client';

import Link from 'next/link';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="nb-breadcrumbs" aria-label="Breadcrumb">
      <ol className="nb-breadcrumbs__list">
        <li className="nb-breadcrumbs__item">
          <Link href="/" className="nb-breadcrumbs__link">
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="nb-breadcrumbs__item">
              <span className="nb-breadcrumbs__sep">/</span>
              {isLast || !item.href ? (
                <span className="nb-breadcrumbs__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="nb-breadcrumbs__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
