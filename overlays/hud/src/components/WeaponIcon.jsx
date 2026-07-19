// overlays/hud/src/components/WeaponIcon.jsx
import { getWeaponCategory } from '../utils/weaponCategories';

const ICONS = {
  rifle: (
    <path d="M2 12h14l2-2h4v4h-2l-2 2H8l-2 2H2z" />
  ),
  sniper: (
    <path d="M1 12h6l1-2 14 2v2L8 16l-1-2H1z" />
  ),
  smg: (
    <path d="M3 11h10l2-2h6v3h-2l-1 3H8l-1-2H3z" />
  ),
  pistol: (
    <path d="M4 10h9v3h-2v4H8v-4H6l-1 2H3v-3l1-2z" />
  ),
  shotgun: (
    <path d="M2 12h16l3-1v3l-3-1H2z" />
  ),
  grenade: (
    <circle cx="12" cy="13" r="5" />
  ),
  bomb: (
    <>
      <rect x="7" y="8" width="10" height="8" rx="1" />
      <path d="M9 8V6h6v2" />
    </>
  ),
  knife: (
    <path d="M3 15l10-10 6 6-10 10-3-3z" />
  ),
  other: (
    <circle cx="12" cy="12" r="4" />
  ),
};

export function WeaponIcon({ weaponName, size = 14, color = 'currentColor' }) {
  const category = getWeaponCategory(weaponName);
  if (!category) return null;

  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
    >
      {ICONS[category]}
    </svg>
  );
}