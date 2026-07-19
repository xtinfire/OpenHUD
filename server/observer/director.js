// server/observer/director.js
const {
  detectClutch,
  detectLowHp,
  detectBombPlantedRetake,
  detectMultiFragPotential,
} = require('./heuristics');
const { sendConsoleCommand } = require('../bridge/netconsole');

class ObserverDirector {
  constructor({ mode = 'suggest' } = {}) {
    this.mode = mode; // 'suggest' | 'auto'
  }

  analyze(history) {
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
      this.switchCamera(best.playerSteamId);
    }

    return best;
  }

  switchCamera(steamId) {
    // CS2 console command to force spectator target
    sendConsoleCommand(`spec_player ${steamId}`);
  }
}

module.exports = { ObserverDirector };