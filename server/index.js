// server/index.js
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { normalizeState } = require('./gsi/normalize');
const { StateStore } = require('./gsi/stateStore');
const { BroadcastHub } = require('./ws/broadcastHub');
const { ObserverDirector } = require('./observer/director');
const configManager = require('./config/configManager');
const vetoEngine = require('./veto/vetoEngine');
const sponsorManager = require('./sponsors/sponsorManager');
const observerRoutes = require('./observer/observerRoutes');
const sceneManager = require('./scene/sceneManager');
const netconsole = require('./bridge/netconsole');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use('/sponsors', express.static(sponsorManager.SPONSORS_DIR));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/live' });

const hub = new BroadcastHub(wss);
const store = new StateStore({ historySize: 150 });
const director = new ObserverDirector({ mode: 'suggest' });

const EXPECTED_TOKEN = 'myhud-secret-token-change-me';

app.post('/gsi', (req, res) => {
  const raw = req.body;
  if (raw?.auth?.token !== EXPECTED_TOKEN) return res.status(403).end();

  const normalized = normalizeState(raw, store.previous());
  store.push(normalized);

  const suggestion = director.analyze(store.history());
  sceneManager.onGameTick(normalized);

  hub.broadcast({ type: 'state_update', payload: normalized, suggestion });
  res.status(200).end();
});

// hub'a bağımlı modülleri bağla
vetoEngine.attachHub(hub);
configManager.attachHub(hub);
sponsorManager.attachHub(hub);
sceneManager.attachHub(hub);
observerRoutes.attachDirector(director);

// Route'lar
app.use('/api/veto', vetoEngine.router);
app.use('/api/sponsors', sponsorManager.router);
app.use('/api/config', configManager.router);
app.use('/api/observer', observerRoutes.router);
app.use('/api/scene', sceneManager.router); // <- YENİ

netconsole.connect(); // Connects to the default 127.0.0.1:2121 if CS2 was launched with -netconport.
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`GSI ingest + WS hub listening on http://127.0.0.1:${PORT}`);
});