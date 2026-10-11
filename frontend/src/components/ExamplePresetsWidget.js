'use client';

export default function ExamplePresetsWidget({ onSelectPreset }) {
  const presets = [
    {
      id: 'cli-tool',
      theme: 'blue',
      topDot: '#FFC72C',
      icon: '>_',
      label: 'awesome-corp/cli-tool',
      realRepo: 'https://github.com/fastapi/fastapi',
      description: 'Python High-Performance API Framework',
    },
    {
      id: 'ui-components',
      theme: 'yellow',
      topDot: '#FF5436',
      icon: '📐',
      label: 'acme-labs/ui-components',
      realRepo: 'https://github.com/adithyan-css/Brownie-Bliss',
      description: 'Hacktoberfest 569 Issues Bakery UI',
    },
    {
      id: 'core-api',
      theme: 'red',
      topDot: '#FFFFFF',
      icon: '⚡',
      label: 'open-devkit/core-api',
      realRepo: 'https://github.com/vercel/next.js',
      description: 'React Production Framework',
    },
  ];

  return (
    <div className="nb-card nb-example-presets">
      <div className="nb-card__header-row">
        <h3 className="nb-card__title">Example Presets</h3>
        <div className="nb-header-dots">
          <span className="nb-mini-box nb-mini-box--blue" />
          <span className="nb-mini-box nb-mini-box--yellow" />
          <span className="nb-mini-box nb-mini-box--red" />
        </div>
      </div>

      <div className="nb-presets-grid">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`nb-preset-card nb-preset-card--${preset.theme}`}
            onClick={() => onSelectPreset?.(preset.realRepo)}
            title={`Analyze ${preset.label} (${preset.description})`}
          >
            <div className="nb-preset-card__top">
              <span 
                className="nb-preset-dot" 
                style={{ backgroundColor: preset.topDot }} 
              />
              <div className="nb-preset-icon-circle">
                <span>{preset.icon}</span>
              </div>
            </div>
            <div className="nb-preset-card__footer">
              <span className="nb-preset-label">{preset.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
