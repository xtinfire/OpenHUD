// server/observer/observerRoutes.js
const express = require('express');
const router = express.Router();

let directorRef = null;
function attachDirector(director) { directorRef = director; }

router.get('/', (req, res) => {
  res.json({ mode: directorRef?.mode ?? 'unknown' });
});

router.post('/mode', (req, res) => {
  const { mode } = req.body;
  if (!['off', 'suggest', 'auto'].includes(mode)) {
    return res.status(400).json({ error: 'mode "off", "suggest" ya da "auto" olmalı' });
  }
  if (directorRef) directorRef.mode = mode;
  res.json({ mode });
});

module.exports = { router, attachDirector };