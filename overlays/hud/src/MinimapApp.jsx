// overlays/hud/src/MinimapApp.jsx
import { useGameState } from './hooks/useGameState';
import { Minimap } from './components/Minimap';
import './styles/tokens.css';

export function MinimapApp() {
  const { state, config } = useGameState();
  const params = new URLSearchParams(window.location.search);
  const calibrate = params.get('calibrate') === '1';

  const rootStyle = {
    '--ct-color': config.palette.ct,
    '--t-color': config.palette.t,
    '--brand-accent': config.palette.brand,
  };

  return (
    <div style={{ ...rootStyle, width: '100vw', height: '100vh' }}>
      <Minimap state={state} config={config} calibrate={calibrate} />
    </div>
  );
}