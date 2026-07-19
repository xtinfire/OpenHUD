// overlays/hud/src/components/ActivePlayerPanel.jsx
export function ActivePlayerPanel({ activePlayer }) {
  if (!activePlayer) return null;
  const weaponName = activePlayer.activeWeapon?.name?.replace('weapon_', '') ?? '—';
  const ammoClip = activePlayer.activeWeapon?.ammo_clip;
  const ammoReserve = activePlayer.activeWeapon?.ammo_reserve;

  return (
    <div className="chamfer" style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--bg-panel-alpha)', color: 'var(--text-primary)',
      display: 'flex', alignItems: 'center', gap: 16, padding: '8px 20px',
      fontFamily: 'var(--font-label)',
    }}>
      <span style={{ fontWeight: 700, fontSize: 15 }}>{activePlayer.name}</span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 13 }}>
        ❤ {activePlayer.hp}&nbsp;&nbsp;🛡 {activePlayer.armor}
      </span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 13, color: 'var(--text-muted)' }}>
        {weaponName.toUpperCase()} {ammoClip != null ? `${ammoClip}/${ammoReserve}` : ''}
      </span>
    </div>
  );
}