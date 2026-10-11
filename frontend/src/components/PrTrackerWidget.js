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
            {/* Active completed segment with continuous breathe motion */}
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
              className="nb-gauge-progress-ring"
              transform="rotate(-90 50 50)"
            />
            {/* Dynamic rotating energy marker on the gauge */}
            <circle
              cx="50"
              cy="12"
              r="3.5"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="1.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="180 50 50"
                dur="4s"
                repeatCount="indefinite"
                additive="sum"
              />
            </circle>
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

        {/* Logs Feed with Explicit Done / Remaining Breakdown */}
        <div className="nb-pr-tracker__logs">
          <div className="nb-logs-title-row">
            <span className="nb-logs-title">Challenge Status:</span>
            <span className="nb-logs-badge">2 Merged / 2 To Go</span>
          </div>

          {/* 1. Done: PR #1024 */}
          <div className="nb-log-entry nb-log-entry--merged" title="Brownie-Bliss #1024: resolve hotlinked product images and footer links">
            <span className="nb-log-dot nb-log-dot--merged" />
            <span className="nb-log-text">
              <strong>#1024:</strong> Merged <span className="nb-log-repo">(Brownie-Bliss)</span>
            </span>
          </div>

          {/* 2. Done: PR #1018 */}
          <div className="nb-log-entry nb-log-entry--merged" title="Brownie-Bliss #1018: cart coupon discount logic">
            <span className="nb-log-dot nb-log-dot--merged" />
            <span className="nb-log-text">
              <strong>#1018:</strong> Merged <span className="nb-log-repo">(Brownie-Bliss)</span>
            </span>
          </div>

          {/* 3. In Progress: PR #1025 */}
          <div className="nb-log-entry nb-log-entry--review" title="Brownie-Bliss #1025: checkout rounding discrepancy">
            <span className="nb-log-dot nb-log-dot--review" />
            <span className="nb-log-text">
              <strong>#1025:</strong> In Review <span className="nb-log-repo">(Brownie-Bliss)</span>
            </span>
          </div>

          {/* 4. In Progress: PR #1026 */}
          <div className="nb-log-entry nb-log-entry--pending" title="FastAPI #1026: async test override documentation">
            <span className="nb-log-dot nb-log-dot--pending" />
            <span className="nb-log-text">
              <strong>#1026:</strong> Drafted <span className="nb-log-repo">(FastAPI)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
