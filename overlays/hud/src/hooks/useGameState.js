// overlays/hud/src/hooks/useGameState.js
import { useEffect, useRef, useState } from 'react';

export function useGameState(wsUrl = 'ws://127.0.0.1:3000/live') {
  const [state, setState] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [config, setConfig] = useState({
    layoutMode: 'horizontal', // 'horizontal' | 'vertical'
    palette: {
      ct: '#5da9e0',
      t: '#e0a85d',
      brand: '#ff3b5c',
    },
  });
  const wsRef = useRef(null);

  useEffect(() => {
    let reconnectTimer;

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'state_update') {
          setState(msg.payload);
          setSuggestion(msg.suggestion);
        }
        if (msg.type === 'config_update') {
          setConfig((prev) => ({ ...prev, ...msg.payload }));
        }
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 2000);
      };

      fetch('http://127.0.0.1:3000/api/config')
        .then((r) => r.json())
        .then((cfg) => setConfig((prev) => ({ ...prev, ...cfg })))
        .catch(() => {}); // server henüz ayakta değilse sessizce geç

    }

    connect();
    return () => {
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, [wsUrl]);

  return { state, suggestion, config };
}