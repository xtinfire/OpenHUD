// overlays/hud/src/components/Minimap.jsx
import { worldToRadarPercent, RADAR_MAPS } from '../utils/radarMaps';

export function Minimap({ state, config, calibrate = false }) {
  if (!state?.map?.name) return null;

  const mapKey = state.map.name; // "de_mirage" gibi
  const hasCalib = !!RADAR_MAPS[mapKey];

  return (
    <div style={{
      position: 'fixed', top: 76, left: 12,
      width: 300, height: 300,
      background: 'var(--bg-panel-alpha)',
      overflow: 'hidden',
    }} className="chamfer">
      {hasCalib ? (
        <img
          src={RADAR_MAPS[mapKey]?.image}
          alt={mapKey}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.style.opacity = 0.15; }}
        />
      ) : (
        <div style={{
          color: 'var(--text-muted)', fontFamily: 'var(--font-data)',
          fontSize: 11, padding: 8,
        }}>
          Bu harita için kalibrasyon yok: {mapKey}
        </div>
      )}

      {calibrate && <CalibrationGrid />}

      {state.players
        .filter((p) => p.position && hasCalib && !(p.position[0] === 0 && p.position[1] === 0))
        .map((p) => {
          const pos = worldToRadarPercent(p.position[0], p.position[1], mapKey);
          if (!pos) return null;
          const isDead = p.hp <= 0;
          const color = p.team === 'CT' ? config.palette.ct : config.palette.t;

          return (
            <PlayerDot
              key={p.steamId}
              xPct={pos.xPct}
              yPct={pos.yPct}
              color={color}
              isDead={isDead}
              forward={p.forward}
              name={p.name}
            />
          );
        })}
    </div>
  );
}

// Minimap.jsx içindeki PlayerDot fonksiyonunu güncelle
// Minimap.jsx içindeki PlayerDot fonksiyonu — GÜNCELLENMİŞ
function PlayerDot({ xPct, yPct, color, isDead, forward, name }) {

  // Y ekseni pozisyonda ters çevrildiği için burada da forward[1]'i ters çeviriyoruz
  const angle = forward ? Math.atan2(-forward[1], forward[0]) * (180 / Math.PI) : 0;

  return (
    <div
      title={name}
      style={{
        position: 'absolute',
        left: `${xPct}%`, top: `${yPct}%`,
        transform: 'translate(-50%, -50%)',
        width: 10, height: 10,
        transition: 'left 0.12s linear, top 0.12s linear',
      }}
    >
      {isDead ? (
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>✖</div>
      ) : (
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: color, border: '1px solid #0a0c10',
          position: 'relative',
        }}>
          {forward && (
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 10, height: 1.5, background: color,   // <- uzunluk 14'ten 10'a küçültüldü
              transformOrigin: 'left center',
              transform: `rotate(${angle}deg)`,
              transition: 'transform 0.12s linear',
            }} />
          )}
        </div>
      )}
    </div>
  );
}

// Kalibrasyon modunda 10x10'luk grid çizer — radar PNG'sinin gerçek
// oyun dünyasıyla hizalı olup olmadığını gözle kontrol etmek için.
function CalibrationGrid() {
  const lines = [];
  for (let i = 1; i < 10; i++) {
    const pct = i * 10;
    lines.push(
      <div key={`v${i}`} style={{
        position: 'absolute', left: `${pct}%`, top: 0, bottom: 0,
        width: 1, background: 'rgba(255,0,0,0.4)',
      }} />,
      <div key={`h${i}`} style={{
        position: 'absolute', top: `${pct}%`, left: 0, right: 0,
        height: 1, background: 'rgba(255,0,0,0.4)',
      }} />
    );
  }
  return <>{lines}</>;
}