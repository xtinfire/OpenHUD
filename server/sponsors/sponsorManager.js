// server/sponsors/sponsorManager.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const SPONSORS_DIR = path.join(__dirname, '..', '..', 'public', 'sponsors');
if (!fs.existsSync(SPONSORS_DIR)) fs.mkdirSync(SPONSORS_DIR, { recursive: true });

let hubRef = null;
function attachHub(hub) { hubRef = hub; }
function broadcast() {
  if (hubRef) hubRef.broadcast({ type: 'sponsor_update', payload: sponsorConfig });
}

let sponsorConfig = {
  rotationIntervalMs: 8000,
  sponsors: [], // { id, filename, displayName, enabled }
};

// Multer: dosyayı SPONSORS_DIR'e, orijinal adını bozmadan ama benzersiz
// bir önek ekleyerek kaydet (aynı isimli iki logo çakışmasın diye).
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SPONSORS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB sınırı
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

router.get('/', (req, res) => res.json(sponsorConfig));

router.post('/upload', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Geçersiz dosya (png/jpg/webp/svg, max 5MB)' });

  const sponsor = {
    id: Date.now().toString(),
    filename: req.file.filename,
    displayName: req.body.displayName || req.file.originalname,
    enabled: true,
  };
  sponsorConfig.sponsors.push(sponsor);
  broadcast();
  res.json(sponsorConfig);
});

router.post('/config', (req, res) => {
  const { rotationIntervalMs } = req.body;
  if (rotationIntervalMs) sponsorConfig.rotationIntervalMs = Number(rotationIntervalMs);
  broadcast();
  res.json(sponsorConfig);
});

router.post('/:id/toggle', (req, res) => {
  const sponsor = sponsorConfig.sponsors.find((s) => s.id === req.params.id);
  if (sponsor) sponsor.enabled = !sponsor.enabled;
  broadcast();
  res.json(sponsorConfig);
});

router.delete('/:id', (req, res) => {
  const sponsor = sponsorConfig.sponsors.find((s) => s.id === req.params.id);
  if (sponsor) {
    const filePath = path.join(SPONSORS_DIR, sponsor.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // dosyayı diskten de sil
  }
  sponsorConfig.sponsors = sponsorConfig.sponsors.filter((s) => s.id !== req.params.id);
  broadcast();
  res.json(sponsorConfig);
});

module.exports = { router, attachHub, getConfig: () => sponsorConfig, SPONSORS_DIR };