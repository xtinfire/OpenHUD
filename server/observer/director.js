// server/observer/director.js
const {
  detectClutch,
  detectLowHp,
  detectBombPlantedRetake,
  detectMultiFragPotential,
} = require('./heuristics');
const { sendConsoleCommand } = require('../bridge/netconsole');

const SWITCH_COOLDOWN_MS = 2500; // aynı hedefe art arda komut göndermeyi engelle
const PRIORITY_JUMP_THRESHOLD = 30; // cooldown'u aşacak kadar önemli bir olay (örn. clutch başladı)

class ObserverDirector {
  constructor({ mode = 'suggest' } = {}) {
    this.mode = mode; // 'off' | 'suggest' | 'auto'
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
      this.maybeSwitchCamera(best);
    }

    return best;
  }

  maybeSwitchCamera(suggestion) {
    const now = Date.now();
    const sameTarget = suggestion.playerSteamId === this.lastSwitchedSteamId;
    const cooldownPassed = now - this.lastSwitchTime >= SWITCH_COOLDOWN_MS;
    const isMuchMoreImportant = suggestion.priority - this.lastPriority >= PRIORITY_JUMP_THRESHOLD;

    // Hedef zaten aynıysa tekrar komut gönderme (spam önleme)
    if (sameTarget) return;

    // Hedef değiştiyse ama henüz cooldown dolmadıysa, sadece çok daha
    // önemli bir olay varsa (örn. clutch) yine de anında geç
    if (!cooldownPassed && !isMuchMoreImportant) return;

    sendConsoleCommand(`spec_player ${suggestion.playerSteamId}`);
    this.lastSwitchedSteamId = suggestion.playerSteamId;
    this.lastSwitchTime = now;
    this.lastPriority = suggestion.priority;
  }
}

module.exports = { ObserverDirector };