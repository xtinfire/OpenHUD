// server/scene/sceneManager.js
const express = require('express');
const router = express.Router();

let hubRef = null;
function attachHub(hub) { hubRef = hub; }

let sceneState = {
  scene: 'veto',        // 'veto' | 'sponsors' | 'hud'
  auto: true,           // otomatik geçiş açık mı
  sponsorScreenMs: 15000,
};

let sponsorTimer = null;

function broadcast() {
  if (hubRef) hubRef.broadcast({ type: 'scene_update', payload: sceneState });
}

function setScene(scene) {
  sceneState.scene = scene;
  if (sponsorTimer) { clearTimeout(sponsorTimer); sponsorTimer = null; }
  broadcast();
}

// vetoEngine, veto bittiğinde bunu çağırır
function onVetoDone() {
  if (!sceneState.auto) return;
  setScene('sponsors');
  sponsorTimer = setTimeout(() => setScene('hud'), sceneState.sponsorScreenMs);
}

// index.js her GSI tick'inde bunu çağırır — güvenlik ağı
function onGameTick(normalizedTick) {
  if (!sceneState.auto) return;
  const isLive = normalizedTick.map?.phase === 'live' || normalizedTick.map?.phase === 'warmup';
  if (isLive && sceneState.scene !== 'hud') setScene('hud');
}

function setAuto(auto) {
  sceneState.auto = !!auto;
  broadcast();
}

router.get('/', (req, res) => res.json(sceneState));
router.post('/', (req, res) => {
  const { scene, auto, sponsorScreenMs } = req.body;
  if (scene) setScene(scene);
  if (typeof auto === 'boolean') setAuto(auto);
  if (sponsorScreenMs) sceneState.sponsorScreenMs = Number(sponsorScreenMs);
  res.json(sceneState);
});

module.exports = { router, attachHub, onVetoDone, onGameTick, getState: () => sceneState };