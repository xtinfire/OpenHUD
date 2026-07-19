// overlays/hud/src/VetoApp.jsx
import { useEffect, useState } from 'react';
import { VetoView } from './VetoView';
import './styles/tokens.css';

export function VetoApp() {
  const [veto, setVeto] = useState(null);

  useEffect(() => {
    let ws;
    function connect() {
      ws = new WebSocket('ws://127.0.0.1:3000/live');
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'veto_update') setVeto(msg.payload);
      };
      ws.onclose = () => setTimeout(connect, 2000);
    }
    connect();
    fetch('http://127.0.0.1:3000/api/veto/state').then((r) => r.json()).then(setVeto).catch(() => {});
    return () => ws?.close();
  }, []);

  return <VetoView veto={veto} />;
}