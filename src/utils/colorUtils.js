const shadeSuffixes = [
  'Glow',
  'Radiance',
  'Pulse',
  'Breeze',
  'Burst',
  'Aura',
  'Bloom',
  'Gleam',
  'Haze',
  'Dream',
  'Velvet',
  'Lush',
  'Flare',
  'Luxe',
  'Mist',
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

const rgbToHsl = ({ r, g, b }) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      default:
        h = (rNorm - gNorm) / delta + 4;
    }
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h: (h * 60 + 360) % 360,
    s: s * 100,
    l: l * 100,
  };
};

const hexToHsl = (hex) => rgbToHsl(hexToRgb(hex));

const hslToHex = ({ h, s, l }) => {
  const sat = clamp(s, 0, 100) / 100;
  const lum = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lum - c / 2;
  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h >= 60 && h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h >= 120 && h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h >= 180 && h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  const toHex = (value) => Math.round((value + m) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${toHex(rPrime)}${toHex(gPrime)}${toHex(bPrime)}`.toUpperCase();
};

export const mainColors = [
  {
    name: 'Red',
    baseHex: '#E63946',
    shades: ['Crimson', 'Coral', 'Maroon', 'Rose', 'Salmon', 'Firebrick', 'Tomato', 'Ruby', 'Candy Apple', 'Burgundy'],
  },
  {
    name: 'Orange',
    baseHex: '#F97316',
    shades: ['Tangerine', 'Amber', 'Rust', 'Peach', 'Pumpkin', 'Apricot', 'Copper', 'Clay', 'Carrot', 'Persimmon'],
  },
  {
    name: 'Yellow',
    baseHex: '#FACC15',
    shades: ['Lemon', 'Mustard', 'Gold', 'Canary', 'Honey', 'Daffodil', 'Butter', 'Sunflower', 'Amber', 'Maize'],
  },
  {
    name: 'Green',
    baseHex: '#22C55E',
    shades: ['Mint', 'Olive', 'Emerald', 'Lime', 'Jade', 'Forest', 'Moss', 'Seafoam', 'Fern', 'Pine'],
  },
  {
    name: 'Blue',
    baseHex: '#3B82F6',
    shades: ['Sky', 'Navy', 'Teal', 'Cyan', 'Azure', 'Cerulean', 'Denim', 'Sapphire', 'Peacock', 'Steel'],
  },
  {
    name: 'Purple',
    baseHex: '#A855F7',
    shades: ['Lavender', 'Plum', 'Mauve', 'Orchid', 'Amethyst', 'Violet', 'Lilac', 'Grape', 'Eggplant', 'Periwinkle'],
  },
  {
    name: 'Pink',
    baseHex: '#EC4899',
    shades: ['Blush', 'Fuchsia', 'Rose', 'Flamingo', 'Bubblegum', 'Magenta', 'Carnation', 'Coral Pink', 'Hot Pink', 'Salmon Pink'],
  },
  {
    name: 'Brown',
    baseHex: '#8B5E3C',
    shades: ['Chocolate', 'Coffee', 'Tan', 'Walnut', 'Caramel', 'Mocha', 'Hazel', 'Umber', 'Sand', 'Copper Brown'],
  },
  {
    name: 'Gray',
    baseHex: '#64748B',
    shades: ['Charcoal', 'Slate', 'Ash', 'Silver', 'Cloud', 'Smoke', 'Graphite', 'Dove', 'Steel', 'Pebble'],
  },
  {
    name: 'Black',
    baseHex: '#0F172A',
    shades: ['Jet', 'Ebony', 'Onyx', 'Char', 'Pitch', 'Coal', 'Obsidian', 'Ink', 'Raven', 'Midnight'],
  },
  {
    name: 'White',
    baseHex: '#F9FAFB',
    shades: ['Ivory', 'Pearl', 'Cream', 'Snow', 'Linen', 'Alabaster', 'Frost', 'Cotton', 'Cloud White', 'Porcelain'],
  },
  {
    name: 'Cyan',
    baseHex: '#06B6D4',
    shades: ['Aqua', 'Turquoise', 'Sea', 'Lagoon', 'Glacier', 'Ice', 'Capri', 'Ocean', 'Tiffany', 'Azure Mist'],
  },
  {
    name: 'Teal',
    baseHex: '#0F766E',
    shades: ['Lagoon Glow', 'Reef', 'Harbor', 'Aquifer', 'Tidepool', 'Bahama', 'Deep Current', 'Seagrass', 'Kelp Cove', 'Marine'],
  },
  {
    name: 'Indigo',
    baseHex: '#4338CA',
    shades: ['Twilight', 'Nebula', 'Royal', 'Cosmos', 'Midnight', 'Starling', 'Orbit', 'Eclipse', 'Mystic', 'Nightfall'],
  },
  {
    name: 'Gold',
    baseHex: '#F59E0B',
    shades: ['Bullion', 'Treasure', 'Auric', 'Sunbeam', 'Medallion', 'Amberglow', 'Crown', 'Gilded', 'Solar', 'Glimmer'],
  },
  {
    name: 'Bronze',
    baseHex: '#B45309',
    shades: ['Forge', 'Artifact', 'Anvil', 'Patina', 'Alloy', 'Monument', 'Sculpt', 'Rustic', 'Medal', 'Pioneer'],
  },
  {
    name: 'Mint',
    baseHex: '#2DD4BF',
    shades: ['Spearmint', 'Frostleaf', 'Verdant', 'Plume', 'Glacier Mint', 'Herbal', 'Lumen', 'Mistleaf', 'Cascade', 'Feather'],
  },
  {
    name: 'Lime',
    baseHex: '#84CC16',
    shades: ['Zest', 'Key Lime', 'Sprout', 'Neon', 'Citrus', 'Verde', 'Chartreuse', 'Spark', 'Clover', 'Caper'],
  },
  {
    name: 'Peach',
    baseHex: '#FB7185',
    shades: ['Apricot', 'Blossom', 'Nectar', 'Sundown', 'Petal', 'Sorbet', 'Marmalade', 'Rosé', 'Bloom', 'Satin'],
  },
  {
    name: 'Silver',
    baseHex: '#9CA3AF',
    shades: ['Platinum', 'Sterling', 'Frosted', 'Chrome', 'Mercury', 'Zephyr', 'Nimbus', 'Dawn', 'Halo', 'Quicksilver'],
  },
  {
    name: 'Magenta',
    baseHex: '#DB2777',
    shades: ['Radiant', 'Velvet', 'Pulse', 'Prism', 'Fluorite', 'Siren', 'Blaze', 'Cosmic', 'Bloom', 'Voltage'],
  },
  {
    name: 'Coral',
    baseHex: '#FF6F61',
    shades: ['Sunset', 'Reef Coral', 'Melon', 'Flare', 'Shell', 'Fiesta', 'Sunkiss', 'Papaya', 'Gala', 'Safflower'],
  },
  {
    name: 'Olive',
    baseHex: '#6B8E23',
    shades: ['Branch', 'Grove', 'Citadel', 'Canopy', 'Countryside', 'Terrace', 'Harvest', 'Artisan', 'Prairie', 'Estate'],
  },
  {
    name: 'Azure',
    baseHex: '#2563EB',
    shades: ['Zenith', 'Horizon', 'Cascade', 'Altair', 'Beacon', 'Nimbus', 'Voyage', 'Glacial', 'Tidal', 'Altitude'],
  },
  {
    name: 'Lavender',
    baseHex: '#C084FC',
    shades: ['Serenity', 'Whisper', 'Petal Mist', 'Starlit', 'Iris', 'Pastel', 'Aura Bloom', 'Lilac Frost', 'Solstice', 'Moonbeam'],
  },
  {
    name: 'Saffron',
    baseHex: '#FACC6B',
    shades: ['Spice', 'Glow', 'Tumeric', 'Amber Spice', 'Brilliance', 'Festival', 'Goldenrod', 'Mellow', 'Thread', 'Sunburst'],
  },
  {
    name: 'Emerald',
    baseHex: '#10B981',
    shades: ['Gemstone', 'Verdigris', 'Mystic Fern', 'Glisten', 'Regal', 'Fairway', 'Aurora', 'Lush Vale', 'Arcadia', 'Glade'],
  },
  {
    name: 'Ruby',
    baseHex: '#D01257',
    shades: ['Gemfire', 'Carmine', 'Fervor', 'Heartstone', 'Radiant Ruby', 'Dragonfruit', 'Roselle', 'Scarlet Beam', 'Velour', 'Marquise'],
  },
  {
    name: 'Cerise',
    baseHex: '#E11D48',
    shades: ['Pulse', 'Raspberry', 'Rouge', 'Vivid Bloom', 'Scarlet Wave', 'Cherry Glaze', 'Cordial', 'Lovelight', 'Velvet Ray', 'Bloom Crush'],
  },
  {
    name: 'Chartreuse',
    baseHex: '#A3E635',
    shades: ['Electric Lime', 'Glowstick', 'Verve', 'Citrine', 'Pop Leaf', 'Neon Grove', 'Zing', 'Volt', 'Spritz', 'Crisp Field'],
  },
  {
    name: 'Copper',
    baseHex: '#B87333',
    shades: ['Smelt', 'Foundry', 'Old Coin', 'Oxidize', 'Glowforge', 'Vintage Alloy', 'Molten', 'Furnace', 'Signet', 'Smith'],
  },
  {
    name: 'Steel',
    baseHex: '#486581',
    shades: ['Girders', 'Titan', 'Skyforge', 'Ironveil', 'Blueprint', 'Arsenal', 'Anchor', 'Mechanist', 'Overcast', 'Armory'],
  },
  {
    name: 'Peridot',
    baseHex: '#B4E74B',
    shades: ['Gemspark', 'Verdant Light', 'Quartz Leaf', 'Greenfire', 'Radiant Jewel', 'Gilded Fern', 'Facet', 'Halo Leaf', 'Auric Sprout', 'Luster'],
  },
  {
    name: 'Aquamarine',
    baseHex: '#3DDAD7',
    shades: ['Lagoon Mist', 'Crystal Reef', 'Tidal Spark', 'Spray', 'Marina', 'Bayshore', 'Nautilus', 'Tranquil Surf', 'Laguna', 'Sea Sprite'],
  },
  {
    name: 'Mulberry',
    baseHex: '#A24DBE',
    shades: ['Velvet Stem', 'Berry Luxe', 'Night Orchard', 'Silk Bloom', 'Regal Plum', 'Berry Ink', 'Mystic Wine', 'Wildvine', 'Sangria Spirit', 'Royal Grove'],
  },
  {
    name: 'Topaz',
    baseHex: '#FFB347',
    shades: ['Sparkstone', 'Golden Hour', 'Amber Halo', 'Sun Muse', 'Auric Flame', 'Warm Horizon', 'Gemlight', 'Sunveil', 'Shimmer', 'Honey Spark'],
  },
  {
    name: 'Nightshade',
    baseHex: '#2C3E50',
    shades: ['Moonlit', 'Dusk', 'Deep Reverie', 'Starbound', 'Inkwell', 'Astral', 'Shadowrest', 'Eclipse Path', 'Nebula Quiet', 'Twilight Veil'],
  },
  {
    name: 'Frost',
    baseHex: '#FFFFFF',
    shades: ['Morning Mist', 'Crystalline', 'Snowpetal', 'Iced Dew', 'Silver Frost', 'Glacier Light', 'Winter Whisper', 'Polar Gleam', 'Hush Ice', 'Cool Aura'],
  },
  {
    name: 'Amber',
    baseHex: '#FFBF24',
    shades: ['Resin Glow', 'Sunstone', 'Torchlight', 'Harvest Beam', 'Elderglow', 'Honeydew Ember', 'Solar Gem', 'Golden Resin', 'Candlelit', 'Autumn Spark'],
  },
  {
    name: 'Cobalt',
    baseHex: '#1E3A8A',
    shades: ['Deep Current', 'Marine Bolt', 'Royal Wake', 'Ocean Alloy', 'Nocturne', 'Midnight Coil', 'Wavecrest', 'Regatta', 'Skyforge Blue', 'Abyss'],
  },
  {
    name: 'Moss',
    baseHex: '#4A7856',
    shades: ['Forest Floor', 'Soft Meadow', 'Wilderness', 'Thicket', 'Pinecrest', 'Cloudforest', 'Cedar Shade', 'Hidden Glen', 'Verdance', 'Oakmoss'],
  },
  {
    name: 'Blush Pink',
    baseHex: '#F7A8B8',
    shades: ['Petal Veil', 'Rosewater', 'Ballet Slipper', 'Cotton Candy', 'Cameo', 'Petunia', 'Powder Petal', 'Bloomkiss', 'Blossom Glow', 'Sherbet'],
  },
  {
    name: 'Celadon',
    baseHex: '#F0FFF4',
    shades: ['Porcelain Leaf', 'Mint Portray', 'Tea Jade', 'Soft Verdure', 'Garden Mist', 'Lotus Fog', 'Riverleaf', 'Pastoral', 'Heirloom Jade', 'Glass Meadow'],
  },
  {
    name: 'Sandstone',
    baseHex: '#D6AD87',
    shades: ['Dune', 'Soft Clay', 'Boulder', 'Drift', 'Sahara', 'Butte', 'Adobe', 'Pueblo', 'Sunbaked', 'Fossil'],
  },
  {
    name: 'Lilac',
    baseHex: '#D8B4FE',
    shades: ['Petal Dream', 'Morning Bloom', 'Fairy Light', 'Gossamer', 'Twilight Bloom', 'Soft Bliss', 'Mauve Mist', 'Pastel Glow', 'Dreamscape', 'Lavish'],
  },
  {
    name: 'Sapphire',
    baseHex: '#0F52BA',
    shades: ['Starburst', 'Royal Tide', 'Gem Gleam', 'Deep Azure', 'Nightfall Spark', 'Royal Glint', 'Cerulean Crown', 'Gemstone', 'Bluefire', 'Aurora Sea'],
  },
  {
    name: 'Pearl',
    baseHex: '#F8F4EA',
    shades: ['Gleam', 'Lustre', 'Silken Light', 'Moon Pearl', 'Soft Dawn', 'Vanilla Sheen', 'Opaline', 'Ivory Glow', 'Creamlight', 'Velvet Gleam'],
  },
  {
    name: 'Slate Blue',
    baseHex: '#6A5ACD',
    shades: ['Moonrise', 'Dusk Sky', 'Charmed Indigo', 'Evening Haze', 'Quiet Storm', 'Velvet Night', 'Tranquil Slate', 'Shadow Drift', 'Twilight Path', 'Serenata'],
  },
  {
    name: 'Sunset',
    baseHex: '#FF8C42',
    shades: ['Evening Glow', 'Dawn Flame', 'Ember', 'Carmel Sky', 'Aurora Ember', 'Late Horizon', 'Radiant Fade', 'Sky Ember', 'Amber Drift', 'Solstice'],
  },
  {
    name: 'Arctic',
    baseHex: '#E6F7FF',
    shades: ['Snowfield', 'Ice Drift', 'Glacial Mist', 'Frostbite', 'Polar Morning', 'Icelight', 'Crystal Field', 'Frozen Veil', 'Chill Breeze', 'Hailstone'],
  },
  {
    name: 'Opal',
    baseHex: '#B6E3E9',
    shades: ['Shimmer Veil', 'Ocean Glass', 'Soft Prism', 'Aurora Gleam', 'Mist Opal', 'Seafoam Glow', 'Luminous Drop', 'Dream Stone', 'Iridescence', 'Glimmer Tides'],
  },
  {
    name: 'Rosewood',
    baseHex: '#65000B',
    shades: ['Mahogany', 'Burgundy Deep', 'Wine', 'Crimson Dark', 'Garnet', 'Maroon Rich', 'Oxblood', 'Bordeaux', 'Merlot', 'Cabernet'],
  },
  {
    name: 'Turquoise',
    baseHex: '#40E0D0',
    shades: ['Caribbean', 'Tropical', 'Lagoon', 'Mint Blue', 'Aqua Fresh', 'Cyan Bright', 'Pool', 'Oceanic', 'Breeze', 'Splash'],
  },
  {
    name: 'Vermillion',
    baseHex: '#E34234',
    shades: ['Scarlet', 'Cinnabar', 'Flame', 'Ember Red', 'Fire', 'Blaze', 'Torch', 'Inferno', 'Phoenix', 'Solar'],
  },
  {
    name: 'Jade',
    baseHex: '#00A86B',
    shades: ['Forest Jade', 'Mint Jade', 'Emerald Jade', 'Sea Jade', 'Pale Jade', 'Dark Jade', 'Imperial', 'Celadon', 'Sage', 'Moss'],
  },
  {
    name: 'Violet',
    baseHex: '#8B00FF',
    shades: ['Royal', 'Deep', 'Bright', 'Pale', 'Lavender', 'Mauve', 'Plum', 'Grape', 'Orchid', 'Iris'],
  },
  {
    name: 'Crimson',
    baseHex: '#DC143C',
    shades: ['Deep', 'Bright', 'Dark', 'Pale', 'Rose', 'Scarlet', 'Ruby', 'Cherry', 'Berry', 'Wine'],
  },
  {
    name: 'Tangerine',
    baseHex: '#FF9500',
    shades: ['Bright', 'Deep', 'Pale', 'Neon', 'Sunset', 'Citrus', 'Mandarin', 'Clementine', 'Papaya', 'Mango'],
  },
  {
    name: 'Sage',
    baseHex: '#87AE73',
    shades: ['Dusty', 'Pale', 'Deep', 'Forest', 'Moss', 'Olive', 'Herb', 'Mint', 'Jade', 'Fern'],
  },
  {
    name: 'Navy',
    baseHex: '#000080',
    shades: ['Royal', 'Midnight', 'Deep', 'Dark', 'Bright', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean'],
  },
  {
    name: 'Salmon',
    baseHex: '#FA8072',
    shades: ['Pink', 'Coral', 'Peach', 'Light', 'Dark', 'Smoked', 'Wild', 'Atlantic', 'Pacific', 'Sockeye'],
  },
  {
    name: 'Maroon',
    baseHex: '#800000',
    shades: ['Deep', 'Dark', 'Rich', 'Burgundy', 'Wine', 'Oxblood', 'Garnet', 'Crimson', 'Ruby', 'Mahogany'],
  },
  {
    name: 'Khaki',
    baseHex: '#C3B091',
    shades: ['Light', 'Dark', 'Olive', 'Tan', 'Beige', 'Sand', 'Taupe', 'Camel', 'Desert', 'Stone'],
  },
  {
    name: 'Fuchsia',
    baseHex: '#FF00FF',
    shades: ['Hot', 'Deep', 'Bright', 'Neon', 'Magenta', 'Pink', 'Vibrant', 'Electric', 'Shocking', 'Radiant'],
  },
  {
    name: 'Ivory',
    baseHex: '#FFFFF0',
    shades: ['Cream', 'Pearl', 'Vanilla', 'Beige', 'Off White', 'Bone', 'Ecru', 'Champagne', 'Alabaster', 'Linen'],
  },
  {
    name: 'Beige',
    baseHex: '#F5F5DC',
    shades: ['Light', 'Dark', 'Tan', 'Cream', 'Sand', 'Khaki', 'Taupe', 'Camel', 'Buff', 'Ecru'],
  },
  {
    name: 'Cream',
    baseHex: '#FFFDD0',
    shades: ['Light', 'Rich', 'Vanilla', 'Butter', 'Ivory', 'Champagne', 'Blonde', 'Wheat', 'Bisque', 'Lemon'],
  },
  {
    name: 'Burgundy',
    baseHex: '#800020',
    shades: ['Deep', 'Rich', 'Wine', 'Maroon', 'Oxblood', 'Garnet', 'Merlot', 'Bordeaux', 'Cabernet', 'Claret'],
  },
  {
    name: 'Charcoal',
    baseHex: '#36454F',
    shades: ['Dark', 'Light', 'Deep', 'Smoky', 'Ash', 'Graphite', 'Slate', 'Coal', 'Soot', 'Ebony'],
  },
  {
    name: 'Cyan',
    baseHex: '#00FFFF',
    shades: ['Bright', 'Deep', 'Pale', 'Aqua', 'Turquoise', 'Electric', 'Neon', 'Sky', 'Ocean', 'Azure'],
  },
  {
    name: 'Garnet',
    baseHex: '#733C2C',
    shades: ['Deep', 'Rich', 'Dark', 'Ruby', 'Burgundy', 'Wine', 'Mahogany', 'Oxblood', 'Crimson', 'Maroon'],
  },
  {
    name: 'Honey',
    baseHex: '#FFC30B',
    shades: ['Golden', 'Light', 'Dark', 'Amber', 'Butter', 'Sunshine', 'Warm', 'Radiant', 'Glowing', 'Luminous'],
  },
  {
    name: 'Mahogany',
    baseHex: '#C04000',
    shades: ['Rich', 'Deep', 'Dark', 'Red', 'Brown', 'Chestnut', 'Walnut', 'Oak', 'Rosewood', 'Cedar'],
  },
  {
    name: 'Mauve',
    baseHex: '#E0B0FF',
    shades: ['Pale', 'Deep', 'Lavender', 'Purple', 'Lilac', 'Orchid', 'Plum', 'Violet', 'Periwinkle', 'Thistle'],
  },
  {
    name: 'Navy Blue',
    baseHex: '#000080',
    shades: ['Royal', 'Midnight', 'Deep', 'Dark', 'Bright', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean'],
  },
  {
    name: 'Olive Green',
    baseHex: '#808000',
    shades: ['Dark', 'Light', 'Drab', 'Army', 'Forest', 'Sage', 'Moss', 'Khaki', 'Jade', 'Fern'],
  },
  {
    name: 'Orchid',
    baseHex: '#DA70D6',
    shades: ['Pale', 'Deep', 'Purple', 'Pink', 'Lavender', 'Mauve', 'Violet', 'Fuchsia', 'Magenta', 'Plum'],
  },
  {
    name: 'Periwinkle',
    baseHex: '#CCCCFF',
    shades: ['Pale', 'Deep', 'Blue', 'Lavender', 'Purple', 'Violet', 'Lilac', 'Wisteria', 'Thistle', 'Orchid'],
  },
  {
    name: 'Plum',
    baseHex: '#8E4585',
    shades: ['Deep', 'Rich', 'Purple', 'Dark', 'Wine', 'Burgundy', 'Grape', 'Eggplant', 'Mauve', 'Violet'],
  },
  {
    name: 'Raspberry',
    baseHex: '#E30B5C',
    shades: ['Pink', 'Red', 'Bright', 'Deep', 'Berry', 'Cherry', 'Crimson', 'Rose', 'Magenta', 'Fuchsia'],
  },
  {
    name: 'Rose',
    baseHex: '#FF007F',
    shades: ['Pink', 'Deep', 'Bright', 'Pale', 'Blush', 'Coral', 'Salmon', 'Cherry', 'Berry', 'Magenta'],
  },
  {
    name: 'Sienna',
    baseHex: '#A0522D',
    shades: ['Burnt', 'Raw', 'Deep', 'Rich', 'Brown', 'Tan', 'Copper', 'Rust', 'Terracotta', 'Clay'],
  },
  {
    name: 'Sky Blue',
    baseHex: '#87CEEB',
    shades: ['Light', 'Bright', 'Pale', 'Azure', 'Baby', 'Powder', 'Cornflower', 'Steel', 'Royal', 'Navy'],
  },
  {
    name: 'Slate',
    baseHex: '#708090',
    shades: ['Gray', 'Dark', 'Light', 'Blue', 'Green', 'Purple', 'Charcoal', 'Ash', 'Stone', 'Pebble'],
  },
  {
    name: 'Tan',
    baseHex: '#D2B48C',
    shades: ['Light', 'Dark', 'Beige', 'Khaki', 'Sand', 'Camel', 'Buff', 'Taupe', 'Ecru', 'Wheat'],
  },
  {
    name: 'Taupe',
    baseHex: '#8B8589',
    shades: ['Light', 'Dark', 'Gray', 'Brown', 'Beige', 'Khaki', 'Taupe', 'Mushroom', 'Greige', 'Stone'],
  },
  {
    name: 'Teal',
    baseHex: '#008080',
    shades: ['Dark', 'Light', 'Bright', 'Deep', 'Turquoise', 'Cyan', 'Aqua', 'Ocean', 'Marine', 'Lagoon'],
  },
  {
    name: 'Terracotta',
    baseHex: '#E2725B',
    shades: ['Deep', 'Rich', 'Rust', 'Clay', 'Orange', 'Coral', 'Burnt', 'Sienna', 'Copper', 'Brick'],
  },
  {
    name: 'Thistle',
    baseHex: '#D8BFD8',
    shades: ['Pale', 'Deep', 'Purple', 'Lavender', 'Mauve', 'Lilac', 'Wisteria', 'Orchid', 'Violet', 'Periwinkle'],
  },
  {
    name: 'Tomato',
    baseHex: '#FF6347',
    shades: ['Red', 'Bright', 'Deep', 'Coral', 'Orange', 'Vermillion', 'Scarlet', 'Crimson', 'Fire', 'Flame'],
  },
  {
    name: 'Wheat',
    baseHex: '#F5DEB3',
    shades: ['Light', 'Golden', 'Pale', 'Beige', 'Cream', 'Tan', 'Khaki', 'Buff', 'Ecru', 'Blonde'],
  },
  {
    name: 'Wisteria',
    baseHex: '#C9A0DC',
    shades: ['Pale', 'Deep', 'Purple', 'Lavender', 'Mauve', 'Lilac', 'Orchid', 'Violet', 'Periwinkle', 'Thistle'],
  },
  {
    name: 'Zaffre',
    baseHex: '#0014A8',
    shades: ['Deep', 'Royal', 'Navy', 'Cobalt', 'Sapphire', 'Indigo', 'Midnight', 'Steel', 'Ocean', 'Azure'],
  },
  {
    name: 'Amaranth',
    baseHex: '#E52B50',
    shades: ['Pink', 'Red', 'Deep', 'Bright', 'Rose', 'Crimson', 'Cherry', 'Berry', 'Magenta', 'Fuchsia'],
  },
  {
    name: 'Apricot',
    baseHex: '#FBCEB1',
    shades: ['Light', 'Peach', 'Orange', 'Coral', 'Salmon', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Warm'],
  },
  {
    name: 'Aqua',
    baseHex: '#00FFFF',
    shades: ['Bright', 'Cyan', 'Turquoise', 'Electric', 'Neon', 'Sky', 'Ocean', 'Azure', 'Marine', 'Lagoon'],
  },
  {
    name: 'Bisque',
    baseHex: '#FFE4C4',
    shades: ['Light', 'Cream', 'Ivory', 'Beige', 'Tan', 'Khaki', 'Sand', 'Wheat', 'Blonde', 'Vanilla'],
  },
  {
    name: 'Brick',
    baseHex: '#B22222',
    shades: ['Red', 'Deep', 'Dark', 'Rust', 'Terracotta', 'Burnt', 'Sienna', 'Copper', 'Clay', 'Crimson'],
  },
  {
    name: 'Burnt Orange',
    baseHex: '#CC5500',
    shades: ['Deep', 'Rich', 'Rust', 'Copper', 'Terracotta', 'Sienna', 'Amber', 'Tangerine', 'Pumpkin', 'Autumn'],
  },
  {
    name: 'Cadet Blue',
    baseHex: '#5F9EA0',
    shades: ['Gray', 'Steel', 'Slate', 'Navy', 'Teal', 'Cyan', 'Ocean', 'Marine', 'Horizon', 'Sky'],
  },
  {
    name: 'Champagne',
    baseHex: '#F7E7CE',
    shades: ['Light', 'Golden', 'Cream', 'Ivory', 'Beige', 'Blonde', 'Wheat', 'Vanilla', 'Pearl', 'Linen'],
  },
  {
    name: 'Dark Green',
    baseHex: '#006400',
    shades: ['Forest', 'Deep', 'Rich', 'Jade', 'Emerald', 'Olive', 'Moss', 'Pine', 'Hunter', 'Jungle'],
  },
  {
    name: 'Dark Red',
    baseHex: '#8B0000',
    shades: ['Deep', 'Rich', 'Burgundy', 'Maroon', 'Wine', 'Oxblood', 'Garnet', 'Crimson', 'Ruby', 'Mahogany'],
  },
  {
    name: 'Deep Pink',
    baseHex: '#FF1493',
    shades: ['Hot', 'Bright', 'Vibrant', 'Magenta', 'Fuchsia', 'Rose', 'Cherry', 'Berry', 'Raspberry', 'Crimson'],
  },
  {
    name: 'Dodger Blue',
    baseHex: '#1E90FF',
    shades: ['Bright', 'Sky', 'Azure', 'Royal', 'Navy', 'Steel', 'Ocean', 'Horizon', 'Electric', 'Neon'],
  },
  {
    name: 'Firebrick',
    baseHex: '#B22222',
    shades: ['Red', 'Deep', 'Dark', 'Brick', 'Rust', 'Crimson', 'Scarlet', 'Burnt', 'Terracotta', 'Copper'],
  },
  {
    name: 'Forest Green',
    baseHex: '#228B22',
    shades: ['Deep', 'Dark', 'Rich', 'Jade', 'Emerald', 'Olive', 'Moss', 'Pine', 'Hunter', 'Jungle'],
  },
  {
    name: 'Goldenrod',
    baseHex: '#DAA520',
    shades: ['Yellow', 'Gold', 'Amber', 'Honey', 'Butter', 'Sunshine', 'Warm', 'Radiant', 'Glowing', 'Luminous'],
  },
  {
    name: 'Hot Pink',
    baseHex: '#FF69B4',
    shades: ['Bright', 'Vibrant', 'Neon', 'Magenta', 'Fuchsia', 'Rose', 'Cherry', 'Berry', 'Raspberry', 'Electric'],
  },
  {
    name: 'Indian Red',
    baseHex: '#CD5C5C',
    shades: ['Coral', 'Salmon', 'Pink', 'Rose', 'Dusty', 'Terracotta', 'Brick', 'Rust', 'Copper', 'Burnt'],
  },
  {
    name: 'Lime Green',
    baseHex: '#32CD32',
    shades: ['Bright', 'Neon', 'Electric', 'Lime', 'Chartreuse', 'Yellow', 'Vibrant', 'Luminous', 'Radiant', 'Glowing'],
  },
  {
    name: 'Medium Blue',
    baseHex: '#0000CD',
    shades: ['Royal', 'Navy', 'Deep', 'Bright', 'Steel', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure'],
  },
  {
    name: 'Medium Purple',
    baseHex: '#9370DB',
    shades: ['Lavender', 'Mauve', 'Orchid', 'Violet', 'Lilac', 'Plum', 'Periwinkle', 'Wisteria', 'Thistle', 'Amethyst'],
  },
  {
    name: 'Midnight Blue',
    baseHex: '#191970',
    shades: ['Dark', 'Deep', 'Navy', 'Royal', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean', 'Abyss'],
  },
  {
    name: 'Misty Rose',
    baseHex: '#FFE4E1',
    shades: ['Pale', 'Light', 'Pink', 'Blush', 'Peach', 'Coral', 'Salmon', 'Rose', 'Dusty', 'Soft'],
  },
  {
    name: 'Navajo White',
    baseHex: '#FFDEAD',
    shades: ['Cream', 'Ivory', 'Beige', 'Tan', 'Khaki', 'Sand', 'Wheat', 'Blonde', 'Vanilla', 'Linen'],
  },
  {
    name: 'Olive Drab',
    baseHex: '#6B8E23',
    shades: ['Army', 'Forest', 'Moss', 'Sage', 'Jade', 'Hunter', 'Khaki', 'Olive', 'Fern', 'Jungle'],
  },
  {
    name: 'Orange Red',
    baseHex: '#FF4500',
    shades: ['Bright', 'Vibrant', 'Fire', 'Flame', 'Tangerine', 'Coral', 'Vermillion', 'Scarlet', 'Burnt', 'Rust'],
  },
  {
    name: 'Pale Green',
    baseHex: '#98FB98',
    shades: ['Light', 'Mint', 'Sage', 'Jade', 'Lime', 'Chartreuse', 'Spring', 'Fresh', 'Soft', 'Pastel'],
  },
  {
    name: 'Pale Turquoise',
    baseHex: '#AFEEEE',
    shades: ['Light', 'Bright', 'Aqua', 'Cyan', 'Sky', 'Ocean', 'Marine', 'Lagoon', 'Tropical', 'Fresh'],
  },
  {
    name: 'Pale Violet Red',
    baseHex: '#DB7093',
    shades: ['Pink', 'Rose', 'Salmon', 'Coral', 'Blush', 'Dusty', 'Mauve', 'Lavender', 'Soft', 'Pastel'],
  },
  {
    name: 'Papaya Whip',
    baseHex: '#FFEFD5',
    shades: ['Cream', 'Peach', 'Apricot', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Warm', 'Soft', 'Pastel'],
  },
  {
    name: 'Peach Puff',
    baseHex: '#FFDAB9',
    shades: ['Light', 'Peach', 'Apricot', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Coral', 'Salmon', 'Warm'],
  },
  {
    name: 'Peru',
    baseHex: '#CD853F',
    shades: ['Tan', 'Brown', 'Copper', 'Rust', 'Terracotta', 'Sienna', 'Burnt', 'Clay', 'Camel', 'Desert'],
  },
  {
    name: 'Powder Blue',
    baseHex: '#B0E0E6',
    shades: ['Light', 'Pale', 'Sky', 'Baby', 'Azure', 'Steel', 'Cornflower', 'Periwinkle', 'Soft', 'Pastel'],
  },
  {
    name: 'Rosy Brown',
    baseHex: '#BC8F8F',
    shades: ['Dusty', 'Muted', 'Rose', 'Pink', 'Blush', 'Salmon', 'Coral', 'Terracotta', 'Brick', 'Rust'],
  },
  {
    name: 'Royal Blue',
    baseHex: '#4169E1',
    shades: ['Bright', 'Deep', 'Navy', 'Steel', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'Saddle Brown',
    baseHex: '#8B4513',
    shades: ['Deep', 'Rich', 'Dark', 'Mahogany', 'Chestnut', 'Walnut', 'Oak', 'Leather', 'Cocoa', 'Mocha'],
  },
  {
    name: 'Sandy Brown',
    baseHex: '#F4A460',
    shades: ['Tan', 'Beige', 'Khaki', 'Sand', 'Camel', 'Desert', 'Stone', 'Taupe', 'Buff', 'Wheat'],
  },
  {
    name: 'Sea Green',
    baseHex: '#2E8B57',
    shades: ['Deep', 'Ocean', 'Marine', 'Teal', 'Turquoise', 'Cyan', 'Aqua', 'Lagoon', 'Tropical', 'Fresh'],
  },
  {
    name: 'Seashell',
    baseHex: '#FFF5EE',
    shades: ['Cream', 'Ivory', 'Pearl', 'Vanilla', 'Beige', 'Blonde', 'Wheat', 'Linen', 'Alabaster', 'Soft'],
  },
  {
    name: 'Spring Green',
    baseHex: '#00FF7F',
    shades: ['Bright', 'Fresh', 'Lime', 'Mint', 'Emerald', 'Jade', 'Chartreuse', 'Vibrant', 'Luminous', 'Radiant'],
  },
  {
    name: 'Steel Blue',
    baseHex: '#4682B4',
    shades: ['Deep', 'Rich', 'Navy', 'Royal', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'Slate Gray',
    baseHex: '#708090',
    shades: ['Dark', 'Light', 'Blue', 'Green', 'Purple', 'Charcoal', 'Ash', 'Stone', 'Pebble', 'Smoky'],
  },
  {
    name: 'White Smoke',
    baseHex: '#F5F5F5',
    shades: ['Light', 'Pale', 'Gray', 'Silver', 'Cloud', 'Mist', 'Frost', 'Pearl', 'Ivory', 'Alabaster'],
  },
  {
    name: 'Yellow Green',
    baseHex: '#9ACD32',
    shades: ['Lime', 'Chartreuse', 'Spring', 'Fresh', 'Vibrant', 'Luminous', 'Radiant', 'Glowing', 'Electric', 'Neon'],
  },
  {
    name: 'Turquoise',
    baseHex: '#40E0D0',
    shades: ['Caribbean', 'Tropical', 'Lagoon', 'Mint Blue', 'Aqua Fresh', 'Cyan Bright', 'Pool', 'Oceanic', 'Breeze', 'Splash'],
  },
  {
    name: 'Crimson',
    baseHex: '#DC143C',
    shades: ['Deep', 'Bright', 'Dark', 'Pale', 'Rose', 'Scarlet', 'Ruby', 'Cherry', 'Berry', 'Wine'],
  },
  {
    name: 'Teal',
    baseHex: '#008080',
    shades: ['Dark', 'Light', 'Bright', 'Deep', 'Turquoise', 'Cyan', 'Aqua', 'Ocean', 'Marine', 'Lagoon'],
  },
  {
    name: 'Maroon',
    baseHex: '#800000',
    shades: ['Deep', 'Dark', 'Rich', 'Burgundy', 'Wine', 'Oxblood', 'Garnet', 'Crimson', 'Ruby', 'Mahogany'],
  },
  {
    name: 'Navy',
    baseHex: '#000080',
    shades: ['Royal', 'Midnight', 'Deep', 'Dark', 'Bright', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean'],
  },
  {
    name: 'Cyan',
    baseHex: '#00FFFF',
    shades: ['Bright', 'Deep', 'Pale', 'Aqua', 'Turquoise', 'Electric', 'Neon', 'Sky', 'Ocean', 'Azure'],
  },
  {
    name: 'Copper',
    baseHex: '#B87333',
    shades: ['Smelt', 'Foundry', 'Old Coin', 'Oxidize', 'Glowforge', 'Vintage Alloy', 'Molten', 'Furnace', 'Signet', 'Smith'],
  },
  {
    name: 'Rose',
    baseHex: '#FF007F',
    shades: ['Pink', 'Deep', 'Bright', 'Pale', 'Blush', 'Coral', 'Salmon', 'Cherry', 'Berry', 'Magenta'],
  },
  {
    name: 'Aqua',
    baseHex: '#00FFFF',
    shades: ['Bright', 'Cyan', 'Turquoise', 'Electric', 'Neon', 'Sky', 'Ocean', 'Azure', 'Marine', 'Lagoon'],
  },
  {
    name: 'Salmon',
    baseHex: '#FA8072',
    shades: ['Pink', 'Coral', 'Peach', 'Light', 'Dark', 'Smoked', 'Wild', 'Atlantic', 'Pacific', 'Sockeye'],
  },
  {
    name: 'Khaki',
    baseHex: '#C3B091',
    shades: ['Light', 'Dark', 'Olive', 'Tan', 'Beige', 'Sand', 'Taupe', 'Camel', 'Desert', 'Stone'],
  },
  {
    name: 'Plum',
    baseHex: '#8E4585',
    shades: ['Deep', 'Rich', 'Purple', 'Dark', 'Wine', 'Burgundy', 'Grape', 'Eggplant', 'Mauve', 'Violet'],
  },
  {
    name: 'Orchid',
    baseHex: '#DA70D6',
    shades: ['Pale', 'Deep', 'Purple', 'Pink', 'Lavender', 'Mauve', 'Violet', 'Fuchsia', 'Magenta', 'Plum'],
  },
  {
    name: 'Periwinkle',
    baseHex: '#CCCCFF',
    shades: ['Pale', 'Deep', 'Blue', 'Lavender', 'Purple', 'Violet', 'Lilac', 'Wisteria', 'Thistle', 'Orchid'],
  },
  {
    name: 'Thistle',
    baseHex: '#D8BFD8',
    shades: ['Pale', 'Deep', 'Purple', 'Lavender', 'Mauve', 'Lilac', 'Wisteria', 'Orchid', 'Violet', 'Periwinkle'],
  },
  {
    name: 'Wisteria',
    baseHex: '#C9A0DC',
    shades: ['Pale', 'Deep', 'Purple', 'Lavender', 'Mauve', 'Lilac', 'Orchid', 'Violet', 'Periwinkle', 'Thistle'],
  },
  {
    name: 'Amaranth',
    baseHex: '#E52B50',
    shades: ['Pink', 'Red', 'Deep', 'Bright', 'Rose', 'Crimson', 'Cherry', 'Berry', 'Magenta', 'Fuchsia'],
  },
  {
    name: 'Apricot',
    baseHex: '#FBCEB1',
    shades: ['Light', 'Peach', 'Orange', 'Coral', 'Salmon', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Warm'],
  },
  {
    name: 'Bisque',
    baseHex: '#FFE4C4',
    shades: ['Light', 'Cream', 'Ivory', 'Beige', 'Tan', 'Khaki', 'Sand', 'Wheat', 'Blonde', 'Vanilla'],
  },
  {
    name: 'Brick',
    baseHex: '#B22222',
    shades: ['Red', 'Deep', 'Dark', 'Rust', 'Terracotta', 'Burnt', 'Sienna', 'Copper', 'Clay', 'Crimson'],
  },
  {
    name: 'Burnt Orange',
    baseHex: '#CC5500',
    shades: ['Deep', 'Rich', 'Rust', 'Copper', 'Terracotta', 'Sienna', 'Amber', 'Tangerine', 'Pumpkin', 'Autumn'],
  },
  {
    name: 'Cadet Blue',
    baseHex: '#5F9EA0',
    shades: ['Gray', 'Steel', 'Slate', 'Navy', 'Teal', 'Cyan', 'Ocean', 'Marine', 'Horizon', 'Sky'],
  },
  {
    name: 'Champagne',
    baseHex: '#F7E7CE',
    shades: ['Light', 'Golden', 'Cream', 'Ivory', 'Beige', 'Blonde', 'Wheat', 'Vanilla', 'Pearl', 'Linen'],
  },
  {
    name: 'Chartreuse',
    baseHex: '#DFFF00',
    shades: ['Yellow', 'Green', 'Lime', 'Neon', 'Electric', 'Bright', 'Vibrant', 'Luminous', 'Radiant', 'Glowing'],
  },
  {
    name: 'Cobalt Blue',
    baseHex: '#0047AB',
    shades: ['Deep', 'Royal', 'Navy', 'Sapphire', 'Indigo', 'Midnight', 'Steel', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'Cornflower',
    baseHex: '#6495ED',
    shades: ['Blue', 'Light', 'Bright', 'Sky', 'Azure', 'Royal', 'Steel', 'Powder', 'Baby', 'Periwinkle'],
  },
  {
    name: 'Dark Green',
    baseHex: '#006400',
    shades: ['Forest', 'Deep', 'Rich', 'Jade', 'Emerald', 'Olive', 'Moss', 'Pine', 'Hunter', 'Jungle'],
  },
  {
    name: 'Deep Pink',
    baseHex: '#FF1493',
    shades: ['Hot', 'Bright', 'Vibrant', 'Magenta', 'Fuchsia', 'Rose', 'Cherry', 'Berry', 'Raspberry', 'Crimson'],
  },
  {
    name: 'Dodger Blue',
    baseHex: '#1E90FF',
    shades: ['Bright', 'Sky', 'Azure', 'Royal', 'Navy', 'Steel', 'Ocean', 'Horizon', 'Electric', 'Neon'],
  },
  {
    name: 'Firebrick',
    baseHex: '#B22222',
    shades: ['Red', 'Deep', 'Dark', 'Brick', 'Rust', 'Crimson', 'Scarlet', 'Burnt', 'Terracotta', 'Copper'],
  },
  {
    name: 'Forest Green',
    baseHex: '#228B22',
    shades: ['Deep', 'Dark', 'Rich', 'Jade', 'Emerald', 'Olive', 'Moss', 'Pine', 'Hunter', 'Jungle'],
  },
  {
    name: 'Goldenrod',
    baseHex: '#DAA520',
    shades: ['Yellow', 'Gold', 'Amber', 'Honey', 'Butter', 'Sunshine', 'Warm', 'Radiant', 'Glowing', 'Luminous'],
  },
  {
    name: 'Hot Pink',
    baseHex: '#FF69B4',
    shades: ['Bright', 'Vibrant', 'Neon', 'Magenta', 'Fuchsia', 'Rose', 'Cherry', 'Berry', 'Raspberry', 'Electric'],
  },
  {
    name: 'Indian Red',
    baseHex: '#CD5C5C',
    shades: ['Coral', 'Salmon', 'Pink', 'Rose', 'Dusty', 'Terracotta', 'Brick', 'Rust', 'Copper', 'Burnt'],
  },
  {
    name: 'Lime Green',
    baseHex: '#32CD32',
    shades: ['Bright', 'Neon', 'Electric', 'Lime', 'Chartreuse', 'Yellow', 'Vibrant', 'Luminous', 'Radiant', 'Glowing'],
  },
  {
    name: 'Medium Blue',
    baseHex: '#0000CD',
    shades: ['Royal', 'Navy', 'Deep', 'Bright', 'Steel', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure'],
  },
  {
    name: 'Medium Purple',
    baseHex: '#9370DB',
    shades: ['Lavender', 'Mauve', 'Orchid', 'Violet', 'Lilac', 'Plum', 'Periwinkle', 'Wisteria', 'Thistle', 'Amethyst'],
  },
  {
    name: 'Midnight Blue',
    baseHex: '#191970',
    shades: ['Dark', 'Deep', 'Navy', 'Royal', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean', 'Abyss'],
  },
  {
    name: 'Misty Rose',
    baseHex: '#FFE4E1',
    shades: ['Pale', 'Light', 'Pink', 'Blush', 'Peach', 'Coral', 'Salmon', 'Rose', 'Dusty', 'Soft'],
  },
  {
    name: 'Navajo White',
    baseHex: '#FFDEAD',
    shades: ['Cream', 'Ivory', 'Beige', 'Tan', 'Khaki', 'Sand', 'Wheat', 'Blonde', 'Vanilla', 'Linen'],
  },
  {
    name: 'Olive Drab',
    baseHex: '#6B8E23',
    shades: ['Army', 'Forest', 'Moss', 'Sage', 'Jade', 'Hunter', 'Khaki', 'Olive', 'Fern', 'Jungle'],
  },
  {
    name: 'Orange Red',
    baseHex: '#FF4500',
    shades: ['Bright', 'Vibrant', 'Fire', 'Flame', 'Tangerine', 'Coral', 'Vermillion', 'Scarlet', 'Burnt', 'Rust'],
  },
  {
    name: 'Pale Green',
    baseHex: '#98FB98',
    shades: ['Light', 'Mint', 'Sage', 'Jade', 'Lime', 'Chartreuse', 'Spring', 'Fresh', 'Soft', 'Pastel'],
  },
  {
    name: 'Pale Turquoise',
    baseHex: '#AFEEEE',
    shades: ['Light', 'Bright', 'Aqua', 'Cyan', 'Sky', 'Ocean', 'Marine', 'Lagoon', 'Tropical', 'Fresh'],
  },
  {
    name: 'Pale Violet Red',
    baseHex: '#DB7093',
    shades: ['Pink', 'Rose', 'Salmon', 'Coral', 'Blush', 'Dusty', 'Mauve', 'Lavender', 'Soft', 'Pastel'],
  },
  {
    name: 'Papaya Whip',
    baseHex: '#FFEFD5',
    shades: ['Cream', 'Peach', 'Apricot', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Warm', 'Soft', 'Pastel'],
  },
  {
    name: 'Peach Puff',
    baseHex: '#FFDAB9',
    shades: ['Light', 'Peach', 'Apricot', 'Melon', 'Cantaloupe', 'Nectar', 'Blush', 'Coral', 'Salmon', 'Warm'],
  },
  {
    name: 'Peru',
    baseHex: '#CD853F',
    shades: ['Tan', 'Brown', 'Copper', 'Rust', 'Terracotta', 'Sienna', 'Burnt', 'Clay', 'Camel', 'Desert'],
  },
  {
    name: 'Powder Blue',
    baseHex: '#B0E0E6',
    shades: ['Light', 'Pale', 'Sky', 'Baby', 'Azure', 'Steel', 'Cornflower', 'Periwinkle', 'Soft', 'Pastel'],
  },
  {
    name: 'Rosy Brown',
    baseHex: '#BC8F8F',
    shades: ['Dusty', 'Muted', 'Rose', 'Pink', 'Blush', 'Salmon', 'Coral', 'Terracotta', 'Brick', 'Rust'],
  },
  {
    name: 'Royal Blue',
    baseHex: '#4169E1',
    shades: ['Bright', 'Deep', 'Navy', 'Steel', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'Saddle Brown',
    baseHex: '#8B4513',
    shades: ['Deep', 'Rich', 'Dark', 'Mahogany', 'Chestnut', 'Walnut', 'Oak', 'Leather', 'Cocoa', 'Mocha'],
  },
  {
    name: 'Sandy Brown',
    baseHex: '#F4A460',
    shades: ['Tan', 'Beige', 'Khaki', 'Sand', 'Camel', 'Desert', 'Stone', 'Taupe', 'Buff', 'Wheat'],
  },
  {
    name: 'Sea Green',
    baseHex: '#2E8B57',
    shades: ['Deep', 'Ocean', 'Marine', 'Teal', 'Turquoise', 'Cyan', 'Aqua', 'Lagoon', 'Tropical', 'Fresh'],
  },
  {
    name: 'Seashell',
    baseHex: '#FFF5EE',
    shades: ['Cream', 'Ivory', 'Pearl', 'Vanilla', 'Beige', 'Blonde', 'Wheat', 'Linen', 'Alabaster', 'Soft'],
  },
  {
    name: 'Spring Green',
    baseHex: '#00FF7F',
    shades: ['Bright', 'Fresh', 'Lime', 'Mint', 'Emerald', 'Jade', 'Chartreuse', 'Vibrant', 'Luminous', 'Radiant'],
  },
  {
    name: 'Steel Blue',
    baseHex: '#4682B4',
    shades: ['Deep', 'Rich', 'Navy', 'Royal', 'Sapphire', 'Cobalt', 'Indigo', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'White Smoke',
    baseHex: '#F5F5F5',
    shades: ['Light', 'Pale', 'Gray', 'Silver', 'Cloud', 'Mist', 'Frost', 'Pearl', 'Ivory', 'Alabaster'],
  },
  {
    name: 'Burgundy',
    baseHex: '#800020',
    shades: ['Deep', 'Rich', 'Wine', 'Maroon', 'Oxblood', 'Garnet', 'Merlot', 'Bordeaux', 'Cabernet', 'Claret'],
  },
  {
    name: 'Charcoal',
    baseHex: '#36454F',
    shades: ['Dark', 'Light', 'Deep', 'Smoky', 'Ash', 'Graphite', 'Slate', 'Coal', 'Soot', 'Ebony'],
  },
  {
    name: 'Garnet',
    baseHex: '#733C2C',
    shades: ['Deep', 'Rich', 'Dark', 'Ruby', 'Burgundy', 'Wine', 'Mahogany', 'Oxblood', 'Crimson', 'Maroon'],
  },
  {
    name: 'Honey',
    baseHex: '#FFC30B',
    shades: ['Golden', 'Light', 'Dark', 'Amber', 'Butter', 'Sunshine', 'Warm', 'Radiant', 'Glowing', 'Luminous'],
  },
  {
    name: 'Mahogany',
    baseHex: '#C04000',
    shades: ['Rich', 'Deep', 'Dark', 'Red', 'Brown', 'Chestnut', 'Walnut', 'Oak', 'Rosewood', 'Cedar'],
  },
  {
    name: 'Navy Blue',
    baseHex: '#000080',
    shades: ['Royal', 'Midnight', 'Deep', 'Dark', 'Bright', 'Steel', 'Indigo', 'Cobalt', 'Sapphire', 'Ocean'],
  },
  {
    name: 'Olive Green',
    baseHex: '#808000',
    shades: ['Dark', 'Light', 'Drab', 'Army', 'Forest', 'Sage', 'Moss', 'Khaki', 'Jade', 'Fern'],
  },
  {
    name: 'Raspberry',
    baseHex: '#E30B5C',
    shades: ['Pink', 'Red', 'Bright', 'Deep', 'Berry', 'Cherry', 'Crimson', 'Rose', 'Magenta', 'Fuchsia'],
  },
  {
    name: 'Sienna',
    baseHex: '#A0522D',
    shades: ['Burnt', 'Raw', 'Deep', 'Rich', 'Brown', 'Tan', 'Copper', 'Rust', 'Terracotta', 'Clay'],
  },
  {
    name: 'Sky Blue',
    baseHex: '#87CEEB',
    shades: ['Light', 'Bright', 'Pale', 'Azure', 'Baby', 'Powder', 'Cornflower', 'Steel', 'Royal', 'Navy'],
  },
  {
    name: 'Slate',
    baseHex: '#708090',
    shades: ['Gray', 'Dark', 'Light', 'Blue', 'Green', 'Purple', 'Charcoal', 'Ash', 'Stone', 'Pebble'],
  },
  {
    name: 'Terracotta',
    baseHex: '#E2725B',
    shades: ['Deep', 'Rich', 'Rust', 'Clay', 'Orange', 'Coral', 'Burnt', 'Sienna', 'Copper', 'Brick'],
  },
  {
    name: 'Tomato',
    baseHex: '#FF6347',
    shades: ['Red', 'Bright', 'Deep', 'Coral', 'Orange', 'Vermillion', 'Scarlet', 'Crimson', 'Fire', 'Flame'],
  },
  {
    name: 'Wheat',
    baseHex: '#F5DEB3',
    shades: ['Light', 'Golden', 'Pale', 'Beige', 'Cream', 'Tan', 'Khaki', 'Buff', 'Ecru', 'Blonde'],
  },
  {
    name: 'Zaffre',
    baseHex: '#0014A8',
    shades: ['Deep', 'Royal', 'Navy', 'Cobalt', 'Sapphire', 'Indigo', 'Midnight', 'Steel', 'Ocean', 'Azure'],
  },
  {
    name: 'Amaranth',
    baseHex: '#E52B50',
    shades: ['Pink', 'Red', 'Deep', 'Bright', 'Rose', 'Crimson', 'Cherry', 'Berry', 'Magenta', 'Fuchsia'],
  },
  {
    name: 'Aqua',
    baseHex: '#00FFFF',
    shades: ['Bright', 'Cyan', 'Turquoise', 'Electric', 'Neon', 'Sky', 'Ocean', 'Azure', 'Marine', 'Lagoon'],
  },
  {
    name: 'Bisque',
    baseHex: '#FFE4C4',
    shades: ['Light', 'Cream', 'Ivory', 'Beige', 'Tan', 'Khaki', 'Sand', 'Wheat', 'Blonde', 'Vanilla'],
  },
  {
    name: 'Brick',
    baseHex: '#B22222',
    shades: ['Red', 'Deep', 'Dark', 'Rust', 'Terracotta', 'Burnt', 'Sienna', 'Copper', 'Clay', 'Crimson'],
  },
  {
    name: 'Burnt Orange',
    baseHex: '#CC5500',
    shades: ['Deep', 'Rich', 'Rust', 'Copper', 'Terracotta', 'Sienna', 'Amber', 'Tangerine', 'Pumpkin', 'Autumn'],
  },
  {
    name: 'Cadet Blue',
    baseHex: '#5F9EA0',
    shades: ['Gray', 'Steel', 'Slate', 'Navy', 'Teal', 'Cyan', 'Ocean', 'Marine', 'Horizon', 'Sky'],
  },
  {
    name: 'Chartreuse',
    baseHex: '#DFFF00',
    shades: ['Yellow', 'Green', 'Lime', 'Neon', 'Electric', 'Bright', 'Vibrant', 'Luminous', 'Radiant', 'Glowing'],
  },
  {
    name: 'Cobalt Blue',
    baseHex: '#0047AB',
    shades: ['Deep', 'Royal', 'Navy', 'Sapphire', 'Indigo', 'Midnight', 'Steel', 'Ocean', 'Azure', 'Horizon'],
  },
  {
    name: 'Cornflower',
    baseHex: '#6495ED',
    shades: ['Blue', 'Light', 'Bright', 'Sky', 'Azure', 'Royal', 'Steel', 'Powder', 'Baby', 'Periwinkle'],
  },
  {
    name: 'Dark Green',
    baseHex: '#006400',
    shades: ['Forest', 'Deep', 'Rich', 'Jade', 'Emerald', 'Olive', 'Moss', 'Pine', 'Hunter', 'Jungle'],
  },
];

export const generateShades = (baseHex, shadeNames, desiredCount = 360) => {
  const total = Math.max(desiredCount, shadeNames.length);
  const perShade = Math.ceil(total / shadeNames.length);
  const baseHsl = hexToHsl(baseHex);
  const shades = [];
  const seen = new Set();

  shadeNames.forEach((shadeName, shadeIndex) => {
    const shadeOffset = shadeIndex - (shadeNames.length - 1) / 2;
    for (let variantIndex = 0; variantIndex < perShade && shades.length < total; variantIndex += 1) {
      const ratio = perShade === 1 ? 0 : (variantIndex / (perShade - 1)) - 0.5;

      const hueShift = shadeOffset * 3 + ratio * 24;
      const saturationShift = shadeOffset * -2 + ratio * 18;
      const lightShift = shadeOffset * -3 + ratio * -40;

      const variantHsl = {
        h: (baseHsl.h + hueShift + 360) % 360,
        s: clamp(baseHsl.s + saturationShift, 18, 98),
        l: clamp(baseHsl.l + lightShift, 8, 92),
      };

      const hex = variantIndex === 0
        ? hslToHex({
          h: (variantHsl.h + 360) % 360,
          s: clamp(baseHsl.s + shadeOffset * 4, 20, 95),
          l: clamp(baseHsl.l + shadeOffset * -4, 10, 90),
        })
        : hslToHex(variantHsl);

      if (seen.has(hex)) {
        continue;
      }
      seen.add(hex);

      let label = shadeName;
      if (variantIndex > 0) {
        const suffix = shadeSuffixes[(variantIndex - 1) % shadeSuffixes.length];
        const tier = Math.floor((variantIndex - 1) / shadeSuffixes.length) + 1;
        label = `${shadeName} ${suffix}${tier > 1 ? ` ${tier}` : ''}`;
      }

      shades.push({ name: label, hex });
    }
  });

  return shades;
};

export const buildColorUniverse = (countPerFamily = 280) =>
  mainColors.reduce((acc, family) => {
    acc[family.name] = generateShades(family.baseHex, family.shades, countPerFamily);
    return acc;
  }, {});

export const shiftHexColor = (hex, shifts) => {
  const { h = 0, s = 0, l = 0 } = shifts;
  const hsl = hexToHsl(hex);
  return hslToHex({
    h: (hsl.h + h + 360) % 360,
    s: clamp(hsl.s + s, 0, 100),
    l: clamp(hsl.l + l, 0, 100),
  });
};



