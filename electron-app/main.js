// electron-app/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let serverProcess = null;
let mainWindow = null;

function startServer() {
  const serverEntry = path.join(__dirname, '..', 'server', 'index.js');
  serverProcess = fork(serverEntry, [], {
    silent: false, // server'ın console.log çıktısını Electron'un kendi terminaline yansıt
  });

  serverProcess.on('exit', (code) => {
    console.log(`GSI server kapandı (kod: ${code})`);
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
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverProcess) serverProcess.kill();
});