import * as THREE from './threen.js';
import { PLANETARY_QUADRANTS, EARTH_CONTINENT_POLYGONS, getExpeditionsForWorld } from './constellations_data.js';

// Convert Johnson B-V color index to effective temperature (Ballesteros 2012)
export function bvToTeff(bv) {
  const clamped = Math.max(-0.4, Math.min(2.2, Number.isFinite(bv) ? bv : 0.65));
  return 4600 * (1 / (0.92 * clamped + 1.7) + 1 / (0.92 * clamped + 0.62));
}

// Convert Effective Temperature (Kelvin) to realistic Planckian Blackbody RGB
export function teffToColor(teff) {
  const temp = Math.max(1500, Math.min(40000, teff || 5778)) / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    if (temp <= 19) {
      b = 0;
    } else {
      b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    }
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }

  return new THREE.Color(
    Math.max(0, Math.min(255, r)) / 255,
    Math.max(0, Math.min(255, g)) / 255,
    Math.max(0, Math.min(255, b)) / 255
  );
}

export function bvToColor(bv) {
  return teffToColor(bvToTeff(bv));
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

// Cached Equirectangular Earth Continent Texture (2048x1024)
let cachedEarthTexture = null;

export function getEarthContinentTexture() {
  if (cachedEarthTexture) return cachedEarthTexture;

  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Deep bathymetric ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0.0, '#1e3a5f');
  oceanGrad.addColorStop(0.15, '#0f3870');
  oceanGrad.addColorStop(0.5, '#0b4a8c');
  oceanGrad.addColorStop(0.85, '#0f3870');
  oceanGrad.addColorStop(1.0, '#1e3a5f');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  const lonToX = lon => ((lon + 180) / 360) * width;
  const latToY = lat => ((90 - lat) / 180) * height;

  // 2. Draw shallow continental shelf glow around each continent polygon
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  EARTH_CONTINENT_POLYGONS.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lon, lat], i) => {
      const x = lonToX(lon);
      const y = latToY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(38, 130, 195, 0.45)';
    ctx.lineWidth = 22;
    ctx.stroke();
  });
  ctx.restore();

  // 3. Fill Continents with biome colors
  EARTH_CONTINENT_POLYGONS.forEach(poly => {
    ctx.beginPath();
    poly.points.forEach(([lon, lat], i) => {
      const x = lonToX(lon);
      const y = latToY(lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    if (poly.biome === 'ice') {
      ctx.fillStyle = '#e6f2fa';
    } else if (poly.biome === 'arid_tropical') {
      const g = ctx.createLinearGradient(0, latToY(35), 0, latToY(-35));
      g.addColorStop(0.0, '#c8a464'); // Sahara / Arid North
      g.addColorStop(0.45, '#2f7d3d'); // Equatorial Tropical Belt
      g.addColorStop(0.85, '#b8864b'); // Kalahari / Outback
      g.addColorStop(1.0, '#3a7d44');
      ctx.fillStyle = g;
    } else if (poly.biome === 'tropical') {
      ctx.fillStyle = '#2d8242';
    } else {
      const g = ctx.createLinearGradient(0, latToY(75), 0, latToY(10));
      g.addColorStop(0.0, '#9ab39f'); // Boreal / Tundra
      g.addColorStop(0.35, '#357e46'); // Temperate Forest
      g.addColorStop(0.75, '#769148'); // Steppe / Plains
      g.addColorStop(1.0, '#2e7d3b');
      ctx.fillStyle = g;
    }
    ctx.fill();

    // Crisp coastline outline for orientation clarity
    ctx.strokeStyle = 'rgba(180, 225, 190, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });

  // 4. Add major desert & mountain highland accents (Arabia, Gobi, Tibetan Plateau, Andes, Rockies)
  const biomeHighlights = [
    { lon: 20, lat: 23, rx: 110, ry: 42, color: 'rgba(214, 174, 102, 0.65)' }, // Sahara
    { lon: 46, lat: 24, rx: 45, ry: 30, color: 'rgba(214, 174, 102, 0.65)' },  // Arabia
    { lon: 88, lat: 33, rx: 65, ry: 28, color: 'rgba(185, 170, 150, 0.65)' },  // Tibet/Himalayas
    { lon: 134, lat: -25, rx: 55, ry: 30, color: 'rgba(205, 133, 63, 0.6)' },  // Australian Outback
    { lon: -112, lat: 40, rx: 40, ry: 45, color: 'rgba(170, 145, 110, 0.5)' }  // Rockies / SW US
  ];
  biomeHighlights.forEach(b => {
    const cx = lonToX(b.lon);
    const cy = latToY(b.lat);
    const rad = Math.max(b.rx, b.ry);
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, b.rx, b.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Subtle geographic continent names for quick user orientation across quadrants
  ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
  ctx.textAlign = 'center';
  const labels = [
    { text: 'NORTH AMERICA', lon: -100, lat: 45 },
    { text: 'SOUTH AMERICA', lon: -60, lat: -18 },
    { text: 'EUROPE', lon: 16, lat: 50 },
    { text: 'AFRICA', lon: 20, lat: 8 },
    { text: 'ASIA', lon: 95, lat: 50 },
    { text: 'INDIA', lon: 78, lat: 21 },
    { text: 'AUSTRALIA', lon: 135, lat: -25 }
  ];
  labels.forEach(l => {
    ctx.fillText(l.text, lonToX(l.lon), latToY(l.lat));
  });

  cachedEarthTexture = new THREE.CanvasTexture(canvas);
  cachedEarthTexture.wrapS = THREE.RepeatWrapping;
  cachedEarthTexture.wrapT = THREE.ClampToEdgeWrapping;
  return cachedEarthTexture;
}

// Classify any Solar System Planet, Moon, Deep-Sky Object, or Exoplanet
export function classifyPlanet(planet) {
  const seed = hashString(planet.id || 'exo');

  // 0. Handle Curated Deep-Sky & Exotic Cosmic Objects (Black Holes, Galaxies, Nebulae, Pulsars, Clusters)
  if (planet.isDeepSky) {
    if (planet.deepSkyType === 'black_hole') {
      return {
        type: 'Black Hole · Relativistic Accretion System',
        category: 'black_hole',
        filterGroup: 'deep_sky',
        shaderMode: 1,
        useEarthMap: false,
        oblateness: 0.0,
        tidalStretch: 1.0,
        hasRings: true,
        seed,
        primaryColor: new THREE.Color(0x000000),
        secondaryColor: new THREE.Color(0xff5500),
        accentColor: new THREE.Color(0xffdd66),
        atmoColor: new THREE.Color(0xff6b00),
        emissiveColor: new THREE.Color(0xff4500),
        cloudOpacity: 0.0,
        description: planet.description || 'Event horizon surrounded by a gravitationally lensed photon ring and relativistic accretion disk.'
      };
    } else if (planet.deepSkyType === 'galaxy') {
      return {
        type: 'Deep Sky · Galactic System',
        category: 'galaxy',
        filterGroup: 'deep_sky',
        shaderMode: 3,
        useEarthMap: false,
        oblateness: 0.25,
        tidalStretch: 1.0,
        hasRings: false,
        seed,
        primaryColor: new THREE.Color(0x60a5fa),
        secondaryColor: new THREE.Color(0xfef08a),
        accentColor: new THREE.Color(0xf472b6),
        atmoColor: new THREE.Color(0x93c5fd),
        emissiveColor: new THREE.Color(0xfde047),
        cloudOpacity: 0.5,
        description: planet.description || 'Vast gravitationally bound galaxy of billions of stars, spiral dust lanes, and H-II star-forming regions.'
      };
    } else if (planet.deepSkyType === 'pulsar') {
      return {
        type: 'Neutron Star Pulsar & Supernova Remnant',
        category: 'pulsar',
        filterGroup: 'deep_sky',
        shaderMode: 4,
        useEarthMap: false,
        oblateness: 0.0,
        tidalStretch: 1.0,
        hasRings: false,
        seed,
        primaryColor: new THREE.Color(0x38bdf8),
        secondaryColor: new THREE.Color(0x818cf8),
        accentColor: new THREE.Color(0xffffff),
        atmoColor: new THREE.Color(0x38bdf8),
        emissiveColor: new THREE.Color(0x00ffff),
        cloudOpacity: 0.4,
        description: planet.description || 'Rapidly spinning, ultra-magnetized neutron star emitting twin relativistic radiation beams.'
      };
    } else if (planet.deepSkyType === 'cluster') {
      return {
        type: 'Deep Sky · Stellar Cluster',
        category: 'cluster',
        filterGroup: 'deep_sky',
        shaderMode: 3,
        useEarthMap: false,
        oblateness: 0.0,
        tidalStretch: 1.0,
        hasRings: false,
        seed,
        primaryColor: new THREE.Color(0x60a5fa),
        secondaryColor: new THREE.Color(0xfde047),
        accentColor: new THREE.Color(0xffffff),
        atmoColor: new THREE.Color(0x93c5fd),
        emissiveColor: new THREE.Color(0x60a5fa),
        cloudOpacity: 0.3,
        description: planet.description || 'Gravitationally bound star cluster.'
      };
    } else {
      return {
        type: 'Deep Sky · Ionized Emission Nebula',
        category: 'nebula',
        filterGroup: 'deep_sky',
        shaderMode: 3,
        useEarthMap: false,
        oblateness: 0.0,
        tidalStretch: 1.0,
        hasRings: false,
        seed,
        primaryColor: new THREE.Color(0xec4899),
        secondaryColor: new THREE.Color(0x06b6d4),
        accentColor: new THREE.Color(0xa855f7),
        atmoColor: new THREE.Color(0xf472b6),
        emissiveColor: new THREE.Color(0xec4899),
        cloudOpacity: 0.7,
        description: planet.description || 'Interstellar cloud of ionized hydrogen, oxygen, and sulfur illuminated by young hot stars.'
      };
    }
  }

  // 1. Handle Explicit Solar System Presets (Planets + Major Moons)
  if (planet.solarPreset) {
    switch (planet.solarPreset) {
      case 'earth':
        return {
          type: 'Earth · Temperate Ocean World (Home)',
          category: 'earth',
          filterGroup: 'solar_system',
          shaderMode: 0,
          useEarthMap: true,
          oblateness: 0.00335,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.42,
          primaryColor: new THREE.Color(0x0b4a8c),
          secondaryColor: new THREE.Color(0x2f7d3d),
          accentColor: new THREE.Color(0xd9b382),
          atmoColor: new THREE.Color(0x4da6ff),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.35,
          description: 'Home world with recognizable continents across all 8 quadrants, liquid oceans (71%), polar ice caps, and orbiting Moon (Luna).'
        };
      case 'moon':
        return {
          type: 'Earth Moon · Cratered Silicate Satellite',
          category: 'rocky_moon',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.001,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.19,
          primaryColor: new THREE.Color(0x9ca3af),
          secondaryColor: new THREE.Color(0x52525b),
          accentColor: new THREE.Color(0xd4d4d8),
          atmoColor: new THREE.Color(0x71717a),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.0,
          description: 'Earth\'s natural satellite (384,400 km from Earth) featuring dark basaltic lunar maria and bright anorthositic highlands.'
        };
      case 'mercury':
        return {
          type: 'Solar System · Sun-Scorched Terrestrial Planet',
          category: 'arid_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.0,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.11,
          primaryColor: new THREE.Color(0x8c8782),
          secondaryColor: new THREE.Color(0x57534e),
          accentColor: new THREE.Color(0xbab3ab),
          atmoColor: new THREE.Color(0xa8a29e),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.0,
          description: 'Innermost Solar System planet (0.39 AU from Sol) with a dense iron core and heavily cratered silicate crust.'
        };
      case 'venus':
        return {
          type: 'Solar System · Dense Sulfuric Greenhouse Planet',
          category: 'venusian',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.0,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.31,
          primaryColor: new THREE.Color(0xd99b4e),
          secondaryColor: new THREE.Color(0xf3d299),
          accentColor: new THREE.Color(0xa66321),
          atmoColor: new THREE.Color(0xfbbf24),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.85,
          description: 'Second planet from the Sun (737 K surface) blanketed in reflective golden-cream sulfuric acid cloud decks.'
        };
      case 'mars':
        return {
          type: 'Solar System · Iron-Oxide Terrestrial Planet',
          category: 'arid_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.006,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.58,
          primaryColor: new THREE.Color(0xc2542d),
          secondaryColor: new THREE.Color(0x6e2b17),
          accentColor: new THREE.Color(0xe69565),
          atmoColor: new THREE.Color(0xe07a47),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.15,
          description: 'The Red Planet (1.52 AU) featuring iron-oxide deserts, Valles Marineris canyons, polar ice caps, and moons Phobos & Deimos.'
        };
      case 'jupiter':
        return {
          type: 'Solar System · Ammonia Gas Giant (King of Planets)',
          category: 'gas_cold',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.0648,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.73,
          primaryColor: new THREE.Color(0xc98850),
          secondaryColor: new THREE.Color(0xf2dec4),
          accentColor: new THREE.Color(0xb84125),
          atmoColor: new THREE.Color(0xe0aa70),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.75,
          description: 'Largest Solar System planet (11.2 R⊕) with ammonia cloud belts, the Great Red Spot, and Galilean moons Io, Europa, Ganymede & Callisto.'
        };
      case 'saturn':
        return {
          type: 'Solar System · Ringed Ammonia Gas Giant',
          category: 'gas_cold',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.0979,
          tidalStretch: 1.0,
          hasRings: true,
          ringInner: 1.28,
          ringOuter: 2.45,
          seed: 0.84,
          primaryColor: new THREE.Color(0xd9b26f),
          secondaryColor: new THREE.Color(0xf5e1b5),
          accentColor: new THREE.Color(0xa67c38),
          atmoColor: new THREE.Color(0xe8c582),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.7,
          description: 'Second-largest Solar System planet (9.45 R⊕) famous for its expansive icy ring system and moons Titan & Enceladus.'
        };
      case 'uranus':
        return {
          type: 'Solar System · Methane Ice Giant',
          category: 'ice_giant',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.0229,
          tidalStretch: 1.0,
          hasRings: true,
          ringInner: 1.4,
          ringOuter: 1.85,
          seed: 0.44,
          primaryColor: new THREE.Color(0x63c5da),
          secondaryColor: new THREE.Color(0x9be2f2),
          accentColor: new THREE.Color(0x3ba3bd),
          atmoColor: new THREE.Color(0x67e8f9),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.5,
          description: 'Cyan-aquamarine ice giant (19.2 AU) with a methane-tinted hydrogen/helium atmosphere, faint rings, and moons Titania & Oberon.'
        };
      case 'neptune':
        return {
          type: 'Solar System · Deep Azure Ice Giant',
          category: 'ice_giant',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.0171,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.91,
          primaryColor: new THREE.Color(0x1e40af),
          secondaryColor: new THREE.Color(0x3b82f6),
          accentColor: new THREE.Color(0x93c5fd),
          atmoColor: new THREE.Color(0x2563eb),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.6,
          description: 'Outermost major planet (30.1 AU) with supersonic winds, deep cobalt-blue methane clouds, and retrograde moon Triton.'
        };
      case 'pluto':
        return {
          type: 'Solar System · Kuiper Belt Dwarf Planet',
          category: 'ice_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.0,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.66,
          primaryColor: new THREE.Color(0xbfa084),
          secondaryColor: new THREE.Color(0x734832),
          accentColor: new THREE.Color(0xf5ebe0),
          atmoColor: new THREE.Color(0x93c5fd),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.1,
          description: 'Dwarf planet (39.5 AU) featuring the bright Tombaugh Regio nitrogen-ice heart, reddish tholin plains, and binary companion Charon.'
        };
      case 'io':
        return {
          type: 'Galilean Moon · Volcanic Sulfur World (Jupiter)',
          category: 'lava',
          filterGroup: 'solar_system',
          shaderMode: 1,
          useEarthMap: false,
          oblateness: 0.004,
          tidalStretch: 1.02,
          hasRings: false,
          seed: 0.27,
          primaryColor: new THREE.Color(0xeab308),
          secondaryColor: new THREE.Color(0xca8a04),
          accentColor: new THREE.Color(0xdc2626),
          atmoColor: new THREE.Color(0xfef08a),
          emissiveColor: new THREE.Color(0xea580c),
          cloudOpacity: 0.1,
          description: 'Innermost Galilean moon of Jupiter, tidally heated into the most volcanically active body in the Solar System with sulfur plains.'
        };
      case 'europa':
        return {
          type: 'Galilean Moon · Subsurface Ocean Ice World (Jupiter)',
          category: 'ice_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.002,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.52,
          primaryColor: new THREE.Color(0xe2e8f0),
          secondaryColor: new THREE.Color(0x94a3b8),
          accentColor: new THREE.Color(0xb45309),
          atmoColor: new THREE.Color(0x7dd3fc),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.1,
          description: 'Icy moon of Jupiter criss-crossed by reddish-brown tectonic lineae over a global subsurface liquid water ocean.'
        };
      case 'titan':
        return {
          type: 'Saturnian Moon · Nitrogen-Methane Haze World',
          category: 'venusian',
          filterGroup: 'solar_system',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.001,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.39,
          primaryColor: new THREE.Color(0xd97706),
          secondaryColor: new THREE.Color(0xf59e0b),
          accentColor: new THREE.Color(0x92400e),
          atmoColor: new THREE.Color(0xfbbf24),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.85,
          description: 'Largest moon of Saturn, wrapped in a dense golden organo-nitrogen haze with liquid methane/ethane lakes on its surface.'
        };
      case 'ceres':
        return {
          type: 'Asteroid Belt Dwarf Planet · Cryovolcanic World',
          category: 'ice_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.04,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.64,
          primaryColor: new THREE.Color(0x475569),
          secondaryColor: new THREE.Color(0x94a3b8),
          accentColor: new THREE.Color(0xe0f2fe),
          atmoColor: new THREE.Color(0x7dd3fc),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.08,
          description: planet.description || 'Largest body in the Main Asteroid Belt (2.77 AU), featuring bright sodium-carbonate evaporite deposits in Occator Crater.'
        };
      default:
        return {
          type: `Solar System Moon (${planet.parentBody || 'Sol'})`,
          category: 'ice_rocky',
          filterGroup: 'solar_system',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.002,
          tidalStretch: 1.0,
          hasRings: false,
          seed,
          primaryColor: new THREE.Color(0xcbd5e1),
          secondaryColor: new THREE.Color(0x64748b),
          accentColor: new THREE.Color(0xf8fafc),
          atmoColor: new THREE.Color(0x94a3b8),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.1,
          description: `Natural satellite orbiting ${planet.parentBody || 'the Sun'} in the Solar System.`
        };
    }
  }

  // 1b. Handle Popular Sci-Fi Media & Iconic Benchmark Star Systems
  if (planet.isPopularMedia && planet.mediaPreset) {
    switch (planet.mediaPreset) {
      case 'adrian_tau_ceti':
        return {
          type: 'Project Hail Mary · "Adrian" (Tau Ceti e)',
          category: 'super_earth',
          filterGroup: 'popular_media',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.015,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.34,
          primaryColor: new THREE.Color(0x0d9488),
          secondaryColor: new THREE.Color(0x34d399),
          accentColor: new THREE.Color(0xf43f5e),
          atmoColor: new THREE.Color(0x2dd4bf),
          emissiveColor: new THREE.Color(0xe11d48),
          cloudOpacity: 0.72,
          description: planet.description
        };
      case 'erid_40_eridani':
        return {
          type: 'Project Hail Mary · "Erid" (40 Eridani A b)',
          category: 'super_earth',
          filterGroup: 'popular_media',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.012,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.78,
          primaryColor: new THREE.Color(0x27272a),
          secondaryColor: new THREE.Color(0x713f12),
          accentColor: new THREE.Color(0xfbbf24),
          atmoColor: new THREE.Color(0xd97706),
          emissiveColor: new THREE.Color(0x451a03),
          cloudOpacity: 0.85,
          description: planet.description
        };
      case 'vulcan':
        return {
          type: 'Star Trek · Vulcan / Ni\'Var (40 Eridani A)',
          category: 'desert',
          filterGroup: 'popular_media',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.008,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.56,
          primaryColor: new THREE.Color(0xb91c1c),
          secondaryColor: new THREE.Color(0x7c2d12),
          accentColor: new THREE.Color(0xfdba74),
          atmoColor: new THREE.Color(0xf97316),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.25,
          description: planet.description
        };
      case 'andoria':
        return {
          type: 'Star Trek · Andoria Icy Moon (Procyon)',
          category: 'ice_rocky',
          filterGroup: 'popular_media',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.004,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.22,
          primaryColor: new THREE.Color(0xbae6fd),
          secondaryColor: new THREE.Color(0x0284c7),
          accentColor: new THREE.Color(0xf8fafc),
          atmoColor: new THREE.Color(0x38bdf8),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.35,
          description: planet.description
        };
      case 'qonos':
        return {
          type: 'Star Trek · Qo\'noS / Kronos (Klingon Homeworld)',
          category: 'super_earth',
          filterGroup: 'popular_media',
          shaderMode: 0,
          useEarthMap: false,
          oblateness: 0.01,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.67,
          primaryColor: new THREE.Color(0x14532d),
          secondaryColor: new THREE.Color(0x3f6212),
          accentColor: new THREE.Color(0xd97706),
          atmoColor: new THREE.Color(0x4ade80),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.5,
          description: planet.description
        };
      case 'pandora':
        return {
          type: 'Avatar · Pandora Bioluminescent Moon (Alpha Centauri A)',
          category: 'temperate',
          filterGroup: 'popular_media',
          shaderMode: 0,
          useEarthMap: false,
          oblateness: 0.005,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.48,
          primaryColor: new THREE.Color(0x0369a1),
          secondaryColor: new THREE.Color(0x059669),
          accentColor: new THREE.Color(0x22d3ee),
          atmoColor: new THREE.Color(0x38bdf8),
          emissiveColor: new THREE.Color(0x06b6d4),
          cloudOpacity: 0.45,
          description: planet.description
        };
      case 'arrakis':
        return {
          type: 'Dune · Arrakis Spice World (Canopus)',
          category: 'desert',
          filterGroup: 'popular_media',
          shaderMode: 2,
          useEarthMap: false,
          oblateness: 0.005,
          tidalStretch: 1.0,
          hasRings: false,
          seed: 0.81,
          primaryColor: new THREE.Color(0xd97706),
          secondaryColor: new THREE.Color(0x92400e),
          accentColor: new THREE.Color(0xfde68a),
          atmoColor: new THREE.Color(0xfbbf24),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.22,
          description: planet.description
        };
      case 'tatooine':
        return {
          type: 'Star Wars / NASA · Kepler-16b Circumbinary World',
          category: 'gas_giant',
          filterGroup: 'popular_media',
          shaderMode: 3,
          useEarthMap: false,
          oblateness: 0.055,
          tidalStretch: 1.0,
          hasRings: true,
          seed: 0.62,
          primaryColor: new THREE.Color(0xd97706),
          secondaryColor: new THREE.Color(0xfde68a),
          accentColor: new THREE.Color(0xb45309),
          atmoColor: new THREE.Color(0xf59e0b),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.6,
          description: planet.description
        };
      default:
        return {
          type: `${planet.mediaFranchise || 'Popular Media'} · ${planet.id.split(' — ')[0]}`,
          category: 'temperate',
          filterGroup: 'popular_media',
          shaderMode: 0,
          useEarthMap: false,
          oblateness: 0.008,
          tidalStretch: 1.0,
          hasRings: false,
          seed,
          primaryColor: new THREE.Color(0x1d4ed8),
          secondaryColor: new THREE.Color(0x15803d),
          accentColor: new THREE.Color(0xfacc15),
          atmoColor: new THREE.Color(0x60a5fa),
          emissiveColor: new THREE.Color(0x000000),
          cloudOpacity: 0.4,
          description: planet.description
        };
    }
  }

  // 2. General Exoplanet Classification
  const rade = planet.pl_rade || 1.5;
  const bmasse = planet.pl_bmasse || Math.pow(rade, 2.5);
  const eqt = planet.pl_eqt || 300;
  const orbper = planet.pl_orbper || 100;
  const orbsmax = planet.pl_orbsmax || 0.5;

  let filterGroup = 'giant';
  if (rade <= 2.2 && eqt >= 190 && eqt <= 340) {
    filterGroup = 'habitable';
  } else if (eqt >= 1100) {
    filterGroup = 'extreme';
  } else if (rade <= 2.5) {
    filterGroup = 'terrestrial';
  }

  let oblateness = 0.005;
  if (rade > 6.0) {
    oblateness = 0.045 + (seed * 0.045);
  } else if (rade > 2.2) {
    oblateness = 0.02 + (seed * 0.02);
  }

  let tidalStretch = 1.0;
  if ((orbper > 0 && orbper < 4.5) || (orbsmax > 0 && orbsmax < 0.045)) {
    tidalStretch = 1.06 + Math.min(0.08, (0.05 - Math.min(0.045, orbsmax)) * 1.5);
    oblateness *= 0.5;
  }

  if (rade <= 2.8 && eqt >= 1000) {
    return {
      type: 'Molten Lava World',
      category: 'lava',
      filterGroup: 'extreme',
      shaderMode: 1,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings: false,
      seed,
      primaryColor: new THREE.Color(0x2d1e20),
      secondaryColor: new THREE.Color(0x522b20),
      accentColor: new THREE.Color(0xff4500),
      atmoColor: new THREE.Color(0xff5511),
      emissiveColor: new THREE.Color(0xff3300),
      cloudOpacity: 0.15,
      description: `Scorched rocky surface (${eqt} K) with tidally locked silicate magma oceans and glowing volcanic fissures.`
    };
  }

  if (rade <= 2.2) {
    if (eqt >= 200 && eqt <= 340) {
      return {
        type: 'Temperate Super-Earth / Ocean World',
        category: 'temperate_rocky',
        filterGroup: 'habitable',
        shaderMode: 0,
        useEarthMap: false,
        oblateness,
        tidalStretch,
        hasRings: seed > 0.92,
        seed,
        primaryColor: new THREE.Color().setHSL(0.56 + (seed - 0.5) * 0.08, 0.75, 0.35),
        secondaryColor: new THREE.Color().setHSL(0.28 + (seed - 0.5) * 0.14, 0.55, 0.38),
        accentColor: new THREE.Color(0xd2b48c),
        atmoColor: new THREE.Color(0x55b8ff),
        emissiveColor: new THREE.Color(0x000000),
        cloudOpacity: 0.5,
        description: `Habitable-zone rocky world (${rade} R⊕, ${eqt} K) capable of sustaining liquid surface oceans and water-vapor clouds.`
      };
    } else if (eqt < 200) {
      return {
        type: 'Frozen Cryo-Terrestrial World',
        category: 'ice_rocky',
        filterGroup: 'terrestrial',
        shaderMode: 2,
        useEarthMap: false,
        oblateness,
        tidalStretch,
        hasRings: seed > 0.88,
        seed,
        primaryColor: new THREE.Color(0xb8d8e8),
        secondaryColor: new THREE.Color(0x6d99b8),
        accentColor: new THREE.Color(0xeef8ff),
        atmoColor: new THREE.Color(0x88ccff),
        emissiveColor: new THREE.Color(0x000000),
        cloudOpacity: 0.2,
        description: `Glacial surface (${eqt} K) covered in nitrogen/water ice sheets and tectonic fracture ridges.`
      };
    } else if (eqt >= 650) {
      return {
        type: 'Dense Greenhouse / Venusian World',
        category: 'venusian',
        filterGroup: 'terrestrial',
        shaderMode: 3,
        useEarthMap: false,
        oblateness,
        tidalStretch,
        hasRings: false,
        seed,
        primaryColor: new THREE.Color(0xc98a3b),
        secondaryColor: new THREE.Color(0xe5b869),
        accentColor: new THREE.Color(0x8c4a19),
        atmoColor: new THREE.Color(0xffb84d),
        emissiveColor: new THREE.Color(0x220800),
        cloudOpacity: 0.85,
        description: `High-pressure greenhouse atmosphere (${eqt} K) shrouded in thick sulfuric and silicate cloud decks.`
      };
    } else {
      return {
        type: 'Arid Rocky / Desert World',
        category: 'arid_rocky',
        filterGroup: 'terrestrial',
        shaderMode: 2,
        useEarthMap: false,
        oblateness,
        tidalStretch,
        hasRings: seed > 0.9,
        seed,
        primaryColor: new THREE.Color(0xb8532e),
        secondaryColor: new THREE.Color(0x7a341c),
        accentColor: new THREE.Color(0xe09567),
        atmoColor: new THREE.Color(0xe07a47),
        emissiveColor: new THREE.Color(0x000000),
        cloudOpacity: 0.15,
        description: `Dry iron-oxide and basaltic terrain (${rade} R⊕, ${eqt} K) sculpted by impact basins and windblown dust.`
      };
    }
  }

  if (rade <= 6.0) {
    const isWarm = eqt > 500;
    return {
      type: isWarm ? 'Warm Sub-Neptune / Steam Giant' : 'Methane Ice Giant (Neptunian)',
      category: 'ice_giant',
      filterGroup: 'giant',
      shaderMode: 3,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings: seed > 0.65,
      seed,
      primaryColor: new THREE.Color(isWarm ? 0x2b5b84 : 0x1868ae),
      secondaryColor: new THREE.Color(isWarm ? 0x5c8db8 : 0x38b6ff),
      accentColor: new THREE.Color(0xb8ecff),
      atmoColor: new THREE.Color(0x38bdf8),
      emissiveColor: new THREE.Color(0x000000),
      cloudOpacity: 0.6,
      description: `Volatile-rich hydrogen/helium/water/methane envelope (${rade} R⊕, ${eqt} K) with high-altitude zonal jet streams.`
    };
  }

  const hasRings = seed > 0.55 || bmasse > 1500;
  if (eqt < 180) {
    return {
      type: 'Ammonia Gas Giant (Sudarsky Class I)',
      category: 'gas_cold',
      filterGroup: 'giant',
      shaderMode: 3,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings,
      seed,
      primaryColor: new THREE.Color(0xc88b52),
      secondaryColor: new THREE.Color(0xe6ccb2),
      accentColor: new THREE.Color(0x9c4124),
      atmoColor: new THREE.Color(0xd9a773),
      emissiveColor: new THREE.Color(0x000000),
      cloudOpacity: 0.7,
      description: `Cold Jovian giant (${rade} R⊕, ${eqt} K) banded with ammonia ice decks, ammonium hydrosulfide zones, and anticyclonic ovals.`
    };
  } else if (eqt < 360) {
    return {
      type: 'Water-Cloud Gas Giant (Sudarsky Class II)',
      category: 'gas_water',
      filterGroup: 'giant',
      shaderMode: 3,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings,
      seed,
      primaryColor: new THREE.Color(0x3b75af),
      secondaryColor: new THREE.Color(0xeef6ff),
      accentColor: new THREE.Color(0x74a9d8),
      atmoColor: new THREE.Color(0x60a5fa),
      emissiveColor: new THREE.Color(0x000000),
      cloudOpacity: 0.75,
      description: `Temperate gas giant (${rade} R⊕, ${eqt} K) featuring bright condensed water-vapor cloud belts over a deep blue H₂/He atmosphere.`
    };
  } else if (eqt < 850) {
    return {
      type: 'Cloudless Azure Giant (Sudarsky Class III)',
      category: 'gas_azure',
      filterGroup: 'giant',
      shaderMode: 3,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings: seed > 0.7,
      seed,
      primaryColor: new THREE.Color(0x184294),
      secondaryColor: new THREE.Color(0x2666bd),
      accentColor: new THREE.Color(0x4b91bf),
      atmoColor: new THREE.Color(0x3b82f6),
      emissiveColor: new THREE.Color(0x000000),
      cloudOpacity: 0.3,
      description: `Warm gas giant (${rade} R⊕, ${eqt} K) too hot for ammonia/water condensation, resulting in a deep Rayleigh-scattered cobalt-blue globe.`
    };
  } else if (eqt < 1400) {
    return {
      type: 'Alkali-Metal Hot Jupiter (Class IV)',
      category: 'gas_hot',
      filterGroup: 'giant',
      shaderMode: 4,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings: false,
      seed,
      primaryColor: new THREE.Color(0x3a2528),
      secondaryColor: new THREE.Color(0x6e3024),
      accentColor: new THREE.Color(0xff6b2b),
      atmoColor: new THREE.Color(0xd9480f),
      emissiveColor: new THREE.Color(0x992200),
      cloudOpacity: 0.4,
      description: `Roasting gas giant (${rade} R⊕, ${eqt} K) where sodium & potassium absorb visible light while deep thermal rifts glow dull crimson.`
    };
  } else {
    return {
      type: 'Ultra-Hot Silicate Giant (Class V)',
      category: 'gas_ultrahot',
      filterGroup: 'extreme',
      shaderMode: 4,
      useEarthMap: false,
      oblateness,
      tidalStretch,
      hasRings: false,
      seed,
      primaryColor: new THREE.Color(0x4a1a0c),
      secondaryColor: new THREE.Color(0xb03210),
      accentColor: new THREE.Color(0xffaa33),
      atmoColor: new THREE.Color(0xff5500),
      emissiveColor: new THREE.Color(0xff4400),
      cloudOpacity: 0.5,
      description: `Incandescent ultra-hot giant (${rade} R⊕, ${eqt} K) glowing with vaporized iron and silicate clouds driven by supersonic equatorial jets.`
    };
  }
}

// Procedural Planet GLSL Shaders (with Accurate Earth Map Sampler + Brightened Night Side)
const PLANET_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLANET_FRAGMENT_SHADER = `
  uniform int uMode;
  uniform int uUseEarthTex;
  uniform sampler2D uEarthTex;
  uniform float uSeed;
  uniform float uTime;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uAccent;
  uniform vec3 uAtmo;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 5; ++i) {
      v += a * noise(p);
      p = p * 2.03 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 normPos = normalize(vPosition);
    vec3 seedOffset = vec3(uSeed * 37.0, uSeed * 73.0, uSeed * 19.0);
    float ndotl = dot(vWorldNormal, normalize(uLightDir));
    float dayFactor = smoothstep(-0.2, 0.25, ndotl);

    // Brightened dark side: minimum 0.46 ambient illumination so the night hemisphere is clearly visible
    float diffuse = mix(0.46, 1.05, smoothstep(-0.4, 0.85, ndotl));

    vec3 surfaceColor = uPrimary;
    vec3 nightEmission = vec3(0.0);

    if (uUseEarthTex == 1) {
      // Exact spherical Lon/Lat UV matching latLonToVector3(latDeg, lonDeg):
      // x = cos(lat)*cos(lon), y = sin(lat), z = -cos(lat)*sin(lon)
      float latRad = asin(clamp(normPos.y, -1.0, 1.0));
      float lonRad = atan(-normPos.z, normPos.x);
      float u = (lonRad / 3.14159265) * 0.5 + 0.5;
      float v = (latRad / (3.14159265 * 0.5)) * 0.5 + 0.5;

      vec3 mapCol = texture2D(uEarthTex, vec2(u, v)).rgb;
      float microDetail = fbm(normPos * 12.0 + seedOffset) * 0.12 - 0.06;
      surfaceColor = clamp(mapCol + vec3(microDetail * 0.5), 0.0, 1.0);

      // Subtle animated cloud wisps (kept light so continents are always easy to read)
      vec3 cloudCoord = normPos * 3.4 + vec3(uTime * 0.012, 0.0, 2.0);
      float clouds = smoothstep(0.60, 0.82, fbm(cloudCoord));
      surfaceColor = mix(surfaceColor, vec3(0.98, 0.99, 1.0), clouds * 0.28);

    } else if (uMode == 0) {
      // Mode 0: Temperate Exoplanet Ocean & Continents + Clouds + Polar Caps
      float cont = fbm(normPos * 2.6 + seedOffset);
      float detail = fbm(normPos * 8.5 + seedOffset);
      float landMask = smoothstep(0.47, 0.52, cont + (detail - 0.5) * 0.15);

      vec3 ocean = mix(uPrimary * 0.75, uPrimary * 1.3, smoothstep(0.3, 0.48, cont));
      vec3 land = mix(uSecondary, uAccent, smoothstep(0.52, 0.72, cont + detail * 0.2));
      surfaceColor = mix(ocean, land, landMask);

      float lat = abs(normPos.y);
      float iceMask = smoothstep(0.76, 0.88, lat + (detail - 0.5) * 0.12);
      surfaceColor = mix(surfaceColor, vec3(0.93, 0.97, 1.0), iceMask);

      vec3 cloudCoord = normPos * 3.2 + vec3(uTime * 0.015, 0.0, uSeed * 11.0);
      float clouds = smoothstep(0.54, 0.78, fbm(cloudCoord + fbm(cloudCoord * 2.0) * 0.45));
      surfaceColor = mix(surfaceColor, vec3(0.97, 0.99, 1.0), clouds * 0.45);

    } else if (uMode == 1) {
      // Mode 1: Molten Lava / Volcanic Sulfur World
      float n1 = fbm(normPos * 3.8 + seedOffset);
      float n2 = fbm(normPos * 9.0 - seedOffset + vec3(uTime * 0.02));
      float cracks = 1.0 - smoothstep(0.01, 0.08, abs(n1 - 0.5));
      float magmaPool = smoothstep(0.62, 0.78, n2) * max(0.35, ndotl);

      surfaceColor = mix(uPrimary, uSecondary, n2);
      vec3 lavaGlow = mix(vec3(1.0, 0.28, 0.0), vec3(1.0, 0.88, 0.25), cracks * n2 + magmaPool);
      float lavaMask = clamp(cracks * 0.9 + magmaPool * 0.85, 0.0, 1.0);
      surfaceColor = mix(surfaceColor, lavaGlow, lavaMask);
      nightEmission = lavaGlow * lavaMask * 0.85;

    } else if (uMode == 2) {
      // Mode 2: Rocky / Arid / Lunar / Mars / Cryo-Ice Terrestrial
      float terrain = fbm(normPos * 3.5 + seedOffset);
      float ridges = abs(fbm(normPos * 10.0 + seedOffset) - 0.5) * 2.0;
      surfaceColor = mix(uPrimary, uSecondary, smoothstep(0.25, 0.75, terrain));
      surfaceColor = mix(surfaceColor, uAccent, smoothstep(0.65, 0.92, ridges));

      // Subtle polar ice caps on Mars-like rocky worlds
      float lat = abs(normPos.y);
      if (uSeed > 0.55 && uSeed < 0.62) {
        float polarCap = smoothstep(0.82, 0.90, lat + (terrain - 0.5) * 0.1);
        surfaceColor = mix(surfaceColor, vec3(0.95, 0.96, 0.98), polarCap);
      }

    } else if (uMode == 3) {
      // Mode 3: Banded Gas / Ice Giant / Venusian Clouds
      float turb = fbm(normPos * 4.5 + seedOffset + vec3(uTime * 0.015, 0.0, 0.0));
      float bands = sin(normPos.y * 18.0 + turb * 5.0 + uSeed * 12.0) * 0.5 + 0.5;
      float fineBands = cos(normPos.y * 42.0 - turb * 8.0) * 0.5 + 0.5;

      surfaceColor = mix(uPrimary, uSecondary, bands);
      surfaceColor = mix(surfaceColor, uAccent, fineBands * 0.35);

      vec3 stormCenter = normalize(vec3(0.6, -0.32, 0.72));
      float distToStorm = length((normPos - stormCenter) * vec3(1.0, 1.8, 1.0));
      float stormMask = smoothstep(0.26, 0.06, distToStorm);
      surfaceColor = mix(surfaceColor, uAccent * 1.15, stormMask * 0.75);

    } else {
      // Mode 4: Alkali / Ultra-Hot Glowing Gas Giant
      float turb = fbm(normPos * 4.0 + seedOffset + vec3(uTime * 0.025, 0.0, 0.0));
      float bands = sin(normPos.y * 14.0 + turb * 6.5) * 0.5 + 0.5;
      surfaceColor = mix(uPrimary, uSecondary, bands);

      float thermalRift = smoothstep(0.58, 0.82, bands * turb * 1.45);
      vec3 thermalColor = mix(uAccent, vec3(1.0, 0.85, 0.35), thermalRift * max(0.2, ndotl));
      surfaceColor = mix(surfaceColor, thermalColor, thermalRift * 0.7);
      nightEmission = uAccent * thermalRift * 0.65 + uSecondary * 0.22;
    }

    // All-around Fresnel atmospheric rim so both lit and dark sides have a clear 3D silhouette
    float fresnel = pow(1.0 - max(0.0, vNormal.z), 2.8);
    vec3 atmoRim = uAtmo * fresnel * (0.45 + 0.55 * dayFactor);

    vec3 finalColor = surfaceColor * diffuse + nightEmission * (1.0 - dayFactor * 0.5) + atmoRim;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Procedural Host Star GLSL Shaders
const STAR_SURFACE_FRAGMENT_SHADER = `
  uniform vec3 uStarColor;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vec3 p = normalize(vPosition) * 10.0 + vec3(uTime * 0.15);
    float gran = noise(p) * 0.6 + noise(p * 2.5) * 0.4;
    float mu = max(0.0, vNormal.z);
    float limbDarkening = pow(mu, 0.45);
    vec3 coreColor = mix(uStarColor * 0.7, vec3(1.0, 0.99, 0.95), limbDarkening * 0.65);
    vec3 col = mix(uStarColor * 0.55, coreColor * 1.25, gran * 0.5 + 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function createCoronaTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const col = new THREE.Color(colorHex);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);

  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.22, `rgba(${r}, ${g}, ${b}, 0.85)`);
  grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.28)`);
  grad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0.0)`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function createBadgeSprite(text, borderColorHex = 0x38bdf8, scaleSize = 0.24) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  const measured = ctx.measureText(text).width;
  canvas.width = Math.max(220, Math.ceil(measured + 54));
  canvas.height = 84;

  const col = new THREE.Color(borderColorHex);
  const borderCss = `rgb(${Math.round(col.r * 255)}, ${Math.round(col.g * 255)}, ${Math.round(col.b * 255)})`;

  ctx.fillStyle = 'rgba(8, 15, 30, 0.86)';
  ctx.strokeStyle = borderCss;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.roundRect(6, 6, canvas.width - 12, canvas.height - 12, 16);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleSize * (canvas.width / canvas.height), scaleSize, 1);
  return sprite;
}

// Convert planetographic (latDeg, lonDeg) to unit vector on the globe
export function latLonToVector3(latDeg, lonDeg, radius = 1.0) {
  const phi = THREE.MathUtils.degToRad(latDeg);
  const lam = THREE.MathUtils.degToRad(lonDeg);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(lam),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(lam)
  );
}

// Generate moons list for any planet (real Solar System moons or candidate Exomoons for large exoplanets)
export function getMoonsForPlanet(planet, profile) {
  if (Array.isArray(planet.moons)) {
    return planet.moons;
  }
  // Generate realistic candidate exomoons for large exoplanets so users can inspect moons around exoplanets too
  const rade = planet.pl_rade || 1.5;
  const seed = profile.seed;
  if (rade >= 5.0) {
    return [
      { name: `${planet.id} I (Exomoon)`, radiusRatio: 0.11, orbitRadius: 1.85, speed: 0.95, color: 0xe2e8f0, inclination: 0.05 },
      { name: `${planet.id} II (Exomoon)`, radiusRatio: 0.14, orbitRadius: 2.55, speed: 0.58, color: 0xfbbf24, inclination: -0.07 }
    ];
  } else if (rade >= 1.8 && seed > 0.35) {
    return [
      { name: `${planet.id} I (Exomoon)`, radiusRatio: 0.16, orbitRadius: 1.95, speed: 0.75, color: 0xcbd5e1, inclination: 0.08 }
    ];
  }
  return [];
}

// Build the complete Up-Close Planet + 8-Quadrant Overlay + Orbiting Moons + Host Star Group
export function buildCelestialSystem(planet, activeQuadrantId = 'Q1') {
  const profile = classifyPlanet(planet);
  const rootGroup = new THREE.Group();
  rootGroup.name = 'CelestialInspectorRoot';

  const lightDir = new THREE.Vector3(1.0, 0.2, 0.45).normalize();
  const earthTex = getEarthContinentTexture();

  // 1. Planet Core & Procedural Surface Mesh
  const planetGroup = new THREE.Group();
  planetGroup.scale.set(profile.tidalStretch, 1.0 - profile.oblateness, 1.0);

  const planetGeo = new THREE.SphereGeometry(1.0, 96, 96);
  const planetMat = new THREE.ShaderMaterial({
    vertexShader: PLANET_VERTEX_SHADER,
    fragmentShader: PLANET_FRAGMENT_SHADER,
    uniforms: {
      uMode: { value: profile.shaderMode },
      uUseEarthTex: { value: profile.useEarthMap ? 1 : 0 },
      uEarthTex: { value: earthTex },
      uSeed: { value: profile.seed },
      uTime: { value: 0.0 },
      uPrimary: { value: profile.primaryColor },
      uSecondary: { value: profile.secondaryColor },
      uAccent: { value: profile.accentColor },
      uAtmo: { value: profile.atmoColor },
      uLightDir: { value: lightDir }
    }
  });

  const planetMesh = new THREE.Mesh(planetGeo, planetMat);
  planetMesh.name = 'PlanetSurfaceMesh';
  planetMesh.userData = { isPlanet: true, data: planet, profile };
  planetGroup.add(planetMesh);

  // Special Up-Close 3D Features for Black Holes, Galaxies, Nebulae, Pulsars & Clusters
  let deepSkyAnimatedObj = null;
  if (planet.isDeepSky) {
    if (planet.deepSkyType === 'black_hole') {
      // Pure pitch-black Event Horizon
      planetMesh.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
      planetMesh.scale.set(0.78, 0.78, 0.78);

      // Gravitationally Lensed Photon Ring
      const photonRing = new THREE.Mesh(
        new THREE.SphereGeometry(0.84, 48, 48),
        new THREE.MeshBasicMaterial({
          color: 0xffaa33,
          transparent: true,
          opacity: 0.55,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending
        })
      );
      planetGroup.add(photonRing);

      // Lensed vertical Einstein ring halo
      const lensedHalo = new THREE.Mesh(
        new THREE.RingGeometry(0.84, 1.35, 96),
        new THREE.MeshBasicMaterial({
          color: 0xff6b00,
          transparent: true,
          opacity: 0.38,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      planetGroup.add(lensedHalo);

      // Relativistic Polar Plasma Jets (for M87*, TON 618, Cygnus X-1, V616 Mon)
      if (planet.hasJets) {
        const jetGeo = new THREE.ConeGeometry(0.28, 4.8, 32, 1, true);
        const jetMat = new THREE.MeshBasicMaterial({
          color: 0x60a5fa,
          transparent: true,
          opacity: 0.42,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const jetNorth = new THREE.Mesh(jetGeo, jetMat);
        jetNorth.position.y = 2.4;
        const jetSouth = new THREE.Mesh(jetGeo, jetMat);
        jetSouth.rotation.x = Math.PI;
        jetSouth.position.y = -2.4;
        planetGroup.add(jetNorth);
        planetGroup.add(jetSouth);
      }
    } else if (planet.deepSkyType === 'galaxy') {
      // Shrink inner core sphere into glowing Galactic Bulge
      planetMesh.scale.set(0.42, 0.28, 0.42);
      const starCount = 12000;
      const gPos = new Float32Array(starCount * 3);
      const gCol = new Float32Array(starCount * 3);
      const arms = 4;
      for (let i = 0; i < starCount; i++) {
        const r = 0.25 + Math.pow(Math.random(), 1.35) * 2.25;
        const armAngle = ((i % arms) / arms) * Math.PI * 2;
        const spin = r * 2.8;
        const scatter = (Math.random() - 0.5) * (0.35 + r * 0.18);
        const theta = armAngle + spin + scatter;
        const y = (Math.random() - 0.5) * (0.28 * Math.exp(-r * 0.7));

        gPos[i * 3] = Math.cos(theta) * r;
        gPos[i * 3 + 1] = y;
        gPos[i * 3 + 2] = Math.sin(theta) * r;

        const t = Math.min(1, r / 2.3);
        const isHII = Math.random() < 0.08 && r > 0.6;
        if (isHII) {
          gCol[i * 3] = 0.96; gCol[i * 3 + 1] = 0.35; gCol[i * 3 + 2] = 0.72;
        } else {
          gCol[i * 3] = 1.0 - t * 0.45;
          gCol[i * 3 + 1] = 0.92 - t * 0.18;
          gCol[i * 3 + 2] = 0.65 + t * 0.35;
        }
      }
      const galGeo = new THREE.BufferGeometry();
      galGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
      galGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
      const galPoints = new THREE.Points(
        galGeo,
        new THREE.PointsMaterial({
          size: 0.032,
          vertexColors: true,
          transparent: true,
          opacity: 0.88,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      planetGroup.add(galPoints);
      deepSkyAnimatedObj = galPoints;
    } else if (planet.deepSkyType === 'pulsar') {
      planetMesh.scale.set(0.32, 0.32, 0.32);
      const beamGroup = new THREE.Group();
      const beamGeo = new THREE.ConeGeometry(0.32, 4.5, 24, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const b1 = new THREE.Mesh(beamGeo, beamMat);
      b1.position.y = 2.25;
      const b2 = new THREE.Mesh(beamGeo, beamMat);
      b2.rotation.x = Math.PI;
      b2.position.y = -2.25;
      beamGroup.add(b1);
      beamGroup.add(b2);
      beamGroup.rotation.z = 0.55;
      planetGroup.add(beamGroup);
      deepSkyAnimatedObj = beamGroup;
    } else if (planet.deepSkyType === 'nebula' || planet.deepSkyType === 'cluster') {
      planetMesh.scale.set(0.35, 0.35, 0.35);
      const pCount = 7000;
      const nPos = new Float32Array(pCount * 3);
      const nCol = new Float32Array(pCount * 3);
      const isCluster = planet.deepSkyType === 'cluster';
      for (let i = 0; i < pCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const th = 2 * Math.PI * u;
        const ph = Math.acos(2 * v - 1);
        const r = isCluster ? Math.pow(Math.random(), 1.8) * 1.9 : (0.35 + Math.random() * 1.65);
        nPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        nPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * (isCluster ? 1.0 : 0.78);
        nPos[i * 3 + 2] = r * Math.cos(ph);

        if (isCluster) {
          const warm = Math.random() < 0.35;
          nCol[i * 3] = warm ? 1.0 : 0.65;
          nCol[i * 3 + 1] = warm ? 0.85 : 0.82;
          nCol[i * 3 + 2] = warm ? 0.55 : 1.0;
        } else {
          const hAlpha = Math.random() < 0.55;
          nCol[i * 3] = hAlpha ? 0.95 : 0.15;
          nCol[i * 3 + 1] = hAlpha ? 0.28 : 0.82;
          nCol[i * 3 + 2] = hAlpha ? 0.68 : 0.95;
        }
      }
      const nebGeo = new THREE.BufferGeometry();
      nebGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
      nebGeo.setAttribute('color', new THREE.BufferAttribute(nCol, 3));
      const nebPoints = new THREE.Points(
        nebGeo,
        new THREE.PointsMaterial({
          size: isCluster ? 0.036 : 0.055,
          vertexColors: true,
          transparent: true,
          opacity: 0.78,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      planetGroup.add(nebPoints);
      deepSkyAnimatedObj = nebPoints;
    }
  }

  // Outer Atmospheric Halo
  const atmoGeo = new THREE.SphereGeometry(1.038, 64, 64);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: profile.atmoColor,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
  planetGroup.add(atmoMesh);

  // Optional Planetary Ring System
  if (profile.hasRings) {
    const rIn = profile.ringInner || 1.32;
    const rOut = profile.ringOuter || 2.25;
    const ringGeo = new THREE.RingGeometry(rIn, rOut, 128);
    const pos = ringGeo.attributes.position;
    const uvs = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = (Math.sqrt(x * x + y * y) - rIn) / (rOut - rIn);
      uvs.setXY(i, r, 0.5);
    }

    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 256;
    ringCanvas.height = 16;
    const rctx = ringCanvas.getContext('2d');
    for (let x = 0; x < 256; x++) {
      const t = x / 255;
      const gap = (t > 0.58 && t < 0.64) || (t > 0.25 && t < 0.28) ? 0.08 : 1.0;
      const wave = 0.5 + 0.45 * Math.sin(t * 45.0 + profile.seed * 10.0) * Math.cos(t * 19.0);
      const alpha = Math.max(0, Math.min(0.85, wave * gap * Math.sin(t * Math.PI)));
      const c = profile.secondaryColor;
      rctx.fillStyle = `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`;
      rctx.fillRect(x, 0, 1, 16);
    }
    const ringTex = new THREE.CanvasTexture(ringCanvas);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = planet.solarPreset === 'uranus' ? 0.15 : Math.PI / 2 - 0.22;
    ringMesh.rotation.y = 0.15;
    planetGroup.add(ringMesh);
  }

  // 2. Interactive 8-Quadrant Overlay (Q1..Q8) on the Planet Surface
  const quadrantOverlayGroup = new THREE.Group();
  quadrantOverlayGroup.name = 'QuadrantOverlayGroup';

  const gridMat = new THREE.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.68
  });

  const circlePts = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    circlePts.push(new THREE.Vector3(Math.cos(a) * 1.012, 0, Math.sin(a) * 1.012));
  }
  const equatorLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePts), gridMat);
  quadrantOverlayGroup.add(equatorLine);

  const meridian1 = equatorLine.clone();
  meridian1.rotation.x = Math.PI / 2;
  quadrantOverlayGroup.add(meridian1);

  const meridian2 = equatorLine.clone();
  meridian2.rotation.z = Math.PI / 2;
  quadrantOverlayGroup.add(meridian2);

  const quadrantMeshes = [];
  PLANETARY_QUADRANTS.forEach(q => {
    const isSelected = q.id === activeQuadrantId;
    const thetaStart = q.hemisphere === 'Northern' ? 0.02 : Math.PI / 2 + 0.02;
    const thetaLength = Math.PI / 2 - 0.04;

    const lonStartDeg = q.lonRange[0];
    const phiStart = THREE.MathUtils.degToRad(lonStartDeg < 0 ? 360 + lonStartDeg : lonStartDeg) + 0.02;
    const phiLength = Math.PI / 2 - 0.04;

    const octGeo = new THREE.SphereGeometry(1.015, 24, 16, phiStart, phiLength, thetaStart, thetaLength);
    const octMat = new THREE.MeshBasicMaterial({
      color: q.color,
      transparent: true,
      opacity: isSelected ? 0.34 : 0.06,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.userData = {
      isQuadrant: true,
      quadrantId: q.id,
      quadrantData: q
    };
    quadrantOverlayGroup.add(octMesh);
    quadrantMeshes.push(octMesh);

    const centerVec = latLonToVector3(q.centerLat, q.centerLon, 1.18);
    const badge = createBadgeSprite(q.id, q.color, isSelected ? 0.16 : 0.12);
    badge.position.copy(centerVec);
    badge.userData = { isQuadrant: true, quadrantId: q.id, quadrantData: q };
    quadrantOverlayGroup.add(badge);

    if (isSelected) {
      const surfaceOrigin = latLonToVector3(q.centerLat, q.centerLon, 1.01);
      const zenithDir = surfaceOrigin.clone().normalize();
      const arrow = new THREE.ArrowHelper(zenithDir, surfaceOrigin, 0.55, 0x38bdf8, 0.14, 0.09);
      quadrantOverlayGroup.add(arrow);
    }
  });

  planetGroup.add(quadrantOverlayGroup);
  rootGroup.add(planetGroup);

  // 3. Orbiting 3D Moons (or Looming Parent Planet if currently inspecting a Moon)
  const moonsGroup = new THREE.Group();
  moonsGroup.name = 'OrbitingMoonsGroup';
  const animatedMoons = [];

  const moonsList = getMoonsForPlanet(planet, profile);
  moonsList.forEach((m, idx) => {
    const orbitR = m.orbitRadius || (1.8 + idx * 0.55);
    const moonR = Math.max(0.065, Math.min(0.26, m.radiusRatio || 0.12));
    const inc = m.inclination || 0.04;

    // Orbit path ring
    const orbitPts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(
        Math.cos(a) * orbitR,
        Math.sin(a) * orbitR * Math.sin(inc),
        Math.sin(a) * orbitR * Math.cos(inc)
      ));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.45 })
    );
    moonsGroup.add(orbitLine);

    // Moon 3D Sphere (brightened on dark side via emissive fill)
    const moonColor = new THREE.Color(m.color || 0xcbd5e1);
    const moonMat = new THREE.MeshPhongMaterial({
      color: moonColor,
      emissive: moonColor.clone().multiplyScalar(0.42),
      shininess: 15
    });
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonR, 24, 24), moonMat);
    moonMesh.userData = {
      isMoon: true,
      data: {
        Moon: m.name,
        'Parent World': planet.id,
        'Relative Radius': `${(moonR * 100).toFixed(0)}% of parent display scale`,
        Tip: 'You can also select major Solar System moons directly in the top dropdown!'
      }
    };

    const moonLabel = createBadgeSprite(`🌕 ${m.name}`, m.color || 0x94a3b8, 0.11);
    moonLabel.position.set(0, moonR + 0.14, 0);
    moonMesh.add(moonLabel);

    moonsGroup.add(moonMesh);
    animatedMoons.push({
      mesh: moonMesh,
      orbitR,
      speed: m.speed || 0.7,
      phase: idx * 2.1,
      inc
    });
  });

  // If currently inspecting a Moon (e.g. Luna, Io, Europa, Titan), show its Parent Planet looming in background!
  if (planet.bodyType === 'moon' && planet.parentBody) {
    const parentIsEarth = planet.parentBody.startsWith('Earth');
    const parentGeo = new THREE.SphereGeometry(0.95, 48, 48);
    let parentMat;
    if (parentIsEarth) {
      parentMat = new THREE.ShaderMaterial({
        vertexShader: PLANET_VERTEX_SHADER,
        fragmentShader: PLANET_FRAGMENT_SHADER,
        uniforms: {
          uMode: { value: 0 },
          uUseEarthTex: { value: 1 },
          uEarthTex: { value: earthTex },
          uSeed: { value: 0.42 },
          uTime: { value: 0.0 },
          uPrimary: { value: new THREE.Color(0x0b4a8c) },
          uSecondary: { value: new THREE.Color(0x2f7d3d) },
          uAccent: { value: new THREE.Color(0xd9b382) },
          uAtmo: { value: new THREE.Color(0x4da6ff) },
          uLightDir: { value: lightDir }
        }
      });
    } else {
      const pCol = new THREE.Color(0xd99b52);
      parentMat = new THREE.MeshPhongMaterial({
        color: pCol,
        emissive: pCol.clone().multiplyScalar(0.45)
      });
    }
    const parentMesh = new THREE.Mesh(parentGeo, parentMat);
    parentMesh.position.set(-3.2, 1.1, -2.6);
    const pBadge = createBadgeSprite(`🪐 Parent: ${planet.parentBody}`, 0x38bdf8, 0.22);
    pBadge.position.set(0, 1.25, 0);
    parentMesh.add(pBadge);
    moonsGroup.add(parentMesh);
  }

  // 3b. Render Interactive 3D Scientific Expedition Spacecraft / Probe Marker in Orbit
  const expeditions = getExpeditionsForWorld(planet);
  if (expeditions && expeditions.length > 0) {
    const primaryExp = expeditions[0];
    const probeOrbitR = 1.62;
    const probeInc = 0.38;

    const probeOrbitPts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      probeOrbitPts.push(
        new THREE.Vector3(
          Math.cos(a) * probeOrbitR,
          Math.sin(a) * probeOrbitR * Math.sin(probeInc),
          Math.sin(a) * probeOrbitR * Math.cos(probeInc)
        )
      );
    }
    const probeTrack = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(probeOrbitPts),
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 })
    );
    moonsGroup.add(probeTrack);

    // Build miniature 3D Spacecraft (Gold Foil Bus + Blue Solar Panels + Dish Antenna)
    const probeGroup = new THREE.Group();
    const busMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.075, 12),
      new THREE.MeshPhongMaterial({ color: 0xfbbf24, emissive: 0xb45309 })
    );
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide });
    const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.045), panelMat);
    leftWing.position.set(-0.095, 0, 0);
    const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.045), panelMat);
    rightWing.position.set(0.095, 0, 0);
    const dishMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.042, 0.025, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc, side: THREE.DoubleSide })
    );
    dishMesh.position.set(0, 0.05, 0);

    probeGroup.add(busMesh);
    probeGroup.add(leftWing);
    probeGroup.add(rightWing);
    probeGroup.add(dishMesh);

    const probeMeta = {
      isMoon: true,
      isExpeditionProbe: true,
      data: {
        'Scientific Expedition': primaryExp.mission,
        'Agency & Timeline': primaryExp.agency,
        'Vehicles / Spacecraft Sent': primaryExp.vehicles,
        'Key Scientific Results': primaryExp.results,
        'Total Recorded Expeditions': `${expeditions.length} Mission Campaign(s) (See Dossier Panel)`
      }
    };
    probeGroup.userData = probeMeta;
    probeGroup.traverse(c => {
      c.userData = probeMeta;
    });

    const probeBadge = createBadgeSprite(
      primaryExp.probeLabel || '🛰️ Scientific Probe',
      0x10b981,
      0.165
    );
    probeBadge.position.set(0, 0.14, 0);
    probeBadge.userData = probeMeta;
    probeGroup.add(probeBadge);

    moonsGroup.add(probeGroup);
    animatedMoons.push({
      mesh: probeGroup,
      orbitR: probeOrbitR,
      speed: 1.45,
      phase: 1.2,
      inc: probeInc
    });
  }

  rootGroup.add(moonsGroup);

  // 4. Up-Close Host Star Mesh & Corona in the Background
  const starColor = teffToColor(planet.st_teff || 5778);
  const starGroup = new THREE.Group();
  starGroup.name = 'HostStarGroup';

  const stRad = planet.st_rad || 1.0;
  const orbsmax = planet.pl_orbsmax || 1.0;
  const relativeStarSize = Math.max(0.28, Math.min(1.6, 0.45 * Math.pow(stRad / Math.max(0.05, orbsmax), 0.22)));

  const starGeo = new THREE.SphereGeometry(relativeStarSize, 48, 48);
  const starMat = new THREE.ShaderMaterial({
    vertexShader: PLANET_VERTEX_SHADER,
    fragmentShader: STAR_SURFACE_FRAGMENT_SHADER,
    uniforms: {
      uStarColor: { value: starColor },
      uTime: { value: 0.0 }
    }
  });
  const hostStarMesh = new THREE.Mesh(starGeo, starMat);
  hostStarMesh.userData = {
    isHostStar: true,
    data: {
      hostname: planet.hostname,
      st_spectype: planet.st_spectype || 'G2 V',
      st_teff: `${planet.st_teff || 5778} K`,
      st_rad: `${planet.st_rad || 1.0} R☉`,
      st_mass: `${planet.st_mass || 1.0} M☉`,
      pl_orbsmax: `${planet.pl_orbsmax || 1.0} AU`
    }
  };
  starGroup.add(hostStarMesh);

  const coronaSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createCoronaTexture(starColor.getHex()),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })
  );
  coronaSprite.scale.set(relativeStarSize * 4.2, relativeStarSize * 4.2, 1);
  starGroup.add(coronaSprite);

  starGroup.position.copy(lightDir.clone().multiplyScalar(6.5));
  rootGroup.add(starGroup);

  function updateOrbitingMoons(timeSec) {
    animatedMoons.forEach(m => {
      const angle = timeSec * m.speed * 0.45 + m.phase;
      m.mesh.position.set(
        Math.cos(angle) * m.orbitR,
        Math.sin(angle) * m.orbitR * Math.sin(m.inc),
        Math.sin(angle) * m.orbitR * Math.cos(m.inc)
      );
    });
    if (deepSkyAnimatedObj) {
      if (planet.deepSkyType === 'pulsar') {
        deepSkyAnimatedObj.rotation.y = timeSec * 8.5;
      } else {
        deepSkyAnimatedObj.rotation.y = timeSec * 0.15;
      }
    }
  }
  updateOrbitingMoons(0);

  return {
    rootGroup,
    planetGroup,
    planetMesh,
    planetMat,
    starGroup,
    hostStarMesh,
    starMat,
    quadrantOverlayGroup,
    quadrantMeshes,
    moonsGroup,
    moonsList,
    updateOrbitingMoons,
    profile
  };
}

