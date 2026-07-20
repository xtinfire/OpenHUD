// overlays/hud/src/components/DirectorBanner.jsx
export function DirectorBanner({ suggestion }) {
  if (!suggestion) return null;

  return (
    <div className="chamfer" style={{
      position: 'fixed', top: 76, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--brand-accent)', color: '#0a0c10',
      padding: '6px 18px', fontFamily: 'var(--font-label)', fontWeight: 700,
      fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
      animation: 'directorPulse 0.3s ease',
    }}>
      🎯 {suggestion.reason}
    </div>
  );
}