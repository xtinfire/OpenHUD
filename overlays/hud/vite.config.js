// overlays/hud/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // OBS local file source için kritik — absolute path OBS'te kırılır
});