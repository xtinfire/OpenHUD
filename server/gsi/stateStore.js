// server/gsi/stateStore.js
class StateStore {
  constructor({ historySize = 100 } = {}) {
    this.historySize = historySize;
    this.ticks = [];
    this.lastKnownPositions = {}; // steamId -> [x, y, z], sadece hayattayken güncellenir
  }

  push(normalizedTick) {
    // Sadece canlı oyuncular için son bilinen konumu güncelle
    for (const p of normalizedTick.players) {
      if (p.hp > 0 && p.position) {
        this.lastKnownPositions[p.steamId] = p.position;
      }
    }

    // Ölü oyuncular için GSI'nin gönderdiği (spectator kamerasına ait,
    // yanıltıcı) konumu YOK SAY, her zaman son-canlı-konumu kullan.
    normalizedTick.players = normalizedTick.players.map((p) => {
      if (p.hp <= 0 && this.lastKnownPositions[p.steamId]) {
        return { ...p, position: this.lastKnownPositions[p.steamId] };
      }
      return p;
    });

    this.ticks.push(normalizedTick);
    if (this.ticks.length > this.historySize) this.ticks.shift();
  }

  previous() {
    return this.ticks[this.ticks.length - 1] ?? null;
  }

  history() {
    return this.ticks;
  }
}

module.exports = { StateStore };