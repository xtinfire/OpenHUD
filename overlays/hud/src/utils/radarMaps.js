// overlays/hud/src/utils/radarMaps.js
// Kalibrasyon verisi: drweissbrot/cs-hud (ISC License) projesinden alınmıştır.
// Radar görselleri: Simple Radar by readtldr.gg (simpleradar setleri) ve
// Valve'ın kendi oyun-içi radar görselleri (ingame/ setleri).
export const RADAR_MAPS = {
  de_dust2:    { pos_x: -2476, pos_y: 3239, scale: 4.4,      image: '/radar/de_dust2.webp' },
  de_mirage:   { pos_x: -3230, pos_y: 1713, scale: 5,        image: '/radar/de_mirage.webp' },
  de_cache:    { pos_x: -2000, pos_y: 3250, scale: 5.5,      image: '/radar/de_cache.webp' },
  de_nuke:     { pos_x: -3453, pos_y: 2887, scale: 7,        image: '/radar/de_nuke.webp', multiLevel: true },
  de_inferno:  { pos_x: -2087, pos_y: 3870, scale: 4.9,      image: '/radar/de_inferno.png' },
  de_ancient:  { pos_x: -2953, pos_y: 2164, scale: 5,        image: '/radar/de_ancient.png' },
  de_anubis:   { pos_x: -2796, pos_y: 3328, scale: 5.22,     image: '/radar/de_anubis.png' },
  de_overpass: { pos_x: -4831, pos_y: 1781, scale: 5.2,      image: '/radar/de_overpass.png' },
  de_vertigo:  { pos_x: -3168, pos_y: 1762, scale: 4,        image: '/radar/de_vertigo.png', multiLevel: true },
  de_train:    { pos_x: -2308, pos_y: 2078, scale: 4.082077, image: '/radar/de_train.png', multiLevel: true },
};

// Dünya koordinatını radar görseli üzerinde yüzde (0-100) pozisyona çevirir.
// Formül drweissbrot/cs-hud'daki radar-offset.js ile doğrulanmıştır.
export function worldToRadarPercent(worldX, worldY, mapName) {
  const calib = RADAR_MAPS[mapName];
  if (!calib) return null;

  const xPct = ((worldX - calib.pos_x) / calib.scale / 1024) * 100;
  const yPct = ((calib.pos_y - worldY) / calib.scale / 1024) * 100;

  return { xPct, yPct };
}