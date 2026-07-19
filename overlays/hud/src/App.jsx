// overlays/hud/src/App.jsx
import { useGameState } from './hooks/useGameState';
import { HudView } from './HudView';
import './styles/tokens.css';

export default function App() {
  const { state, suggestion, config } = useGameState();
  const rootStyle = {
    '--ct-color': config.palette.ct,
    '--t-color': config.palette.t,
    '--brand-accent': config.palette.brand,
  };

  return (
    <div style={{ ...rootStyle, width: '100vw', height: '100vh', position: 'relative' }}>
      <HudView state={state} suggestion={suggestion} config={config} />
    </div>
  );
}