// server/veto/vetoEngine.js — GÜNCELLENMİŞ (side selection destekli)
const sceneManager = require('../scene/sceneManager');
const express = require('express');
const router = express.Router();

let vetoState = null;
let hubRef = null;

const SEQUENCES = {
  bo1: ['ban', 'ban', 'ban', 'ban', 'ban', 'ban', 'decider'],
  bo3: ['ban', 'ban', 'pick', 'pick', 'ban', 'ban', 'decider'],
  bo5: ['ban', 'ban', 'pick', 'pick', 'pick', 'pick', 'decider'],
};

function attachHub(hub) {
  hubRef = hub;
}

function broadcastState() {
  if (hubRef) hubRef.broadcast({ type: 'veto_update', payload: vetoState });
}

function startVeto({ format, teamAName, teamBName, mapPool }) {
  vetoState = {
    format,
    teamAName,
    teamBName,
    mapPool: [...mapPool],
    sequence: SEQUENCES[format].map((action, i) => ({
      team: i % 2 === 0 ? 'A' : 'B',
      action,
    })),
    currentStep: 0,
    results: [], // { team, action, map, sideChoiceTeam, side }
    pendingSideSelection: null, // { resultIndex, map, sideChoiceTeam }
    done: false,
  };
  broadcastState();
  return vetoState;
}

function applyStep(mapName) {
  if (!vetoState || vetoState.currentStep >= vetoState.sequence.length) return vetoState;

  const step = vetoState.sequence[vetoState.currentStep];
  const resultIndex = vetoState.results.length;

  vetoState.results.push({
    team: step.team,
    action: step.action,
    map: mapName,
    sideChoiceTeam: null,
    side: null,
  });
  vetoState.mapPool = vetoState.mapPool.filter((m) => m !== mapName);
  vetoState.currentStep += 1;

  // pick/decider aksiyonlarından sonra taraf seçimi bekleniyor —
  // seçimi yapan taraf, o map'i PICK ETMEYEN takım
  if (step.action === 'pick' || step.action === 'decider') {
    const sideChoiceTeam = step.team === 'A' ? 'B' : 'A';
    vetoState.pendingSideSelection = { resultIndex, map: mapName, sideChoiceTeam };
  }

  // Sadece 1 harita kaldıysa ve sequence'te hâlâ adım varsa (bo1 durumunda
  // decider adımı otomatik çözülür)
  if (vetoState.mapPool.length === 1 && vetoState.currentStep < vetoState.sequence.length) {
    const deciderStep = vetoState.sequence[vetoState.currentStep];
    const deciderResultIndex = vetoState.results.length;
    vetoState.results.push({
      team: deciderStep.team,
      action: deciderStep.action,
      map: vetoState.mapPool[0],
      sideChoiceTeam: null,
      side: null,
    });
    vetoState.mapPool = [];
    vetoState.currentStep += 1;

    const sideChoiceTeam = deciderStep.team === 'A' ? 'B' : 'A';
    vetoState.pendingSideSelection = {
      resultIndex: deciderResultIndex,
      map: vetoState.results[deciderResultIndex].map,
      sideChoiceTeam,
    };
  }

  if (vetoState.currentStep >= vetoState.sequence.length && !vetoState.pendingSideSelection) {
    vetoState.done = true;
    sceneManager.onVetoDone();
  }

  broadcastState();
  return vetoState;
}

function applySide(side) {
  if (!vetoState?.pendingSideSelection) return vetoState;

  const { resultIndex, sideChoiceTeam } = vetoState.pendingSideSelection;
  vetoState.results[resultIndex].side = side; // 'CT' | 'T'
  vetoState.results[resultIndex].sideChoiceTeam = sideChoiceTeam;
  vetoState.pendingSideSelection = null;

  if (vetoState.currentStep >= vetoState.sequence.length) {
    vetoState.done = true;
    sceneManager.onVetoDone();
  }

  broadcastState();
  return vetoState;
}

router.post('/start', (req, res) => res.json(startVeto(req.body)));
router.post('/step', (req, res) => res.json(applyStep(req.body.mapName)));
router.post('/side', (req, res) => res.json(applySide(req.body.side)));
router.get('/state', (req, res) => res.json(vetoState));

module.exports = { router, attachHub, startVeto, applyStep, applySide, getState: () => vetoState };