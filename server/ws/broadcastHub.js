// server/ws/broadcastHub.js
class BroadcastHub {
  constructor(wss) {
    this.wss = wss;
    this.clients = new Set();

    wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.readyState === client.OPEN) client.send(data);
    }
  }
}

module.exports = { BroadcastHub };