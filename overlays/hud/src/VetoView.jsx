export function VetoView({ veto }) {
  if (!veto) {
    return <div style={{ color: 'var(--text-muted)', padding: 20, fontFamily: 'var(--font-label)' }}>
      Veto not started.
    </div>;
  }
  return (
    <div style={{ padding: 20, fontFamily: 'var(--font-label)', color: 'var(--text-primary)' }}>
      <VetoHeader veto={veto} />
      <VetoTimeline veto={veto} />
      {!veto.done && <VetoStatusBar veto={veto} />}
      {veto.done && <VetoSummary veto={veto} />}
    </div>
  );
}

function VetoHeader({ veto }) {
  return (
    <div className="chamfer" style={{ background: 'var(--bg-panel-alpha)', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>
      <span>{veto.teamAName}</span>
      <span style={{ color: 'var(--text-muted)' }}>{veto.format.toUpperCase()} VETO</span>
      <span>{veto.teamBName}</span>
    </div>
  );
}

function VetoTimeline({ veto }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {veto.results.map((r, i) => (
        <div key={i} className="chamfer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-panel-alpha)', padding: '8px 14px', borderLeft: `4px solid ${actionColor(r.action)}` }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, textTransform: 'uppercase', color: actionColor(r.action), minWidth: 60 }}>{r.action}</span>
          <span style={{ fontWeight: 700, flex: 1 }}>{r.map.replace('de_', '').toUpperCase()}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{teamLabel(r.team, veto)}</span>
          {r.side && (
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, padding: '2px 8px', borderRadius: 3, background: r.side === 'CT' ? 'var(--ct-color)' : 'var(--t-color)', color: '#0a0c10' }}>
              {teamLabel(r.sideChoiceTeam, veto)} → {r.side}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function VetoStatusBar({ veto }) {
  const currentAction = veto.sequence[veto.currentStep];
  const waitingForSide = !!veto.pendingSideSelection;
  return (
    <div className="chamfer" style={{ marginTop: 12, padding: '10px 16px', background: 'var(--brand-accent)', color: '#0a0c10', fontWeight: 700, textAlign: 'center' }}>
      {waitingForSide
        ? `${teamLabel(veto.pendingSideSelection.sideChoiceTeam, veto)} taraf seçiyor — ${veto.pendingSideSelection.map.replace('de_', '').toUpperCase()}`
        : currentAction
          ? `${teamLabel(currentAction.team, veto)} ${currentAction.action === 'ban' ? 'ban' : currentAction.action === 'pick' ? 'pick' : 'decider'} yapıyor`
          : 'Veto tamamlandı'}
    </div>
  );
}

function VetoSummary({ veto }) {
  const played = veto.results.filter((r) => r.action === 'pick' || r.action === 'decider');
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 8, color: 'var(--text-muted)' }}>MAP LİSTESİ</div>
      {played.map((r, i) => (
        <div key={i} style={{ fontWeight: 700, fontSize: 15 }}>
          {i + 1}. {r.map.replace('de_', '').toUpperCase()}
          {r.side && ` — ${teamLabel(r.sideChoiceTeam, veto)}: ${r.side}`}
        </div>
      ))}
    </div>
  );
}

function actionColor(action) {
  if (action === 'ban') return '#c0392b';
  if (action === 'pick') return 'var(--ct-color)';
  return 'var(--brand-accent)';
}

function teamLabel(team, veto) {
  return team === 'A' ? veto.teamAName : veto.teamBName;
}