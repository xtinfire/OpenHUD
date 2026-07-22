// server/config/configManager.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CONFIG_PATH = path.join(__dirname, 'config.json');

const DEFAULT_CONFIG = {
  layoutMode: 'vertical',
  palette: { ct: '#2f6fed', t: '#e8b23d', brand: '#ff2d78' },
  teamAName: 'Team A', // <- YENİ
  teamBName: 'Team B', // <- YENİ
};

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

let currentConfig = loadConfig();

function attachHub(hub) {
  router.post('/', (req, res) => {
    currentConfig = { ...currentConfig, ...req.body };
    saveConfig(currentConfig);
    hub.broadcast({ type: 'config_update', payload: currentConfig });
    res.json(currentConfig);
  });

  router.get('/', (req, res) => res.json(currentConfig));
}

module.exports = { router, attachHub, getConfig: () => currentConfig };