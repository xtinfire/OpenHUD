// server/gsi/normalize.js
function normalizeState(raw, prevTick) {
  const map = raw.map ?? {};
  const round = raw.round ?? {};
  const allplayers = raw.allplayers ?? {};
  const activeRaw = raw.player ?? null; // o an izlenen/gözlemlenen oyuncu
  const phaseCountdowns = raw.phase_countdowns ?? {};

  const players = Object.entries(allplayers).map(([steamId, p]) => ({
    steamId,
    name: p.name,
    team: p.team,
    hp: p.state?.health ?? 0,
    armor: p.state?.armor ?? 0,
    flashed: p.state?.flashed ?? 0,
    hasHelmet: p.state?.helmet ?? false,
    hasDefuser: p.state?.defusekit ?? false,
    money: p.state?.money ?? 0,
    equipValue: p.state?.equip_value ?? 0,
    kills: p.match_stats?.kills ?? 0,
    deaths: p.match_stats?.deaths ?? 0,
    assists: p.match_stats?.assists ?? 0,
    position: p.position ? p.position.split(',').map(Number) : null,
    forward: p.forward ? p.forward.split(',').map(Number) : null,
    weapons: Object.values(p.weapons ?? {}),
    activeWeapon: Object.values(p.weapons ?? {}).find(w => w.state === 'active') ?? null,
  }));

  // Şu an izlenen/spectate edilen oyuncu (varsa) — GSI 'player' node'u
  // spectator modunda kameranın kilitlendiği kişiyi yansıtır.
  const activePlayer = activeRaw ? {
    steamId: activeRaw.steamid,
    name: activeRaw.name,
    team: activeRaw.team,
    hp: activeRaw.state?.health ?? 0,
    armor: activeRaw.state?.armor ?? 0,
    activeWeapon: Object.values(activeRaw.weapons ?? {}).find(w => w.state === 'active') ?? null,
  } : null;

  return {
    tickTime: Date.now(),
    map: {
      name: map.name,
      phase: map.phase,
      round: map.round,
      ctScore: map.team_ct?.score ?? 0,
      tScore: map.team_t?.score ?? 0,
    },
    round: {
      phase: round.phase,
      bomb: round.bomb ?? null,
    },
    bombTimer: raw.bomb ? {
      state: raw.bomb.state,       // 'planted' | 'defused' | 'exploded' | 'carried' | 'dropped'
      countdown: raw.bomb.countdown ? Number(raw.bomb.countdown) : null,
      position: raw.bomb.position ?? null, // "x, y, z" string, heuristics.js kendi parse ediyor
    } : null,
    // freezetime/round bitiş sayacı — countdown gösterimi için
    clock: phaseCountdowns.phase_ends_in ? Number(phaseCountdowns.phase_ends_in) : null,
    players,
    activePlayer,
    alive: players.filter(p => p.hp > 0),
    ctAlive: players.filter(p => p.team === 'CT' && p.hp > 0).length,
    tAlive: players.filter(p => p.team === 'T' && p.hp > 0).length,
  };
}

module.exports = { normalizeState };