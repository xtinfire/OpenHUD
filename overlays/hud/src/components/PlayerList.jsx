// overlays/hud/src/components/PlayerList.jsx — TAM HALİ
import { WeaponIcon } from './WeaponIcon';

export function PlayerList({ players, color, align = 'left', suggestion, direction = 'column' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: direction,
      gap: 2,
      width: direction === 'column' ? 260 : 'auto',
    }}>
      {players.map((p) => {
        const isSuggested = suggestion?.playerSteamId === p.steamId;
        const isDead = p.hp <= 0;
        return (
          <div key={p.steamId} className="panel" style={{
            display: 'flex', flexDirection: 'column',
            background: isSuggested ? color : 'var(--bg-panel-alpha)',
            opacity: isDead ? 0.4 : 1,
            padding: '5px 10px',
            minWidth: direction === 'row' ? 170 : undefined,
            borderLeft: align === 'left' ? `4px solid ${color}` : 'none',
            borderRight: align === 'right' ? `4px solid ${color}` : 'none',
            borderRadius: 6,
            fontFamily: 'var(--font-label)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                {p.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <WeaponIcon weaponName={p.activeWeapon?.name} size={13} color="var(--text-muted)" />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {p.kills}K {p.deaths}D
                </span>
              </div>
            </div>

            {/* HP bar */}
            <div style={{
              width: '100%', height: 4, background: 'rgba(0,0,0,0.4)',
              borderRadius: 2, marginTop: 4, overflow: 'hidden',
            }}>
              <div style={{
                width: `${isDead ? 0 : p.hp}%`, height: '100%',
                background: p.hp > 50 ? color : p.hp > 20 ? '#e0a85d' : '#c0392b',
                transition: 'width 0.2s ease',
              }} />
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 2,
              fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)',
            }}>
              <span>${p.money}</span>
              <span>{isDead ? '☠' : `${p.hp} HP`}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}