// electron-app/main.js — TAM HALİ
const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');
const { fork, spawn } = require('child_process');

let serverProcess = null;
let overlayDevProcess = null;
let mainWindow = null;

function startServer() {
  const serverEntry = path.join(__dirname, '..', 'server', 'index.js');

  const extraPath = path.join(os.homedir(), '.cargo', 'bin');
  const env = {
    ...process.env,
    PATH: `${process.env.PATH}:${extraPath}`,
  };

  serverProcess = fork(serverEntry, [], { silent: false, env });

  serverProcess.on('exit', (code) => {
    console.log(`GSI server kapandı (kod: ${code})`);
  });
}

function startOverlayDevServer() {
  const overlayDir = path.join(__dirname, '..', 'overlays', 'hud');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  overlayDevProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: overlayDir,
    stdio: 'inherit', // Vite'ın loglarını Electron'un terminaline yansıt
  });

  overlayDevProcess.on('exit', (code) => {
    console.log(`Overlay dev server kapandı (kod: ${code})`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'control-panel', 'index.html'));
}

app.whenReady().then(() => {
  startServer();
  startOverlayDevServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (overlayDevProcess) overlayDevProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
  if (overlayDevProcess) overlayDevProcess.kill();
});