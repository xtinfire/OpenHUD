// overlays/hud/src/components/ScoreBar.jsx — TAM HALİ
export function ScoreBar({ state, config }) {
  if (!state) return null;
  const { map, round, bombTimer } = state;

  const isPlanted = bombTimer?.state === 'planted';
  const isDefusing = bombTimer?.state === 'defusing';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%',
      fontFamily: 'var(--font-label)',
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch', height: 58 }}>
        <TeamScorePanel
          teamName={config.teamAName}
          score={map.tScore}
          color={config.palette.t}
          align="left"
          isEco={state.economy?.tEco}
        />

        <div style={{
          background: '#0a0c10', color: 'var(--text-primary)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minWidth: 170, padding: '4px 20px',
        }}>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            {map.name?.replace('de_', '').toUpperCase()} · ROUND {map.round + 1}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
            {formatClock(state.clock)}
          </div>
        </div>

        <TeamScorePanel
          teamName={config.teamBName}
          score={map.ctScore}
          color={config.palette.ct}
          align="right"
          isEco={state.economy?.ctEco}
        />
      </div>

      {(isPlanted || isDefusing) && (
        <div style={{
          height: 4, width: '100%', background: 'rgba(10,12,16,0.6)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${bombTimer?.countdown != null ? Math.max(0, 100 - (bombTimer.countdown / 40) * 100) : 0}%`,
            background: isDefusing ? '#3ecf6a' : '#c0392b',
            transition: 'width 0.3s linear',
          }} />
        </div>
      )}
    </div>
  );
}

function TeamScorePanel({ teamName, score, color, align, isEco }) {
  return (
    <div style={{
      background: color, color: '#0a0c10', flex: 1,
      display: 'flex', alignItems: 'center', gap: 12,
      justifyContent: align === 'left' ? 'flex-end' : 'flex-start',
      padding: '0 28px',
    }}>
      {align === 'right' && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: 'rgba(10,12,16,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
        }}>
          {teamName?.slice(0, 1).toUpperCase() ?? '?'}
        </div>
      )}

      {align === 'left' && teamName && (
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: 14 }}>
          {teamName}
        </span>
      )}

      {isEco && (
        <span style={{
          fontFamily: 'var(--font-data)', fontSize: 9, fontWeight: 700,
          background: 'rgba(10,12,16,0.3)', padding: '2px 6px', borderRadius: 3,
        }}>
          ECO
        </span>
      )}

      <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700 }}>
        {score}
      </span>

      {align === 'left' && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: 'rgba(10,12,16,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
        }}>
          {teamName?.slice(0, 1).toUpperCase() ?? '?'}
        </div>
      )}

      {align === 'right' && teamName && (
        <span style={{ fontFamily: 'var(--font-label)', fontWeight: 600, fontSize: 14 }}>
          {teamName}
        </span>
      )}
    </div>
  );
}

function formatClock(seconds) {
  if (seconds == null) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}