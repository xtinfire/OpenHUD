import { BroadcastFrame } from './components/BroadcastFrame';
import { ScoreBar } from './components/ScoreBar';
import { PlayerList } from './components/PlayerList';
import { ActivePlayerPanel } from './components/ActivePlayerPanel';

export function HudView({ state, suggestion, config }) {
  if (!state) return null;
  const ctPlayers = state.players.filter((p) => p.team === 'CT');
  const tPlayers = state.players.filter((p) => p.team === 'T');
  const isVertical = config.layoutMode === 'vertical';

  return (
    <>
      <BroadcastFrame />
      <ScoreBar state={state} config={config} />
      {isVertical ? (
        <>
          <div style={{ position: 'fixed', left: 12, bottom: 12 }}>
            <PlayerList players={ctPlayers} color={config.palette.ct} suggestion={suggestion} align="left" direction="column" />
          </div>
          <div style={{ position: 'fixed', right: 12, bottom: 12 }}>
            <PlayerList players={tPlayers} color={config.palette.t} suggestion={suggestion} align="right" direction="column" />
          </div>
        </>
      ) : (
        <div style={{ position: 'fixed', top: 70, left: 0, width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 12px' }}>
          <PlayerList players={ctPlayers} color={config.palette.ct} suggestion={suggestion} align="left" direction="row" />
          <PlayerList players={tPlayers} color={config.palette.t} suggestion={suggestion} align="right" direction="row" />
        </div>
      )}
      <ActivePlayerPanel activePlayer={state.activePlayer} />
    </>
  );
}