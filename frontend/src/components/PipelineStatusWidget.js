'use client';

export default function PipelineStatusWidget() {
  return (
    <div className="nb-card nb-pipeline-status" id="pipeline-flow">
      <div className="nb-card__header-row">
        <h3 className="nb-card__title">Pipeline Status</h3>
        <span className="nb-status-pill nb-status-pill--active">
          <span className="nb-live-pulse-dot" /> Live
        </span>
      </div>

      <div className="nb-pipeline-status__grid">
        {/* 1. Dynamic Moving Equalizer Bar Chart */}
        <div className="nb-pipeline-card">
          <div className="nb-pipeline-card__header">
            <span className="nb-pipeline-card__label">INFERENCE STREAM</span>
            <span className="nb-pipeline-card__val">98.4%</span>
          </div>
          <div className="nb-bar-chart" title="Live Telemetry: Continuous AI Confidence">
            <div className="nb-bar nb-bar--blue nb-bar--motion-1" />
            <div className="nb-bar nb-bar--red nb-bar--motion-2" />
            <div className="nb-bar nb-bar--yellow nb-bar--motion-3" />
            <div className="nb-bar nb-bar--blue nb-bar--motion-4" />
          </div>
          <div className="nb-pipeline-card__desc">42 t/s • Gemma 4B</div>
        </div>

        {/* 2. Dynamic Wave Dot Matrix Telemetry Grid */}
        <div className="nb-pipeline-card">
          <div className="nb-pipeline-card__header">
            <span className="nb-pipeline-card__label">CI TEST MATRIX</span>
            <span className="nb-pipeline-card__val">32/32</span>
          </div>
          <div className="nb-dot-matrix" title="Continuous CI Matrix Signal">
            {[0, 1, 2, 3].map((colIdx) => (
              <div key={colIdx} className="nb-dot-col">
                {[...Array(8)].map((_, dotIdx) => {
                  const delay = (colIdx * 0.15 + dotIdx * 0.08).toFixed(2);
                  const isBlue = colIdx >= 2 && dotIdx < 5;
                  return (
                    <span
                      key={dotIdx}
                      className={`nb-dot nb-dot--motion ${isBlue ? 'nb-dot--blue' : 'nb-dot--black'}`}
                      style={{ animationDelay: `${delay}s` }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="nb-pipeline-card__desc">100% Tests Pass</div>
        </div>

        {/* 3. Floating Bauhaus Geometric Triangles */}
        <div className="nb-pipeline-card">
          <div className="nb-pipeline-card__header">
            <span className="nb-pipeline-card__label">DIFFICULTY AST</span>
            <span className="nb-pipeline-card__val">Level 1</span>
          </div>
          <div className="nb-triangles" title="Gemma 4 Multi-Tier Analysis Triangulation">
            <svg width="105" height="60" viewBox="0 0 120 70" fill="none" className="nb-triangles-svg">
              {/* Blue Triangle with Float */}
              <polygon
                className="nb-tri nb-tri--blue"
                points="15,65 50,10 85,65"
                fill="#0E43B9"
                fillOpacity="0.85"
                stroke="#000000"
                strokeWidth="2.5"
              />
              {/* Red Triangle with Float */}
              <polygon
                className="nb-tri nb-tri--red"
                points="35,65 68,16 100,65"
                fill="#FF5436"
                fillOpacity="0.8"
                stroke="#000000"
                strokeWidth="2.5"
              />
              {/* Yellow Triangle with Float */}
              <polygon
                className="nb-tri nb-tri--yellow"
                points="60,65 92,8 118,65"
                fill="#FFC72C"
                stroke="#000000"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <div className="nb-pipeline-card__desc">Beginner AST</div>
        </div>
      </div>

      {/* System Telemetry Footer Information */}
      <div className="nb-pipeline-footer">
        <div className="nb-pipeline-footer__stat">
          <span className="nb-live-pulse-dot" />
          <span><strong>Engine:</strong> Gemma 4B-Instruct</span>
        </div>
        <div className="nb-pipeline-footer__stat">
          <span>⏱️ <strong>Latency:</strong> 380ms</span>
        </div>
        <div className="nb-pipeline-footer__stat">
          <span>☁️ <strong>Backend:</strong> Railway Active</span>
        </div>
      </div>
    </div>
  );
}
