// overlays/hud/src/SponsorApp.jsx
import { useEffect, useState } from 'react';
import { SponsorView } from './SponsorView';
import './styles/tokens.css';

export function SponsorApp() {
  const [sponsorConfig, setSponsorConfig] = useState({ rotationIntervalMs: 8000, sponsors: [] });

  useEffect(() => {
    let ws;
    function connect() {
      ws = new WebSocket('ws://127.0.0.1:3000/live');
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'sponsor_update') setSponsorConfig(msg.payload);
      };
      ws.onclose = () => setTimeout(connect, 2000);
    }
    connect();
    fetch('http://127.0.0.1:3000/api/sponsors').then((r) => r.json()).then(setSponsorConfig).catch(() => {});
    return () => ws?.close();
  }, []);

  return <SponsorView sponsorConfig={sponsorConfig} />;
}