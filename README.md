# OpenHUD

An open-source CS2 broadcast overlay suite: live HUD, veto system, sponsor rotation, live 2D radar, and a Smart Observer auto-director — built on Game State Integration (GSI).

## Features
- Horizontal/Vertical HUD layouts with custom team & branding colors
- BO1/BO3/BO5 map veto overlay with side selection
- Live 2D minimap with calibrated radar images
- Sponsor logo rotation
- Smart Observer: detects clutches, retakes, and multi-frags, and can auto-switch the spectator camera
- Electron control panel to manage everything without touching config files

## Requirements
- Node.js 18+
- CS2 (Linux or Windows)
- OBS Studio (for displaying the overlays)

## Setup
1. Copy `server/config/gamestate_integration_openhud.cfg` into your CS2 `csgo/cfg/` folder.
2. `cd electron-app && npm install && npm start`
3. Add `http://localhost:5173/?view=broadcast` as a Browser Source in OBS.

## Credits
- Radar calibration data adapted from [drweissbrot/cs-hud](https://github.com/drweissbrot/cs-hud) (ISC License)
- Radar images: [Simple Radar](https://readtldr.gg/simpleradar) by readtldr.gg, and Valve's in-game radar assets

## License
ISC — see [LICENSE](LICENSE)
