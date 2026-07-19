// overlays/hud/src/utils/weaponCategories.js
const CATEGORY_MAP = {
  // Tüfekler
  ak47: 'rifle', m4a1: 'rifle', m4a1_silencer: 'rifle', famas: 'rifle',
  galilar: 'rifle', aug: 'rifle', sg556: 'rifle',
  // Keskin nişancı
  awp: 'sniper', ssg08: 'sniper', scar20: 'sniper', g3sg1: 'sniper',
  // SMG
  mp9: 'smg', mac10: 'smg', mp7: 'smg', ump45: 'smg', p90: 'smg', bizon: 'smg', mp5sd: 'smg',
  // Tabanca
  glock: 'pistol', usp_silencer: 'pistol', hkp2000: 'pistol', p250: 'pistol',
  fiveseven: 'pistol', tec9: 'pistol', deagle: 'pistol', elite: 'pistol', revolver: 'pistol',
  // Shotgun
  nova: 'shotgun', xm1014: 'shotgun', sawedoff: 'shotgun', mag7: 'shotgun',
  // Bıçak (her varyant knife_ ile başlar)
  // Bomba/ekipman
  c4: 'bomb', hegrenade: 'grenade', flashbang: 'grenade', smokegrenade: 'grenade',
  molotov: 'grenade', incgrenade: 'grenade', decoy: 'grenade',
};

export function getWeaponCategory(rawName) {
  if (!rawName) return null;
  const clean = rawName.replace('weapon_', '');
  if (clean.startsWith('knife')) return 'knife';
  return CATEGORY_MAP[clean] ?? 'other';
}