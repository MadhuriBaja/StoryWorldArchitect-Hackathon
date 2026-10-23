import { PresetWorld } from '@/types/world';

export const PRESET_WORLDS: PresetWorld[] = [
  {
    id: 'solaria',
    title: 'Solar Kingdom of Solaria',
    tagline: 'Sunlight-fueled magic meets strict daylight caste hierarchies',
    premise: 'A desert kingdom where magic is drawn exclusively from direct sunlight. Five rival houses compete for unshaded solar spires while twilight marks an enforced curfew.',
    previewTags: ['Solar Magic', 'Desert Towers', 'Spire Politics']
  },
  {
    id: 'clockwork',
    title: 'Subterranean Clockwork Cities',
    tagline: 'Geothermal steam guilds in sealed tectonic caverns',
    premise: 'A subterranean civilization thriving inside geothermal cavern vaults. Automated mechanical clocks govern breathing vents, and all contact with the frozen surface is forbidden.',
    previewTags: ['Geothermal Steam', 'Tectonic Vaults', 'Forbidden Surface']
  },
  {
    id: 'archipelago',
    title: 'Archipelago of Drifting Continents',
    tagline: 'Floating sky islands tethered by magnetic gravity stones',
    premise: 'Floating celestial landmasses held aloft by unstable gravity crystals. Guild navigators and sky-corsair fleets wage aerial war to secure magnetic trade winds.',
    previewTags: ['Sky Islands', 'Magnetic Gravity', 'Sky Fleets']
  }
];
