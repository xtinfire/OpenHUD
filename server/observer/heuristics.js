// server/observer/heuristics.js
// Her dedektör null ya da { priority, playerSteamId, reason } döner.
// director.js içinde en yüksek priority kazanır.

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
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function detectBombPlantedRetake(tick) {
  if (tick.round?.bomb !== 'planted') return null;

  const bombPos = tick.bombTimer?.position
    ? tick.bombTimer.position.split(',').map(Number)
    : null;

  const ctAlive = tick.alive.filter(p => p.team === 'CT');
  if (ctAlive.length === 0) return null;

  const target = bombPos
    ? ctAlive.filter(p => p.position).sort((a, b) => distance3D(a.position, bombPos) - distance3D(b.position, bombPos))[0]
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

// Trade kill: bir oyuncu öldükten kısa süre sonra (aynı tick içinde) takım
// arkadaşlarından biri kill alırsa, bu "trade" (intikam öldürmesi) sayılır.
// GSI bize "kim kimi öldürdü" bilgisini vermiyor, bu yüzden ölüm + kill
// artışının zaman yakınlığına bakarak yaklaşık tespit yapıyoruz.
function detectTradeKill(history) {
  const tick = history[history.length - 1];
  const prevTick = history[history.length - 2];
  if (!prevTick) return null;

  const justDied = tick.players.find((p) => {
    const prev = prevTick.players.find((pp) => pp.steamId === p.steamId);
    return prev && p.deaths > prev.deaths;
  });
  if (!justDied) return null;

  const avenger = tick.players.find((p) => {
    if (p.team !== justDied.team || p.steamId === justDied.steamId) return false;
    const prev = prevTick.players.find((pp) => pp.steamId === p.steamId);
    return prev && p.kills > prev.kills;
  });

  if (avenger) {
    return {
      priority: 80,
      playerSteamId: avenger.steamId,
      reason: `Trade kill: ${avenger.name}`,
    };
  }
  return null;
}

// Defuse başladı: bomba 'defusing' fazındaysa, bombaya en yakın CT'yi öner.
// detectBombPlantedRetake'ten daha yüksek öncelikli çünkü artık kesinleşmiş
// bir an (retake'in en kritik saniyeleri).
function detectDefuseInProgress(tick) {
  if (tick.bombTimer?.state !== 'defusing') return null;

  const bombPos = tick.bombTimer?.position
    ? tick.bombTimer.position.split(',').map(Number)
    : null;

  const ctAlive = tick.alive.filter((p) => p.team === 'CT');
  if (ctAlive.length === 0) return null;

  const target = bombPos
    ? ctAlive.filter((p) => p.position).sort((a, b) => distance3D(a.position, bombPos) - distance3D(b.position, bombPos))[0]
    : ctAlive[0];

  if (!target) return null;

  return { priority: 95, playerSteamId: target.steamId, reason: 'Defusing!' };
}

// Yakın temas: hiçbir kesin olay olmasa bile, birbirine en yakın CT-T
// çiftini bulup daha düşük HP'ye sahip olanı öner. Kameranın uzun süre
// aynı kişide takılı kalmasını önlemek için var.
const ENGAGEMENT_DISTANCE_THRESHOLD = 600; // Hammer birimi — tahmini, test ederek ayarla

function detectImminentEngagement(tick) {
  if (tick.round?.phase !== 'live') return null;

  const ctAlive = tick.alive.filter((p) => p.team === 'CT' && p.position);
  const tAlive = tick.alive.filter((p) => p.team === 'T' && p.position);

  let closestPair = null;
  let closestDistance = Infinity;

  for (const ct of ctAlive) {
    for (const t of tAlive) {
      const d = distance3D(ct.position, t.position);
      if (d < closestDistance) {
        closestDistance = d;
        closestPair = [ct, t];
      }
    }
  }

  if (!closestPair || closestDistance > ENGAGEMENT_DISTANCE_THRESHOLD) return null;

  const [ct, t] = closestPair;
  const target = ct.hp <= t.hp ? ct : t;

  return {
    priority: 55,
    playerSteamId: target.steamId,
    reason: `Engagement imminent (${Math.round(closestDistance)}u)`,
  };
}

module.exports = {
  detectClutch,
  detectLowHp,
  detectBombPlantedRetake,
  detectMultiFragPotential,
  detectTradeKill,
  detectDefuseInProgress,
  detectImminentEngagement,
};