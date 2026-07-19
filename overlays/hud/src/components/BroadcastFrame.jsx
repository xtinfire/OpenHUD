// overlays/hud/src/components/BroadcastFrame.jsx
export function BroadcastFrame() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      border: '3px solid var(--brand-accent)',
      boxShadow: 'inset 0 0 40px 6px rgba(255,45,120,0.35)',
      zIndex: 999,
    }} />
  );
}