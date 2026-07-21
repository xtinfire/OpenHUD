// server/bridge/ydotoolBridge.js — GÜNCELLENMİŞ
const { execFile } = require('child_process');
const util = require('util');
const os = require('os');
const path = require('path');
const execFileAsync = util.promisify(execFile);

const KDOTOOL_PATH = path.join(os.homedir(), '.cargo', 'bin', 'kdotool');

// slot 0-9 -> Linux kernel tuş kodu (KEY_1..KEY_9, KEY_0)
const SLOT_TO_KEYCODE = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

async function isCS2Focused() {
  try {
    const { stdout } = await execFileAsync(KDOTOOL_PATH, ['getactivewindow', 'getwindowname']);
    return /cs2|counter-strike/i.test(stdout);
  } catch (err) {
    console.error('[ydotoolBridge] kdotool çağrılamadı:', err.message);
    return false;
  }
}

async function pressKey(code) {
  await execFileAsync('ydotool', ['key', `${code}:1`, `${code}:0`]);
}

async function switchToObserverSlot(slot) {
  if (slot == null || slot < 0 || slot > 9) return false;

  const focused = await isCS2Focused();
  if (!focused) {
    console.log(`[ydotoolBridge] CS2 odakta değil, slot ${slot} geçişi atlandı`);
    return false;
  }

  try {
    await pressKey(SLOT_TO_KEYCODE[slot]);
    return true;
  } catch (err) {
    console.error('[ydotoolBridge] hata:', err.message);
    return false;
  }
}

module.exports = { switchToObserverSlot, isCS2Focused };