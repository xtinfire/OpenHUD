export function ScoreBar({ state, config }) {
  if (!state) return null;
  const { map, round } = state;
  const isLive = round.phase === 'live';

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      height: 64, width: '100%', fontFamily: 'var(--font-label)',
      position: 'fixed', top: 0, left: 0,
    }}>
      <TeamScorePanel score={map.tScore} color={config.palette.t} align="left" />

      <div className="chamfer" style={{
        background: 'var(--bg-panel-alpha)', color: 'var(--text-primary)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minWidth: 140, padding: '0 20px',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>
          {map.name?.replace('de_', '').toUpperCase()}
        </div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: 'var(--text-muted)' }}>
          ROUND {map.round + 1}
        </div>
        <div className={`scan-line ${isLive ? 'live' : ''}`} style={{ marginTop: 4 }} />
      </div>

      <TeamScorePanel score={map.ctScore} color={config.palette.ct} align="right" />
    </div>
  );
}

function TeamScorePanel({ score, color, align }) {
  return (
    <div className="chamfer" style={{
      background: color, color: '#0a0c10', flex: 1,
      display: 'flex', alignItems: 'center',
      justifyContent: align === 'left' ? 'flex-end' : 'flex-start',
      padding: '0 24px', fontFamily: 'var(--font-display)',
      fontSize: 28, fontWeight: 700,
    }}>
      {score}
    </div>
  );
}