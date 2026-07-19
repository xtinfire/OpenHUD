// server/observer/heuristics.js
// Each detector returns null or a { priority, playerSteamId, reason } suggestion.
// Higher priority wins in director.js.

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

function detectBombPlantedRetake(tick) {
  if (tick.round?.bomb === 'planted') {
    // Prioritize whichever CT is closest to bombsite (needs site zone lookup
    // per map — placeholder for now, return the CT with most kills this round
    // or highest equip value as a proxy until zones are implemented).
    const ct = tick.alive.filter(p => p.team === 'CT')[0];
    if (ct) {
      return { priority: 70, playerSteamId: ct.steamId, reason: 'Retake developing' };
    }
  }
  return null;
}

function detectMultiFragPotential(history) {
  const tick = history[history.length - 1];
  const prevTick = history[history.length - 2];
  if (!prevTick) return null;

  // crude kill detection via death count deltas
  for (const p of tick.players) {
    const prev = prevTick.players.find(pp => pp.steamId === p.steamId);
    if (prev && p.kills > prev.kills && p.kills >= 2) {
      return { priority: 90, playerSteamId: p.steamId, reason: `On a ${p.kills}-kill streak` };
    }
  }
  return null;
}

module.exports = { detectClutch, detectLowHp, detectBombPlantedRetake, detectMultiFragPotential };