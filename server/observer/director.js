// server/observer/director.js
const {
  detectClutch,
  detectLowHp,
  detectBombPlantedRetake,
  detectMultiFragPotential,
  detectTradeKill,
  detectDefuseInProgress,
  detectImminentEngagement,
} = require('./heuristics');
const { switchToObserverSlot } = require('../bridge/ydotoolBridge');

const SWITCH_COOLDOWN_MS = 2500;
const PRIORITY_JUMP_THRESHOLD = 30;
const IDLE_ROTATION_INTERVAL_MS = 6000; // hiçbir olay yoksa kaç ms'de bir rotasyon yapılsın

class ObserverDirector {
  constructor({ mode = 'suggest' } = {}) {
    this.mode = mode; // 'off' | 'suggest' | 'auto'
    this.lastSwitchedSteamId = null;
    this.lastSwitchTime = 0;
    this.lastPriority = 0;
    this.idleRotationIndex = -1;
    this.lastIdleRotationTime = 0;
  }

  analyze(history) {
    if (this.mode === 'off') return null;

    const tick = history[history.length - 1];
    if (!tick) return null;

    const candidates = [
      detectDefuseInProgress(tick),
      detectClutch(tick),
      detectMultiFragPotential(history),
      detectTradeKill(history),
      detectBombPlantedRetake(tick),
      detectImminentEngagement(tick),
      detectLowHp(tick),
    ].filter(Boolean);

    // Hiçbir gerçek olay yoksa, boşta rotasyonu devreye sok — kamera
    // uzun süre aynı kişide donmasın diye en düşük öncelikli bir öneri üret.
    if (candidates.length === 0) {
      const idle = this.getIdleRotationSuggestion(tick);
      if (idle) candidates.push(idle);
    }

    if (candidates.length === 0) return null;

    const best = candidates.sort((a, b) => b.priority - a.priority)[0];

    if (this.mode === 'auto') {
      this.maybeSwitchCamera(best, tick);
    }

    return best;
  }

  getIdleRotationSuggestion(tick) {
    const now = Date.now();
    if (now - this.lastIdleRotationTime < IDLE_ROTATION_INTERVAL_MS) return null;

    const alive = tick.alive;
    if (alive.length === 0) return null;

    this.idleRotationIndex = (this.idleRotationIndex + 1) % alive.length;
    const target = alive[this.idleRotationIndex];
    this.lastIdleRotationTime = now;

    return {
      priority: 5, // en düşük öncelik — gerçek bir olay her zaman bunu ezer
      playerSteamId: target.steamId,
      reason: 'Following the action',
    };
  }

  maybeSwitchCamera(suggestion, tick) {
    const now = Date.now();
    const sameTarget = suggestion.playerSteamId === this.lastSwitchedSteamId;
    const cooldownPassed = now - this.lastSwitchTime >= SWITCH_COOLDOWN_MS;
    const isMuchMoreImportant = suggestion.priority - this.lastPriority >= PRIORITY_JUMP_THRESHOLD;

    if (sameTarget) return;
    if (!cooldownPassed && !isMuchMoreImportant) return;

    const player = tick.players.find(p => p.steamId === suggestion.playerSteamId);
    if (!player || player.observerSlot == null) return;

    switchToObserverSlot(player.observerSlot);

    this.lastSwitchedSteamId = suggestion.playerSteamId;
    this.lastSwitchTime = now;
    this.lastPriority = suggestion.priority;
  }
}

module.exports = { ObserverDirector };