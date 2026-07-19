// overlays/hud/src/components/PlayerList.jsx
import { WeaponIcon } from './WeaponIcon';
export function PlayerList({ players, color, align = 'left', suggestion, direction = 'column' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: direction, // 'column' (vertical rail) | 'row' (horizontal strip)
      gap: 2,
      width: direction === 'column' ? 260 : 'auto',
    }}>
      {players.map((p) => {
        const isSuggested = suggestion?.playerSteamId === p.steamId;
        const isDead = p.hp <= 0;
        return (
          <div key={p.steamId} className="chamfer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: isSuggested ? color : 'var(--bg-panel-alpha)',
            opacity: isDead ? 0.4 : 1,
            padding: '5px 10px',
            minWidth: direction === 'row' ? 150 : undefined,
            borderLeft: align === 'left' ? `4px solid ${color}` : 'none',
            borderRight: align === 'right' ? `4px solid ${color}` : 'none',
            fontFamily: 'var(--font-label)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <WeaponIcon weaponName={p.activeWeapon?.name} size={13} color="var(--text-muted)" />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)' }}>
                    ${p.money}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--text-muted)' }}>
                {p.kills}K {p.deaths}D
              </span>
              <span style={{ fontFamily: 'var(--font-data)', fontWeight: 700, fontSize: 15 }}>
                {isDead ? '✖' : p.hp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}