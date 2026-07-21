// server/observer/director.js
const {
  detectClutch,
  detectLowHp,
  detectBombPlantedRetake,
  detectMultiFragPotential,
} = require('./heuristics');
const { switchToObserverSlot } = require('../bridge/ydotoolBridge');

const SWITCH_COOLDOWN_MS = 2500;
const PRIORITY_JUMP_THRESHOLD = 30;

class ObserverDirector {
  constructor({ mode = 'suggest' } = {}) {
    this.mode = mode;
    this.lastSwitchedSteamId = null;
    this.lastSwitchTime = 0;
    this.lastPriority = 0;
  }

  analyze(history) {
    if (this.mode === 'off') return null;

    const tick = history[history.length - 1];
    if (!tick) return null;

    const candidates = [
      detectClutch(tick),
      detectMultiFragPotential(history),
      detectBombPlantedRetake(tick),
      detectLowHp(tick),
    ].filter(Boolean);

    if (candidates.length === 0) return null;

    const best = candidates.sort((a, b) => b.priority - a.priority)[0];

    if (this.mode === 'auto') {
      this.maybeSwitchCamera(best, tick);
    }

    return best;
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

    switchToObserverSlot(player.observerSlot); // fire-and-forget, async ama beklemiyoruz

    this.lastSwitchedSteamId = suggestion.playerSteamId;
    this.lastSwitchTime = now;
    this.lastPriority = suggestion.priority;
  }
}

module.exports = { ObserverDirector };