// overlays/hud/src/main.jsx
import { createRoot } from 'react-dom/client';
import App from './App';
import { MinimapApp } from './MinimapApp';
import { VetoApp } from './VetoApp';
import { SponsorApp } from './SponsorApp';
import { BroadcastApp } from './BroadcastApp';
import './styles/tokens.css';

const params = new URLSearchParams(window.location.search);
const view = params.get('view'); // 'minimap' | 'veto' | 'sponsors' | 'broadcast' | null

const Root =
  view === 'minimap' ? MinimapApp :
  view === 'veto' ? VetoApp :
  view === 'sponsors' ? SponsorApp :
  view === 'broadcast' ? BroadcastApp :
  App;

createRoot(document.getElementById('root')).render(<Root />);