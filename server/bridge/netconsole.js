// server/bridge/netconsole.js — GÜNCELLENMİŞ
const net = require('net');

let socket = null;
let reconnectTimer = null;
let hasLoggedDisconnected = false;

function connect(host = '127.0.0.1', port = 2121) {
  socket = net.createConnection({ host, port });

  socket.on('connect', () => {
    console.log(`[netconsole] CS2 konsoluna bağlandı (${host}:${port})`);
    hasLoggedDisconnected = false;
  });

  socket.on('error', () => {
    // Sessizce yut — CS2 henüz -netconport ile açılmamışsa bu normal.
    // Sadece İLK seferde bilgilendirici bir mesaj bas, sonra sessiz kal.
    if (!hasLoggedDisconnected) {
      console.log(`[netconsole] CS2 konsoluna henüz bağlanılamadı (${host}:${port}) — CS2'yi -netconport ${port} ile başlattığında otomatik bağlanacak.`);
      hasLoggedDisconnected = true;
    }
  });

  socket.on('close', () => {
    socket = null;
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => connect(host, port), 3000);
  });
}

function sendConsoleCommand(cmd) {
  if (!socket || socket.destroyed || !socket.writable) return false;
  socket.write(cmd + '\n');
  return true;
}

module.exports = { connect, sendConsoleCommand };