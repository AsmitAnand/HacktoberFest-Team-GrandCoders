'use client';

export default function RoadmapSubway() {
  const steps = [
    { num: '01', title: 'Pick Issue', desc: 'Scan beginner-friendly opportunities', cx: 80, cy: 95 },
    { num: '02', title: 'Gemma 4 Plan', desc: 'Step-by-step code guidance & files', cx: 180, cy: 40 },
    { num: '03', title: 'Tests & Code', desc: 'Run scaffolding & verify tests', cx: 280, cy: 95 },
    { num: '04', title: 'Submit PR', desc: '1-click markdown description & PR', cx: 380, cy: 40 },
  ];

  return (
    <div className="nb-roadmap-wrapper">
      <div className="nb-roadmap-header">
        <h4 className="nb-roadmap-title">Contribution Roadmap</h4>
        <span className="nb-roadmap-badge">AI Accelerated Flow</span>
      </div>

      <div className="nb-roadmap-track-container">
        {/* Subway transit line visual */}
        <svg 
          viewBox="0 0 460 140" 
          className="nb-roadmap-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Abstract Bauhaus Yellow Card */}
          <rect x="15" y="45" width="45" height="70" fill="#FFC72C" stroke="#000000" strokeWidth="2.5" />
          <path d="M35 55 Q45 80 25 105" stroke="#000000" strokeWidth="2.5" fill="none" />

          {/* Base Yellow Track Path */}
          <path
            d="M50 95 H180 V40 H280 V95 H380 V40 H440"
            stroke="#FFC72C"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Dynamic Laser Beam Stream */}
          <path
            d="M50 95 H180 V40 H280 V95 H380 V40 H440"
            stroke="#FF5436"
            strokeWidth="4"
            strokeDasharray="12 12"
            strokeLinecap="round"
            fill="none"
            className="nb-track-laser"
          />

          {/* Animated Traveling Subway Train / Energy Bead */}
          <g>
            <circle r="7" fill="#1047BF" stroke="#FFFFFF" strokeWidth="2.5">
              <animateMotion
                path="M50 95 H180 V40 H280 V95 H380 V40 H440"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3.5" fill="#FFC72C">
              <animateMotion
                path="M50 95 H180 V40 H280 V95 H380 V40 H440"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Station Nodes */}
          {steps.map((st) => (
            <g key={st.num} className="nb-station-node">
              {/* Outer Pulsing Halo */}
              <circle
                cx={st.cx}
                cy={st.cy}
                r="18"
                fill="none"
                stroke="#FF5436"
                strokeWidth="1.5"
                className="nb-station-pulse-ring"
              />
              {/* Outer Station Circle */}
              <circle
                cx={st.cx}
                cy={st.cy}
                r="14"
                fill="#FFFDF9"
                stroke="#000000"
                strokeWidth="3"
              />
              {/* Center Dot */}
              <circle
                cx={st.cx}
                cy={st.cy}
                r="6"
                fill="#FF5436"
                stroke="#000000"
                strokeWidth="1.5"
              />
              {/* Label */}
              <text
                x={st.cx}
                y={st.cy > 70 ? st.cy + 30 : st.cy - 20}
                textAnchor="middle"
                className="nb-station-text"
              >
                {st.num}. {st.title}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
