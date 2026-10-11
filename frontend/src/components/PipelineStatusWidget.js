'use client';

export default function PipelineStatusWidget() {
  return (
    <div className="nb-card nb-pipeline-status" id="pipeline-flow">
      <div className="nb-card__header-row">
        <h3 className="nb-card__title">Pipeline Status</h3>
        <span className="nb-status-pill nb-status-pill--active">Online ●</span>
      </div>

      <div className="nb-pipeline-status__grid">
        {/* 1. Bar Chart */}
        <div className="nb-bar-chart" title="AI Verification & Roadmap Confidence">
          <div className="nb-bar nb-bar--blue" style={{ height: '38px' }} />
          <div className="nb-bar nb-bar--red" style={{ height: '64px' }} />
          <div className="nb-bar nb-bar--yellow" style={{ height: '48px' }} />
          <div className="nb-bar nb-bar--blue" style={{ height: '56px' }} />
        </div>

        {/* 2. Dot Matrix Telemetry Grid */}
        <div className="nb-dot-matrix" title="CI Matrix Tests (All Passing)">
          <div className="nb-dot-col">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="nb-dot nb-dot--black" />
            ))}
          </div>
          <div className="nb-dot-col">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="nb-dot nb-dot--black" />
            ))}
          </div>
          <div className="nb-dot-col">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="nb-dot nb-dot--blue" />
            ))}
          </div>
          <div className="nb-dot-col">
            {[...Array(8)].map((_, i) => (
              <span key={i} className={`nb-dot ${i < 5 ? 'nb-dot--blue' : 'nb-dot--black'}`} />
            ))}
          </div>
        </div>

        {/* 3. Layered Bauhaus Geometric Triangles */}
        <div className="nb-triangles" title="Gemma 4 Multi-Tier Analysis Triangulation">
          <svg width="125" height="72" viewBox="0 0 120 70" fill="none">
            {/* Blue Triangle */}
            <polygon
              points="15,65 50,10 85,65"
              fill="#0E43B9"
              fillOpacity="0.85"
              stroke="#000000"
              strokeWidth="2.5"
            />
            {/* Red Triangle */}
            <polygon
              points="35,65 68,16 100,65"
              fill="#FF5436"
              fillOpacity="0.8"
              stroke="#000000"
              strokeWidth="2.5"
            />
            {/* Yellow Triangle */}
            <polygon
              points="60,65 92,8 118,65"
              fill="#FFC72C"
              stroke="#000000"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
