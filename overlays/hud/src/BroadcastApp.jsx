// overlays/hud/src/BroadcastApp.jsx
import { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { HudView } from './HudView';
import { VetoView } from './VetoView';
import { SponsorView } from './SponsorView';
import './styles/tokens.css';

export function BroadcastApp() {
  const { state, suggestion, config } = useGameState();
  const [veto, setVeto] = useState(null);
  const [sponsorConfig, setSponsorConfig] = useState({ rotationIntervalMs: 8000, sponsors: [] });
  const [scene, setScene] = useState('veto');

  useEffect(() => {
    let ws;
    function connect() {
      ws = new WebSocket('ws://127.0.0.1:3000/live');
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'veto_update') setVeto(msg.payload);
        if (msg.type === 'sponsor_update') setSponsorConfig(msg.payload);
        if (msg.type === 'scene_update') setScene(msg.payload.scene);
      };
      ws.onclose = () => setTimeout(connect, 2000);
    }
    connect();

    fetch('http://127.0.0.1:3000/api/veto/state').then((r) => r.json()).then(setVeto).catch(() => {});
    fetch('http://127.0.0.1:3000/api/sponsors').then((r) => r.json()).then(setSponsorConfig).catch(() => {});
    fetch('http://127.0.0.1:3000/api/scene').then((r) => r.json()).then((s) => setScene(s.scene)).catch(() => {});

    return () => ws?.close();
  }, []);

  const rootStyle = {
    '--ct-color': config.palette.ct,
    '--t-color': config.palette.t,
    '--brand-accent': config.palette.brand,
  };

  return (
    <div style={{ ...rootStyle, width: '100vw', height: '100vh', position: 'relative' }}>
      {scene === 'veto' && <VetoView veto={veto} />}
      {scene === 'sponsors' && <SponsorView sponsorConfig={sponsorConfig} />}
      {scene === 'hud' && <HudView state={state} suggestion={suggestion} config={config} />}
    </div>
  );
}