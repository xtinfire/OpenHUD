// server/observer/heuristics.js
function detectClutch(tick) {
  const survivors = tick.ctAlive === 1 ? tick.alive.filter(p => p.team === 'CT')
                  : tick.tAlive === 1 ? tick.alive.filter(p => p.team === 'T')
                  : [];
  const enemyCount = survivors[0]?.team === 'CT' ? tick.tAlive : tick.ctAlive;

  if (survivors.length === 1 && enemyCount >= 2) {
    return {
      priority: 100,
      playerSteamId: survivors[0].steamId,
      reason: `Clutch: 1v${enemyCount}`,
    };
  }
  return null;
}

function detectLowHp(tick) {
  const critical = tick.alive
    .filter(p => p.hp > 0 && p.hp <= 20)
    .sort((a, b) => a.hp - b.hp)[0];

  if (critical) {
    return {
      priority: 40,
      playerSteamId: critical.steamId,
      reason: `Low HP: ${critical.hp}`,
    };
  }
  return null;
}

function distance3D(a, b) {
  if (!a || !b) return Infinity;
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

function detectBombPlantedRetake(tick) {
  if (tick.round?.bomb !== 'planted') return null;

  const bombPos = tick.bombTimer?.position
    ? tick.bombTimer.position.split(',').map(Number)
    : null;

  const ctAlive = tick.alive.filter(p => p.team === 'CT');
  if (ctAlive.length === 0) return null;

  // Bomba konumu varsa, bombaya en yakın CT'yi öner (gerçek retake adayı).
  // Konum yoksa (bazı GSI sürümlerinde eksik olabilir) ilk CT'ye düş.
  const target = bombPos
    ? ctAlive
        .filter(p => p.position)
        .sort((a, b) => distance3D(a.position, bombPos) - distance3D(b.position, bombPos))[0]
    : ctAlive[0];

  if (!target) return null;

  return { priority: 70, playerSteamId: target.steamId, reason: 'Retake developing' };
}

function detectMultiFragPotential(history) {
  const tick = history[history.length - 1];
  const prevTick = history[history.length - 2];
  if (!prevTick) return null;

  for (const p of tick.players) {
    const prev = prevTick.players.find(pp => pp.steamId === p.steamId);
    if (prev && p.kills > prev.kills && p.kills >= 2) {
      return { priority: 90, playerSteamId: p.steamId, reason: `On a ${p.kills}-kill streak` };
    }
  }
  return null;
}

module.exports = { detectClutch, detectLowHp, detectBombPlantedRetake, detectMultiFragPotential };