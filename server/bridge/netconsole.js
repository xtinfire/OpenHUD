// server/bridge/netconsole.js
// Requires CS2 launched with: -netconport 2121
const net = require('net');

let socket = null;

function connect(host = '127.0.0.1', port = 2121) {
  socket = net.createConnection({ host, port }, () => {
    console.log('Connected to CS2 netconsole');
  });
  socket.on('error', (err) => console.error('netconsole error:', err.message));
  socket.on('close', () => {
    socket = null;
    setTimeout(() => connect(host, port), 3000); // retry
  });
}

function sendConsoleCommand(cmd) {
  if (!socket || socket.destroyed) return false;
  socket.write(cmd + '\n');
  return true;
}

module.exports = { connect, sendConsoleCommand };