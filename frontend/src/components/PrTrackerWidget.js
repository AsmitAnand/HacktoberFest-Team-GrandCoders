'use client';

import { useState } from 'react';

export default function PrTrackerWidget({ onOpenPrModal }) {
  const [prsMerged] = useState(2);
  const [prsTarget] = useState(4);

  // Calculate gauge dasharray
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = prsMerged / prsTarget;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="nb-card nb-pr-tracker" id="pr-tracker">
      <div className="nb-card__header-row">
        <h3 className="nb-card__title">PR Tracker</h3>
        {onOpenPrModal && (
          <button 
            type="button" 
            className="nb-pill-action-btn"
            onClick={onOpenPrModal}
            title="Open Interactive PR Checklist"
          >
            Checklist ↗
          </button>
        )}
      </div>

      <div className="nb-pr-tracker__content">
        {/* Donut Gauge Chart */}
        <div className="nb-pr-tracker__gauge">
          <svg width="105" height="105" viewBox="0 0 100 100" className="nb-gauge-svg">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#0E43B9"
              strokeWidth="14"
            />
            {/* Active completed segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#FFC72C"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              transform="rotate(-90 50 50)"
            />
            {/* Inner & Outer Black Outlines for Neo-Brutalist Border Look */}
            <circle
              cx="50"
              cy="50"
              r={radius + 7}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r={radius - 7}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
            />
          </svg>
          <div className="nb-gauge-center">
            <span className="nb-gauge-count">{prsMerged} / {prsTarget}</span>
            <span className="nb-gauge-label">PRs</span>
          </div>
        </div>

        {/* Logs Feed */}
        <div className="nb-pr-tracker__logs">
          <div className="nb-logs-title">Logs:</div>
          <div className="nb-log-entry nb-log-entry--merged">
            <span className="nb-log-dot" />
            <span className="nb-log-text"><strong>PR-1024:</strong> Merged</span>
          </div>
          <div className="nb-log-entry nb-log-entry--review">
            <span className="nb-log-dot" />
            <span className="nb-log-text"><strong>PR-1025:</strong> In Review</span>
          </div>
          <div className="nb-log-entry nb-log-entry--pending">
            <span className="nb-log-dot" />
            <span className="nb-log-text"><strong>PR-1026:</strong> Drafted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