// Build an Entire Star System 3D Orrery (Host Star + Habitable Zone + All System Planets & Moons)
export function buildStarSystemOrrery(selectedWorld, allCatalogWorlds) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'StarSystemOrreryRoot';
  const earthTex = getEarthContinentTexture();

  // 1. Identify all planets belonging to the selected world's Star System
  let systemPlanets = [];
  let hostTitle = selectedWorld.hostname || 'Sol (Our Sun)';

  if (selectedWorld.isSolarSystem) {
    hostTitle = 'Sol (Our Sun)';
    systemPlanets = allCatalogWorlds.filter(
      w => w.isSolarSystem && (w.bodyType === 'planet' || w.bodyType === 'dwarf_planet')
    );
  } else if (selectedWorld.isDeepSky) {
    hostTitle = selectedWorld.hostname || selectedWorld.id;
    if (Array.isArray(selectedWorld.moons) && selectedWorld.moons.length > 0) {
      systemPlanets = selectedWorld.moons.map((m, idx) => ({
        id: m.name,
        pl_name: m.name,
        hostname: hostTitle,
        pl_rade: Math.max(0.8, (m.radiusRatio || 0.16) * 8.0),
        pl_radj: 0.1,
        pl_orbsmax: Number((0.4 + idx * 0.65).toFixed(2)),
        pl_orbper: Math.round(45 * (idx + 1)),
        pl_eqt: 290 - idx * 45,
        distance: selectedWorld.distance,
        dist_pc: selectedWorld.dist_pc
      }));
    } else {
      systemPlanets = [selectedWorld];
    }
  } else {
    const hName = selectedWorld.hostname || '';
    const is40Eri = hName.includes('40 Eridani') || hName.includes('HD 26965');
    const isAlphaCen = hName.includes('Alpha Centauri') || hName.includes('Rigil Kentaurus') || hName.includes('Proxima');
    systemPlanets = allCatalogWorlds.filter(w => {
      if (w.isSolarSystem || w.isDeepSky) return false;
      if (w.hostname === hName) return true;
      if (is40Eri && ((w.hostname || '').includes('40 Eridani') || (w.hostname || '').includes('HD 26965'))) return true;
      if (isAlphaCen && ((w.hostname || '').includes('Alpha Centauri') || (w.hostname || '').includes('Proxima'))) return true;
      return false;
    });
  }

  // Sort planets from innermost to outermost semi-major axis (pl_orbsmax)
  systemPlanets = systemPlanets.slice().sort((a, b) => (a.pl_orbsmax || 0.5) - (b.pl_orbsmax || 0.5));

  // Determine which planet in the system should be highlighted (if a moon is selected, highlight its parent planet)
  const targetPlanetId = selectedWorld.parentBody || selectedWorld.id;

  // 2. Central Host Star (or Central Black Hole / Deep-Sky Core)
  const stTeff = selectedWorld.st_teff || 5778;
  const starColor = teffToColor(stTeff);
  const centralRadius = 1.45;

  const starMat = new THREE.ShaderMaterial({
    vertexShader: PLANET_VERTEX_SHADER,
    fragmentShader: STAR_SURFACE_FRAGMENT_SHADER,
    uniforms: {
      uStarColor: { value: starColor },
      uTime: { value: 0.0 }
    }
  });

  const centralStarMesh = new THREE.Mesh(
    new THREE.SphereGeometry(centralRadius, 48, 48),
    selectedWorld.deepSkyType === 'black_hole'
      ? new THREE.MeshBasicMaterial({ color: 0x000000 })
      : starMat
  );
  centralStarMesh.userData = {
    isHostStar: true,
    data: {
      'System Host': hostTitle,
      'Spectral Class': selectedWorld.st_spectype || 'G2 V',
      'Effective Temp': `${stTeff} K`,
      'System Worlds': `${systemPlanets.length} Orbiting Bodies`,
      'Distance from Earth': selectedWorld.isSolarSystem ? '0 ly (Home Solar System)' : `${selectedWorld.distance} ly`
    }
  };
  rootGroup.add(centralStarMesh);

  const coronaSprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createCoronaTexture(selectedWorld.deepSkyType === 'black_hole' ? 0xff6b00 : starColor.getHex()),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })
  );
  coronaSprite.scale.set(centralRadius * 4.5, centralRadius * 4.5, 1);
  rootGroup.add(coronaSprite);

  const hostBadge = createBadgeSprite(`☀️ ${hostTitle}`, starColor.getHex(), 0.48);
  hostBadge.position.set(0, centralRadius + 1.0, 0);
  rootGroup.add(hostBadge);

  // If binary/multi-star system (sy_snum >= 2), render companion star!
  if ((selectedWorld.sy_snum || 1) >= 2 && !selectedWorld.isSolarSystem) {
    const compStar = new THREE.Mesh(
      new THREE.SphereGeometry(centralRadius * 0.55, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffb366 })
    );
    compStar.position.set(-2.1, 0.2, -1.2);
    const compBadge = createBadgeSprite(`☀️ ${hostTitle} B (Companion Star)`, 0xffb366, 0.32);
    compBadge.position.set(0, centralRadius * 0.75, 0);
    compStar.add(compBadge);
    rootGroup.add(compStar);
  }

  // 3. Habitable Zone Band (Translucent Emerald Ring)
  // Find which visual orbit indices correspond to habitable temperatures (195 K <= pl_eqt <= 330 K)
  let hzInnerVis = 5.4;
  let hzOuterVis = 8.4;
  const habIndices = [];
  systemPlanets.forEach((p, i) => {
    if (p.pl_eqt >= 195 && p.pl_eqt <= 330) habIndices.push(i);
  });
  if (habIndices.length > 0) {
    hzInnerVis = 3.6 + Math.min(...habIndices) * 2.55 - 0.85;
    hzOuterVis = 3.6 + Math.max(...habIndices) * 2.55 + 0.85;
  }
  const hzGeo = new THREE.RingGeometry(hzInnerVis, hzOuterVis, 128);
  const hzMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.11,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const hzMesh = new THREE.Mesh(hzGeo, hzMat);
  hzMesh.rotation.x = Math.PI / 2;
  rootGroup.add(hzMesh);

  // 4. Build All System Planets, Elliptical Orbits & Moons
  const animatedSystemNodes = [];
  const planetMaterials = [];

  systemPlanets.forEach((p, idx) => {
    const pProfile = classifyPlanet(p);
    const isTarget = p.id === targetPlanetId;
    const orbitR = 3.6 + idx * 2.55;
    const ecc = Math.min(0.38, p.pl_orbeccen || 0);
    const semiMinor = orbitR * Math.sqrt(1 - ecc * ecc);
    const focusOffset = orbitR * ecc * 0.45;

    // Elliptical Orbit Track
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(a) * orbitR - focusOffset,
        0,
        Math.sin(a) * semiMinor
      ));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color: isTarget ? 0x38bdf8 : 0x334155,
        transparent: true,
        opacity: isTarget ? 0.92 : 0.48
      })
    );
    rootGroup.add(orbitLine);

    // Planet Node Container
    const pNode = new THREE.Group();
    const rade = p.pl_rade || 1.0;
    const pRadius = Math.max(0.24, Math.min(0.88, 0.28 * Math.pow(rade, 0.34)));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: PLANET_VERTEX_SHADER,
      fragmentShader: PLANET_FRAGMENT_SHADER,
      uniforms: {
        uMode: { value: pProfile.shaderMode },
        uUseEarthTex: { value: pProfile.useEarthMap ? 1 : 0 },
        uEarthTex: { value: earthTex },
        uSeed: { value: pProfile.seed },
        uTime: { value: 0.0 },
        uPrimary: { value: pProfile.primaryColor },
        uSecondary: { value: pProfile.secondaryColor },
        uAccent: { value: pProfile.accentColor },
        uAtmo: { value: pProfile.atmoColor },
        uLightDir: { value: new THREE.Vector3(-1, 0.2, 0).normalize() }
      }
    });
    planetMaterials.push(pMat);

    const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pRadius, 48, 48), pMat);
    pMesh.scale.set(1.0, 1.0 - pProfile.oblateness, 1.0);
    pMesh.userData = {
      isSystemPlanet: true,
      planetData: p,
      profile: pProfile
    };
    pNode.add(pMesh);

    // Highlight ring around currently selected planet
    if (isTarget) {
      const selRing = new THREE.Mesh(
        new THREE.RingGeometry(pRadius * 1.35, pRadius * 1.52, 48),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide })
      );
      selRing.rotation.x = Math.PI / 2;
      pNode.add(selRing);
    }

    // Planetary Rings (e.g. Saturn, Uranus, ringed exoplanets)
    if (pProfile.hasRings) {
      const rMesh = new THREE.Mesh(
        new THREE.RingGeometry(pRadius * 1.35, pRadius * 2.15, 64),
        new THREE.MeshBasicMaterial({
          color: pProfile.secondaryColor,
          transparent: true,
          opacity: 0.68,
          side: THREE.DoubleSide
        })
      );
      rMesh.rotation.x = Math.PI / 2 - 0.25;
      pNode.add(rMesh);
    }

    // Orbiting Moons around this Planet in the System View
    const pMoons = getMoonsForPlanet(p, pProfile);
    const moonNodes = [];
    pMoons.forEach((m, mIdx) => {
      const mOrbitR = pRadius * (1.65 + mIdx * 0.45);
      const mRad = Math.max(0.05, pRadius * 0.22);
      const mCol = new THREE.Color(m.color || 0xcbd5e1);
      const mMesh = new THREE.Mesh(
        new THREE.SphereGeometry(mRad, 16, 16),
        new THREE.MeshPhongMaterial({
          color: mCol,
          emissive: mCol.clone().multiplyScalar(0.5)
        })
      );
      mMesh.userData = {
        isSystemPlanet: true,
        planetData: p,
        moonName: m.name
      };
      pNode.add(mMesh);
      moonNodes.push({
        mesh: mMesh,
        orbitR: mOrbitR,
        speed: (m.speed || 0.8) * 1.8,
        phase: mIdx * 1.9
      });
    });

    // Clickable Planet Label Badge
    const shortName = p.id.split(' (')[0];
    const auText = p.pl_orbsmax ? `${p.pl_orbsmax} AU` : '';
    const pBadge = createBadgeSprite(
      `${p.isEarth ? '🌍' : '🪐'} ${shortName} (${auText})`,
      isTarget ? 0x00ffff : 0x60a5fa,
      isTarget ? 0.42 : 0.34
    );
    pBadge.position.set(0, pRadius + 0.65, 0);
    pBadge.userData = pMesh.userData;
    pNode.add(pBadge);

    rootGroup.add(pNode);

    const orbitalSpeed = 0.32 / Math.pow(idx + 1, 0.65);
    animatedSystemNodes.push({
      node: pNode,
      pMat,
      orbitR,
      semiMinor,
      focusOffset,
      speed: orbitalSpeed,
      phase: idx * 1.35 + pProfile.seed * 6.28,
      moonNodes
    });
  });

  // 5. Asteroid Belt for Solar System (between Mars index 3 and Jupiter index 4)
  if (selectedWorld.isSolarSystem && systemPlanets.length >= 5) {
    const beltR = 3.6 + 3.5 * 2.55;
    const beltCount = 1200;
    const bPos = new Float32Array(beltCount * 3);
    for (let i = 0; i < beltCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = beltR + (Math.random() - 0.5) * 1.1;
      const y = (Math.random() - 0.5) * 0.35;
      bPos[i * 3] = Math.cos(a) * r;
      bPos[i * 3 + 1] = y;
      bPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const beltGeo = new THREE.BufferGeometry();
    beltGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    const beltPoints = new THREE.Points(
      beltGeo,
      new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.06, transparent: true, opacity: 0.65 })
    );
    rootGroup.add(beltPoints);
  }

  function updateOrrery(timeSec) {
    starMat.uniforms.uTime.value = timeSec;
    animatedSystemNodes.forEach(item => {
      const angle = timeSec * item.speed + item.phase;
      const x = Math.cos(angle) * item.orbitR - item.focusOffset;
      const z = Math.sin(angle) * item.semiMinor;
      item.node.position.set(x, 0, z);

      // Update light direction on planet shader so dayside always faces the central star at (0,0,0)
      const toStar = new THREE.Vector3(-x, 0.25, -z).normalize();
      item.pMat.uniforms.uLightDir.value.copy(toStar);
      item.pMat.uniforms.uTime.value = timeSec;

      item.moonNodes.forEach(mn => {
        const mAngle = timeSec * mn.speed + mn.phase;
        mn.mesh.position.set(
          Math.cos(mAngle) * mn.orbitR,
          0.05 * Math.sin(mAngle),
          Math.sin(mAngle) * mn.orbitR
        );
      });
    });
  }
  updateOrrery(0);

  return {
    rootGroup,
    systemPlanetsCount: systemPlanets.length,
    maxOrbitRadius: 3.6 + systemPlanets.length * 2.55,
    updateOrrery
  };
}

