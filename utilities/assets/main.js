import * as THREE from './threen.js';
import { OrbitControls } from './OrbitControls.js';
import {
  PLANETARY_QUADRANTS,
  SOLAR_SYSTEM_BODIES,
  POPULAR_MEDIA_SYSTEMS,
  DEEP_SKY_OBJECTS,
  SPACE_MISSIONS_AND_STATIONS,
  NAMED_STARS,
  IAU_CONSTELLATIONS,
  getExpeditionsForWorld,
  computeTelemetryAndTravelGuide
} from './constellations_data.js';
import {
  bvToColor,
  bvToTeff,
  teffToColor,
  classifyPlanet,
  buildCelestialSystem,
  buildStarSystemOrrery,
  createBadgeSprite
} from './celestialRenderer.js';

const SKY_RADIUS = 500;
const PARSEC_TO_LY = 3.26156;
const KM_PER_AU = 149597870.7;
const DEFAULT_SKY_FOV = 65;
const MIN_SKY_FOV = 8;
const MAX_SKY_FOV = 90;

// Application State
let exoplanets = [];
let filteredPlanets = [];
let starsCatalog = [];
let currentPlanet = null;
let currentQuadrantId = 'Q1';
let viewMode = 'sky'; // 'sky' | 'inspector' | 'system'
let skyFov = DEFAULT_SKY_FOV;

// Overlay & Filter State
let showIAUConstellations = true;
let showDeepSky = true;
let showHorizonCompass = true;
let belowHorizonMode = 'dimmed'; // 'dimmed' | 'hidden' | 'full'
let showStarLabels = true;
let allStarsDimmed = false;

// Custom Constellation State
let selectedStars = [];
let customConstellations = [];
let highlightedStarIndices = new Set();
let individuallyDimmedStars = new Set();

// Active Sky Data for Current Planet + Quadrant
let activeSkyStars = [];
let starByHipMap = new Map();
let currentEarthHorizonInfo = {
  distText: '0 km (Home World)',
  azDeg: 180,
  altDeg: 0,
  compass: 'S',
  horizonPos: new THREE.Vector3(0, 0, SKY_RADIUS * 0.98)
};

// Three.js Scenes, Cameras & Groups
const container = document.getElementById('starChartContainer');
const skyScene = new THREE.Scene();
skyScene.background = new THREE.Color(0x02050d);

const inspectorScene = new THREE.Scene();
const systemScene = new THREE.Scene();
systemScene.background = new THREE.Color(0x02050d);

const skyCamera = new THREE.PerspectiveCamera(65, 1, 0.1, 2000);
const inspectorCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
const systemCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 2500);
const miniGlobeCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;
container.appendChild(renderer.domElement);

// OrbitControls for Sky Mode (looking outward from center of dome; optical FOV zoom handles zooming)
const skyControls = new OrbitControls(skyCamera, renderer.domElement);
skyControls.enableDamping = true;
skyControls.dampingFactor = 0.06;
skyControls.enablePan = false;
skyControls.enableZoom = false;
skyControls.rotateSpeed = -0.45;

// OrbitControls for Up-Close Planet/Star Inspector Mode
const inspectorControls = new OrbitControls(inspectorCamera, renderer.domElement);
inspectorControls.enableDamping = true;
inspectorControls.dampingFactor = 0.06;
inspectorControls.enablePan = true;
inspectorControls.minDistance = 1.35;
inspectorControls.maxDistance = 42.0;
inspectorControls.enabled = false;

// OrbitControls for Entire Star System Orrery Mode
const systemControls = new OrbitControls(systemCamera, renderer.domElement);
systemControls.enableDamping = true;
systemControls.dampingFactor = 0.06;
systemControls.enablePan = true;
systemControls.minDistance = 3.0;
systemControls.maxDistance = 350.0;
systemControls.enabled = false;

// Scene Subgroups
let skyStarsPoints = null;
let skyStarGeometry = null;
let skyStarMaterial = null;
const iauGroup = new THREE.Group();
const horizonCompassGroup = new THREE.Group();
const earthBeaconGroup = new THREE.Group(); // Always visible on horizon!
const solarSystemSkyGroup = new THREE.Group(); // Solar System planets & moons in the sky
const spaceMissionsSkyGroup = new THREE.Group(); // Space Stations, Telescopes, Probes & SETI markers in the sky
const deepSkyGroup = new THREE.Group(); // Black Holes, Galaxies, Nebulae, Pulsars & Clusters in the sky
const labelsGroup = new THREE.Group();
const customLinesGroup = new THREE.Group();

skyScene.add(iauGroup);
skyScene.add(horizonCompassGroup);
skyScene.add(earthBeaconGroup);
skyScene.add(solarSystemSkyGroup);
skyScene.add(spaceMissionsSkyGroup);
skyScene.add(deepSkyGroup);
skyScene.add(labelsGroup);
skyScene.add(customLinesGroup);

// Inspector Scene Lighting (Brightened so dark side of planets & moons is clearly visible)
const inspectorAmbient = new THREE.AmbientLight(0xffffff, 0.75);
inspectorScene.add(inspectorAmbient);
const inspectorKeyLight = new THREE.DirectionalLight(0xffffff, 1.15);
inspectorKeyLight.position.set(6.5, 1.5, 3.0);
inspectorScene.add(inspectorKeyLight);
const inspectorBackFillLight = new THREE.DirectionalLight(0x93c5fd, 0.55);
inspectorBackFillLight.position.set(-6.0, -2.0, -4.0);
inspectorScene.add(inspectorBackFillLight);

// Entire Star System Scene Lighting
const systemAmbient = new THREE.AmbientLight(0xffffff, 0.82);
systemScene.add(systemAmbient);
const systemKeyLight = new THREE.PointLight(0xffffff, 1.6, 500);
systemKeyLight.position.set(0, 0, 0);
systemScene.add(systemKeyLight);
const systemFillLight = new THREE.DirectionalLight(0x93c5fd, 0.65);
systemFillLight.position.set(15, 25, 18);
systemScene.add(systemFillLight);

let activeCelestialSystem = null;
let activeSystemOrrery = null;
let inspectorBgStars = null;
let systemBgStars = null;

// Precompute 3D ICRS Cartesian coordinates (in parsecs) for each catalog star
function precomputeStarCatalogCartesian() {
  starsCatalog.forEach(star => {
    if (star.isSun) {
      star.posPc = new THREE.Vector3(0, 0, 0);
      star.color = bvToColor(star.B_V);
      star.teff = 5778;
      return;
    }
    const raRad = THREE.MathUtils.degToRad(star.RAJ2000);
    const decRad = THREE.MathUtils.degToRad(star.DEJ2000);
    const distPc = 1000.0 / Math.max(0.25, star.Plx);
    star.distPcEarth = distPc;
    star.posPc = new THREE.Vector3(
      distPc * Math.cos(decRad) * Math.cos(raRad),
      distPc * Math.cos(decRad) * Math.sin(raRad),
      distPc * Math.sin(decRad)
    );
    star.color = bvToColor(star.B_V);
    star.teff = Math.round(bvToTeff(star.B_V));
  });
}

function sphericalToCartesianPc(raDeg, decDeg, distPc) {
  const raRad = THREE.MathUtils.degToRad(raDeg);
  const decRad = THREE.MathUtils.degToRad(decDeg);
  return new THREE.Vector3(
    distPc * Math.cos(decRad) * Math.cos(raRad),
    distPc * Math.cos(decRad) * Math.sin(raRad),
    distPc * Math.sin(decRad)
  );
}

// Compute orthonormal local horizon basis (East, Zenith/Up, North) in ICRS frame
function getQuadrantBasisICRS(quadrant) {
  const latRad = THREE.MathUtils.degToRad(quadrant.centerLat);
  const lonRad = THREE.MathUtils.degToRad(quadrant.centerLon);

  const zenith = new THREE.Vector3(
    Math.cos(latRad) * Math.cos(lonRad),
    Math.cos(latRad) * Math.sin(lonRad),
    Math.sin(latRad)
  ).normalize();

  const east = new THREE.Vector3(
    -Math.sin(lonRad),
    Math.cos(lonRad),
    0
  ).normalize();

  const north = new THREE.Vector3().crossVectors(zenith, east).normalize();
  return { east, zenith, north };
}

function azimuthToCompass16(azDeg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(((azDeg % 360) + 360) % 360 / 22.5) % 16;
  return dirs[idx];
}

// Format human-readable distance from selected planet/moon/station/exoplanet/deep-sky object to Earth
export function formatDistanceToEarth(planet) {
  if (!planet || planet.isEarth) {
    return '0 km (Home World)';
  }
  if (planet.isSolarSystem || (planet.isSpaceMission && planet.dist_km_from_earth !== undefined)) {
    const km = planet.dist_km_from_earth || 0;
    if (km < 2000000) {
      return `${km.toLocaleString('en-US')} km`;
    }
    const millionKm = (km / 1e6).toFixed(1);
    const au = (km / KM_PER_AU).toFixed(2);
    return `${millionKm}M km (${au} AU)`;
  }
  const ly = Number(planet.distance || 0);
  if (ly >= 1e9) {
    return `${(ly / 1e9).toFixed(2)}B ly`;
  }
  if (ly >= 1e6) {
    return `${(ly / 1e6).toFixed(2)}M ly`;
  }
  if (ly >= 1000) {
    return `${Math.round(ly).toLocaleString('en-US')} ly`;
  }
  return `${planet.distance} ly (${planet.dist_pc} pc)`;
}

// Custom GPU Star Shader
const SKY_STAR_VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (650.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const SKY_STAR_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.01) discard;
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv) * 2.0;
    if (d > 1.0) discard;

    float core = smoothstep(0.42, 0.0, d);
    float halo = pow(max(0.0, 1.0 - d), 2.6) * 0.65;
    float intensity = clamp(core + halo, 0.0, 1.0);

    vec3 finalCol = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.65);
    gl_FragColor = vec4(finalCol, intensity * vAlpha);
  }
`;

// Build the Local Horizon Ring, Altitude/Azimuth Dome Grid & N/E/S/W Compass Markers
function buildHorizonAndCompassGrid(quadrant) {
  while (horizonCompassGroup.children.length > 0) {
    const child = horizonCompassGroup.children[0];
    horizonCompassGroup.remove(child);
    if (child.geometry) child.geometry.dispose();
  }

  const groundGeo = new THREE.SphereGeometry(
    SKY_RADIUS * 0.995,
    48,
    24,
    0,
    Math.PI * 2,
    Math.PI / 2,
    Math.PI / 2
  );
  const groundMat = new THREE.MeshBasicMaterial({
    color: 0x050d1a,
    transparent: true,
    opacity: belowHorizonMode === 'full' ? 0.0 : 0.42,
    side: THREE.BackSide,
    depthWrite: false
  });
  const groundDome = new THREE.Mesh(groundGeo, groundMat);
  groundDome.name = 'HorizonGroundDome';
  horizonCompassGroup.add(groundDome);

  const altitudes = [
    { deg: 0, color: 0x38bdf8, opacity: 0.78 },
    { deg: 30, color: 0x1e3a5f, opacity: 0.35 },
    { deg: 60, color: 0x1e3a5f, opacity: 0.35 }
  ];

  altitudes.forEach(({ deg, color, opacity }) => {
    const altRad = THREE.MathUtils.degToRad(deg);
    const y = SKY_RADIUS * 0.99 * Math.sin(altRad);
    const r = SKY_RADIUS * 0.99 * Math.cos(altRad);
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(r * Math.sin(a), y, -r * Math.cos(a)));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    );
    horizonCompassGroup.add(line);
  });

  for (let az = 0; az < 360; az += 45) {
    const azRad = THREE.MathUtils.degToRad(az);
    const pts = [];
    for (let alt = 0; alt <= 90; alt += 5) {
      const altRad = THREE.MathUtils.degToRad(alt);
      const r = SKY_RADIUS * 0.99 * Math.cos(altRad);
      const y = SKY_RADIUS * 0.99 * Math.sin(altRad);
      pts.push(new THREE.Vector3(r * Math.sin(azRad), y, -r * Math.cos(azRad)));
    }
    const arc = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.28 })
    );
    horizonCompassGroup.add(arc);
  }

  const compassPoints = [
    { label: 'N · 0°', az: 0, color: 0x38bdf8, size: 28 },
    { label: 'NE', az: 45, color: 0x64748b, size: 19 },
    { label: 'E · 90°', az: 90, color: 0x38bdf8, size: 26 },
    { label: 'SE', az: 135, color: 0x64748b, size: 19 },
    { label: 'S · 180°', az: 180, color: 0xf59e0b, size: 26 },
    { label: 'SW', az: 225, color: 0x64748b, size: 19 },
    { label: 'W · 270°', az: 270, color: 0x38bdf8, size: 26 },
    { label: 'NW', az: 315, color: 0x64748b, size: 19 }
  ];

  compassPoints.forEach(cp => {
    const azRad = THREE.MathUtils.degToRad(cp.az);
    const sprite = createBadgeSprite(cp.label, cp.color, cp.size);
    sprite.position.set(
      (SKY_RADIUS - 12) * Math.sin(azRad),
      10,
      -(SKY_RADIUS - 12) * Math.cos(azRad)
    );
    horizonCompassGroup.add(sprite);
  });

  const zenithBadge = createBadgeSprite(`⊕ ZENITH (${quadrant.id})`, quadrant.color, 24);
  zenithBadge.position.set(0, SKY_RADIUS - 12, 0);
  horizonCompassGroup.add(zenithBadge);

  horizonCompassGroup.visible = showHorizonCompass;
}

// Build Always-Visible Earth Horizon Beacon + Visible Solar System Planets & Moons in Sky
function buildEarthHorizonBeaconAndSolarSystemSky(planet, quadrant) {
  while (earthBeaconGroup.children.length > 0) {
    const c = earthBeaconGroup.children[0];
    earthBeaconGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
  }
  while (solarSystemSkyGroup.children.length > 0) {
    const c = solarSystemSkyGroup.children[0];
    solarSystemSkyGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
  }

  const { east, zenith, north } = getQuadrantBasisICRS(quadrant);
  const distText = formatDistanceToEarth(planet);

  // 1. Always-Visible Earth Horizon Beacon (with Distance from Selected Planet/Object)
  if (planet.isEarth) {
    // When on Earth itself, pin the Home Horizon marker at South (Az 180°, Alt 0°)
    const azDeg = 180;
    const azRad = THREE.MathUtils.degToRad(azDeg);
    const hPos = new THREE.Vector3(
      (SKY_RADIUS - 8) * Math.sin(azRad),
      0,
      -(SKY_RADIUS - 8) * Math.cos(azRad)
    );
    const earthHorizonBadge = createBadgeSprite(
      `🌍 EARTH HORIZON · 0 km (Home · ${quadrant.shortLabel})`,
      0x10b981,
      23
    );
    earthHorizonBadge.position.set(hPos.x, -14, hPos.z);
    earthHorizonBadge.renderOrder = 999;
    earthBeaconGroup.add(earthHorizonBadge);

    currentEarthHorizonInfo = {
      distText: '0 km (Home World)',
      azDeg: 180,
      altDeg: 0,
      compass: 'S',
      horizonPos: hPos
    };
  } else {
    // Compute 3D vector from selected body back to Earth in ICRS
    let dirToEarthICRS;
    if (planet.isSolarSystem) {
      // Earth is at (1.0, 0.0, 0.0) AU in our heliocentric J2000 reference
      const dx = 1.0 - (planet.x_au ?? 0);
      const dy = 0.0 - (planet.y_au ?? 0);
      const dz = 0.0 - (planet.z_au ?? 0);
      dirToEarthICRS = new THREE.Vector3(dx, dy, dz).normalize();
    } else {
      // For Exoplanets, Earth is at origin (0,0,0), so vector to Earth is -planetPosPc
      const exoPos = sphericalToCartesianPc(planet.ra, planet.dec, planet.dist_pc || 10);
      dirToEarthICRS = exoPos.negate().normalize();
    }

    const localEast = dirToEarthICRS.dot(east);
    const localUp = dirToEarthICRS.dot(zenith);
    const localNorth = dirToEarthICRS.dot(north);

    const altDeg = Number(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, localUp)))).toFixed(1));
    const azRad = Math.atan2(localEast, localNorth);
    const azDeg = Number(((THREE.MathUtils.radToDeg(azRad) + 360) % 360).toFixed(1));
    const compass = azimuthToCompass16(azDeg);
    const altArrow = altDeg >= 0 ? `Alt +${altDeg}°▲` : `Alt ${altDeg}°▼`;

    // Position on the Horizon Ring (Alt = 0°) at Earth's exact Azimuth bearing
    const horizonRadius = SKY_RADIUS - 8;
    const horizonPos = new THREE.Vector3(
      horizonRadius * Math.sin(azRad),
      0,
      -horizonRadius * Math.cos(azRad)
    );

    // Glowing Emerald-Blue Beacon Marker on the Horizon Ring
    const beaconMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5.5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    beaconMesh.position.copy(horizonPos);
    beaconMesh.userData = {
      isSolarSystemSkyBody: true,
      skyPos: horizonPos.clone(),
      targetObjectId: 'Earth (Sol System)',
      data: {
        Object: '🌍 Earth (Horizon Bearing Beacon)',
        'Distance from Current World': distText,
        'Horizon Bearing': `${compass} (Azimuth ${azDeg}°)`,
        'True Sky Altitude': `${altDeg}° (${altDeg >= 0 ? 'Above Horizon' : 'Below Horizon'})`,
        Note: 'This horizon beacon is always pinned at Earth\'s azimuth so you can orient yourself toward home!',
        _targetObjectId: 'Earth (Sol System)'
      }
    };
    earthBeaconGroup.add(beaconMesh);

    // Prominent Always-Visible Horizon Label for Earth + Distance
    const horizonBadge = createBadgeSprite(
      `🌍 EARTH: ${distText} · ${compass} (Az ${azDeg}°, ${altArrow})`,
      0x10b981,
      24
    );
    horizonBadge.position.set(horizonPos.x, 22, horizonPos.z);
    horizonBadge.renderOrder = 999;
    horizonBadge.userData = { ...beaconMesh.userData, skyPos: horizonPos.clone() };
    earthBeaconGroup.add(horizonBadge);

    // True 3D Sky Position of Earth + Vertical Meridian Guide Arc connecting to Horizon
    const trueSkyPos = new THREE.Vector3(
      localEast * horizonRadius,
      localUp * horizonRadius,
      -localNorth * horizonRadius
    );

    const earthTrueOrb = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    earthTrueOrb.position.copy(trueSkyPos);
    earthTrueOrb.userData = { ...beaconMesh.userData, skyPos: trueSkyPos.clone() };
    earthBeaconGroup.add(earthTrueOrb);

    const trueLabel = createBadgeSprite(
      `🌍 Earth True Sky Pos (${distText})`,
      0x38bdf8,
      16
    );
    trueLabel.position.copy(trueSkyPos).add(new THREE.Vector3(0, 14, 0));
    trueLabel.userData = { ...beaconMesh.userData, skyPos: trueSkyPos.clone() };
    earthBeaconGroup.add(trueLabel);

    // Vertical meridian arc from Horizon (0°) to Earth's true altitude (altDeg)
    const arcPts = [];
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const a = THREE.MathUtils.degToRad((altDeg * i) / steps);
      const r = horizonRadius * Math.cos(a);
      const y = horizonRadius * Math.sin(a);
      arcPts.push(new THREE.Vector3(r * Math.sin(azRad), y, -r * Math.cos(azRad)));
    }
    const guideLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arcPts),
      new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.72 })
    );
    earthBeaconGroup.add(guideLine);

    currentEarthHorizonInfo = {
      distText,
      azDeg,
      altDeg,
      compass,
      horizonPos
    };
  }

  // Update Top Bar Earth Horizon Readout Pill
  const earthPill = document.getElementById('earthHorizonReadout');
  if (earthPill) {
    if (planet.isEarth) {
      earthPill.innerHTML = `🌍 Earth Horizon: <strong>0 km (Home World · ${quadrant.shortLabel})</strong>`;
    } else {
      const sign = currentEarthHorizonInfo.altDeg >= 0 ? '+' : '';
      earthPill.innerHTML = `🌍 Earth on Horizon: <strong>${currentEarthHorizonInfo.distText}</strong> · ${currentEarthHorizonInfo.compass} (Az ${currentEarthHorizonInfo.azDeg}°, Alt ${sign}${currentEarthHorizonInfo.altDeg}°)`;
    }
  }

  // 2. Render Visible Solar System Planets & Major Moons in the Sky when on a Solar System Body
  if (planet.isSolarSystem) {
    const curX = planet.x_au ?? 1.0;
    const curY = planet.y_au ?? 0.0;
    const curZ = planet.z_au ?? 0.0;

    SOLAR_SYSTEM_BODIES.forEach(body => {
      if (body.id === planet.id || body.isEarth) return; // Earth already rendered by earthBeaconGroup

      // Only show moons if they belong to the current planet (e.g. Moon from Earth, Galilean moons from Jupiter)
      // or if we are on a moon looking at sibling moons / parent planet
      if (body.bodyType === 'moon') {
        const isOurMoon = body.parentBody === planet.id;
        const isSiblingMoon = planet.parentBody && body.parentBody === planet.parentBody;
        if (!isOurMoon && !isSiblingMoon) return;
      }

      const dx = (body.x_au ?? 0) - curX;
      const dy = (body.y_au ?? 0) - curY;
      const dz = (body.z_au ?? 0) - curZ;
      const distAu = Math.hypot(dx, dy, dz);
      if (distAu < 1e-7) return;

      const dirICRS = new THREE.Vector3(dx, dy, dz).normalize();
      const lEast = dirICRS.dot(east);
      const lUp = dirICRS.dot(zenith);
      const lNorth = dirICRS.dot(north);

      const altDeg = Number(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, lUp)))).toFixed(1));
      if (altDeg < 0 && belowHorizonMode === 'hidden') return;

      const azRad = Math.atan2(lEast, lNorth);
      const azDeg = Number(((THREE.MathUtils.radToDeg(azRad) + 360) % 360).toFixed(1));
      const compass = azimuthToCompass16(azDeg);

      const skyPos = new THREE.Vector3(
        lEast * (SKY_RADIUS - 14),
        lUp * (SKY_RADIUS - 14),
        -lNorth * (SKY_RADIUS - 14)
      );

      const isMoon = body.bodyType === 'moon';
      const isParent = planet.parentBody === body.id;
      const discRadius = isParent ? 14.0 : isMoon ? 6.0 : 4.2;
      const discColor = isMoon ? 0xe2e8f0 : 0xfbbf24;

      const bodyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(discRadius, 20, 20),
        new THREE.MeshBasicMaterial({
          color: discColor,
          transparent: true,
          opacity: altDeg >= 0 ? 1.0 : 0.35
        })
      );
      bodyMesh.position.copy(skyPos);

      const distKm = Math.round(distAu * KM_PER_AU);
      const distLabel = distKm < 2000000
        ? `${distKm.toLocaleString('en-US')} km`
        : `${(distKm / 1e6).toFixed(1)}M km (${distAu.toFixed(2)} AU)`;

      bodyMesh.userData = {
        isSolarSystemSkyBody: true,
        skyPos: skyPos.clone(),
        targetPlanetId: body.id,
        targetObjectId: body.id,
        data: {
          Object: body.id,
          Type: body.bodyType === 'moon' ? `Moon of ${body.parentBody}` : 'Solar System Planet',
          'Distance from Current World': distLabel,
          'Distance from Earth': formatDistanceToEarth(body),
          'Where to Look': `${compass} (Azimuth ${azDeg}°, Altitude ${altDeg}°)`,
          Radius: `${body.pl_rade} R⊕`,
          'Equilibrium Temp': `${body.pl_eqt} K`,
          _targetObjectId: body.id
        }
      };
      solarSystemSkyGroup.add(bodyMesh);

      const shortName = body.id.split(' (')[0];
      const icon = isMoon ? '🌕' : '🪐';
      const badge = createBadgeSprite(
        `${icon} ${shortName} (${distKm < 2000000 ? distLabel : distAu.toFixed(2) + ' AU'})`,
        isMoon ? 0xcbd5e1 : 0xf59e0b,
        isParent ? 18 : 13.5
      );
      badge.position.copy(skyPos).add(new THREE.Vector3(0, discRadius + 9, 0));
      badge.material.opacity = altDeg >= 0 ? 0.92 : 0.32;
      badge.userData = bodyMesh.userData;
      solarSystemSkyGroup.add(badge);
    });
  }
}

// Render Black Holes, Galaxies, Nebulae, Pulsars & Clusters on the Sky Dome
function buildDeepSkyObjectsInSky(planet, quadrant) {
  while (deepSkyGroup.children.length > 0) {
    const c = deepSkyGroup.children[0];
    deepSkyGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
  }

  const { east, zenith, north } = getQuadrantBasisICRS(quadrant);
  const planetPosPc = planet.isEarth
    ? new THREE.Vector3(0, 0, 0)
    : sphericalToCartesianPc(planet.ra, planet.dec, planet.dist_pc || 0);

  DEEP_SKY_OBJECTS.forEach(dso => {
    if (dso.id === planet.id) return;

    const dsoPosPc = sphericalToCartesianPc(dso.ra, dso.dec, dso.dist_pc || 1000);
    const relVec = dsoPosPc.sub(planetPosPc);
    const distPc = relVec.length();
    if (distPc < 1e-6) return;

    const dirICRS = relVec.normalize();
    const lEast = dirICRS.dot(east);
    const lUp = dirICRS.dot(zenith);
    const lNorth = dirICRS.dot(north);

    const altDeg = Number(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, lUp)))).toFixed(1));
    if (altDeg < 0 && belowHorizonMode === 'hidden') return;

    const azRad = Math.atan2(lEast, lNorth);
    const azDeg = Number(((THREE.MathUtils.radToDeg(azRad) + 360) % 360).toFixed(1));
    const compass = azimuthToCompass16(azDeg);

    const skyPos = new THREE.Vector3(
      lEast * (SKY_RADIUS - 18),
      lUp * (SKY_RADIUS - 18),
      -lNorth * (SKY_RADIUS - 18)
    );

    const opacity = altDeg >= 0 ? 0.95 : 0.32;
    let icon = '🌀';
    let badgeColor = 0xc084fc;
    let markerMesh;
    const dsoType = dso.deepSkyType || dso.bodyType;

    if (dsoType === 'black_hole') {
      icon = '🕳️';
      badgeColor = 0xf97316;
      const bhGroup = new THREE.Group();
      const eh = new THREE.Mesh(
        new THREE.SphereGeometry(5.0, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      const disk = new THREE.Mesh(
        new THREE.TorusGeometry(8.8, 1.5, 10, 32),
        new THREE.MeshBasicMaterial({
          color: 0xfb923c,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending
        })
      );
      disk.rotation.x = Math.PI * 0.35;
      bhGroup.add(eh);
      bhGroup.add(disk);
      bhGroup.position.copy(skyPos);
      markerMesh = bhGroup;
    } else if (dsoType === 'galaxy') {
      icon = '🌀';
      badgeColor = 0xa855f7;
      const galGroup = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(4.2, 14, 14),
        new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending
        })
      );
      const spiralDisc = new THREE.Mesh(
        new THREE.RingGeometry(2.5, 11.5, 32),
        new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: opacity * 0.75,
          blending: THREE.AdditiveBlending
        })
      );
      spiralDisc.rotation.x = Math.PI * 0.32;
      galGroup.add(core);
      galGroup.add(spiralDisc);
      galGroup.position.copy(skyPos);
      markerMesh = galGroup;
    } else if (dsoType === 'nebula') {
      icon = '🌫️';
      badgeColor = 0xf472b6;
      markerMesh = new THREE.Mesh(
        new THREE.SphereGeometry(8.0, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xf472b6,
          transparent: true,
          opacity: opacity * 0.65,
          blending: THREE.AdditiveBlending
        })
      );
      markerMesh.position.copy(skyPos);
    } else if (dsoType === 'pulsar') {
      icon = '⚡';
      badgeColor = 0x22d3ee;
      markerMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(5.5, 1),
        new THREE.MeshBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending
        })
      );
      markerMesh.position.copy(skyPos);
    } else {
      icon = '✨';
      badgeColor = 0x60a5fa;
      markerMesh = new THREE.Mesh(
        new THREE.SphereGeometry(6.0, 14, 14),
        new THREE.MeshBasicMaterial({
          color: 0x60a5fa,
          transparent: true,
          opacity: opacity * 0.85,
          blending: THREE.AdditiveBlending
        })
      );
      markerMesh.position.copy(skyPos);
    }

    const distLy = distPc * PARSEC_TO_LY;
    const distLabel = distLy >= 1e9
      ? `${(distLy / 1e9).toFixed(2)}B ly`
      : distLy >= 1e6
      ? `${(distLy / 1e6).toFixed(2)}M ly`
      : `${Math.round(distLy).toLocaleString('en-US')} ly`;

    const metaPayload = {
      isSolarSystemSkyBody: true,
      isDeepSkySkyBody: true,
      skyPos: skyPos.clone(),
      targetObjectId: dso.id,
      data: {
        Object: dso.id,
        Category: dso.st_spectype || dsoType,
        'Distance from Current World': distLabel,
        'Where to Look': `${compass} (Azimuth ${azDeg}°, Altitude ${altDeg}°)`,
        'Apparent Magnitude': dso.vmag !== undefined ? `Mag ${dso.vmag}` : 'Radio / X-Ray',
        Mass: dso.st_mass ? `${Number(dso.st_mass).toLocaleString('en-US')} M☉` : 'N/A',
        Summary: dso.description || '',
        Tip: 'Click "Inspect & View Sky" below or double-click this marker to inspect it in 3D!',
        _targetObjectId: dso.id
      }
    };

    markerMesh.userData = metaPayload;
    markerMesh.traverse(child => {
      child.userData = metaPayload;
    });
    deepSkyGroup.add(markerMesh);

    const shortName = dso.id.split(' (')[0];
    const badge = createBadgeSprite(
      `${icon} ${shortName} (${distLabel})`,
      badgeColor,
      13.5
    );
    badge.position.copy(skyPos).add(new THREE.Vector3(0, 15, 0));
    badge.material.opacity = altDeg >= 0 ? 0.92 : 0.28;
    badge.userData = metaPayload;
    deepSkyGroup.add(badge);
  });

  deepSkyGroup.visible = showDeepSky;
}

// Render Pickable Space Stations, Space Telescopes, Interstellar Probes & SETI Landmarks on the Sky Dome
function buildSpaceMissionsInSky(planet, quadrant) {
  while (spaceMissionsSkyGroup.children.length > 0) {
    const c = spaceMissionsSkyGroup.children[0];
    spaceMissionsSkyGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
  }

  const { east, zenith, north } = getQuadrantBasisICRS(quadrant);
  const planetPosPc = planet.isEarth
    ? new THREE.Vector3(0, 0, 0)
    : sphericalToCartesianPc(planet.ra, planet.dec, planet.dist_pc || 0);

  SPACE_MISSIONS_AND_STATIONS.forEach(msn => {
    if (msn.id === planet.id) return;

    let dirICRS;
    let distLabel = formatDistanceToEarth(msn);

    // If standing on a non-Earth Solar System world and the mission has heliocentric AU coordinates
    const isCurrentSol = planet.isSolarSystem || (planet.isSpaceMission && planet.dist_km_from_earth !== undefined);
    const isMsnSol = msn.dist_km_from_earth !== undefined && msn.x_au !== undefined;

    if (!planet.isEarth && isCurrentSol && isMsnSol) {
      const dx = (msn.x_au ?? 1) - (planet.x_au ?? 1);
      const dy = (msn.y_au ?? 0) - (planet.y_au ?? 0);
      const dz = (msn.z_au ?? 0) - (planet.z_au ?? 0);
      const distAu = Math.hypot(dx, dy, dz);
      if (distAu > 0.005) {
        dirICRS = new THREE.Vector3(dx, dy, dz).normalize();
        const distKm = Math.round(distAu * KM_PER_AU);
        distLabel = distKm < 2000000
          ? `${distKm.toLocaleString('en-US')} km`
          : `${(distKm / 1e6).toFixed(1)}M km (${distAu.toFixed(2)} AU)`;
      }
    }

    if (!dirICRS) {
      const msnPosPc = sphericalToCartesianPc(msn.ra, msn.dec, Math.max(1e-5, msn.dist_pc || 1e-4));
      const relVec = msnPosPc.sub(planetPosPc);
      if (relVec.lengthSq() < 1e-16) return;
      dirICRS = relVec.normalize();
      if (!isCurrentSol && msn.dist_pc !== undefined) {
        const distLy = relVec.length() * PARSEC_TO_LY;
        distLabel = distLy < 1 ? formatDistanceToEarth(msn) : `${distLy.toFixed(1)} ly`;
      }
    }

    const lEast = dirICRS.dot(east);
    const lUp = dirICRS.dot(zenith);
    const lNorth = dirICRS.dot(north);

    const altDeg = Number(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, lUp)))).toFixed(1));
    if (altDeg < 0 && belowHorizonMode === 'hidden') return;

    const azRad = Math.atan2(lEast, lNorth);
    const azDeg = Number(((THREE.MathUtils.radToDeg(azRad) + 360) % 360).toFixed(1));
    const compass = azimuthToCompass16(azDeg);

    const skyPos = new THREE.Vector3(
      lEast * (SKY_RADIUS - 15),
      lUp * (SKY_RADIUS - 15),
      -lNorth * (SKY_RADIUS - 15)
    );

    const isAbove = altDeg >= 0;
    const opacity = isAbove ? 0.95 : 0.25;
    const mType = msn.stationPreset || msn.missionType || '';
    const isSETI = mType.startsWith('seti');
    const isTelescope = mType === 'jwst' || mType === 'hubble' || mType === 'gaia_kepler';
    const icon = isSETI ? '📡' : isTelescope ? '🔭' : '🛰️';
    const badgeColor = isSETI ? 0x22d3ee : isTelescope ? 0xfbbf24 : 0x10b981;

    // Build miniature 3D spacecraft / telescope / dish icon on the sky dome
    const markerGroup = new THREE.Group();
    const coreMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(4.2, 1),
      new THREE.MeshBasicMaterial({
        color: badgeColor,
        transparent: true,
        opacity
      })
    );
    const wingMesh = new THREE.Mesh(
      new THREE.RingGeometry(4.8, 7.6, 6),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity * 0.8
      })
    );
    wingMesh.rotation.x = Math.PI / 3;
    markerGroup.add(coreMesh);
    markerGroup.add(wingMesh);
    markerGroup.position.copy(skyPos);

    const metaPayload = {
      isSolarSystemSkyBody: true,
      isSpaceMissionSkyBody: true,
      skyPos: skyPos.clone(),
      targetObjectId: msn.id,
      data: {
        Object: msn.id,
        'Mission / Facility Type': msn.st_spectype || 'Spacecraft / Observatory',
        'Distance from Current World': distLabel,
        'Distance from Earth': formatDistanceToEarth(msn),
        'Where to Look': `${compass} (Azimuth ${azDeg}°, Altitude ${altDeg}° · ${isAbove ? 'Above Horizon' : 'Below Horizon / Hidden Side'})`,
        Summary: msn.description || '',
        Tip: 'Click "Inspect 3D Model" below or double-click this marker to inspect this station/telescope in 3D!',
        _targetObjectId: msn.id
      }
    };

    markerGroup.userData = metaPayload;
    markerGroup.traverse(c => {
      c.userData = metaPayload;
    });
    spaceMissionsSkyGroup.add(markerGroup);

    const shortName = msn.id.split(' (')[0].split(' — ')[0];
    const badge = createBadgeSprite(
      `${icon} ${shortName} (${distLabel})`,
      badgeColor,
      13.0
    );
    badge.position.copy(skyPos).add(new THREE.Vector3(0, 13, 0));
    badge.material.opacity = isAbove ? 0.94 : 0.25;
    badge.userData = metaPayload;
    spaceMissionsSkyGroup.add(badge);
  });

  spaceMissionsSkyGroup.visible = showStarLabels;
}

// Compute true-scale star positions, apparent magnitudes & colors for selected planet + quadrant
function updateSkyAndInspectorForPlanet(planet, resetCam = false) {
  currentPlanet = planet;
  const quadrant = PLANETARY_QUADRANTS.find(q => q.id === currentQuadrantId) || PLANETARY_QUADRANTS[0];
  const { east, zenith, north } = getQuadrantBasisICRS(quadrant);

  const planetPosPc = planet.isEarth
    ? new THREE.Vector3(0, 0, 0)
    : sphericalToCartesianPc(planet.ra, planet.dec, planet.dist_pc || 0);

  activeSkyStars = [];
  starByHipMap.clear();

  for (let i = 0; i < starsCatalog.length; i++) {
    const star = starsCatalog[i];
    if (planet.isEarth && star.isSun) continue;

    const relVecPc = star.posPc.clone().sub(planetPosPc);
    const distPc = relVecPc.length();
    if (distPc < 1e-9) continue;

    const appMag = planet.isSolarSystem
      ? (star.isSun ? -26.7 + 5 * Math.log10(Math.max(0.1, planet.pl_orbsmax || 1.0)) : star.vmag)
      : star.absMag + 5 * Math.log10(distPc) - 5;

    const isConstStar = NAMED_STARS[star.id] !== undefined;
    if (appMag > 6.8 && !isConstStar && star.vmag > 6.3) continue;

    const dirICRS = relVecPc.clone().normalize();
    const localEast = dirICRS.dot(east);
    const localUp = dirICRS.dot(zenith);
    const localNorth = dirICRS.dot(north);

    const localPos = new THREE.Vector3(
      localEast * SKY_RADIUS,
      localUp * SKY_RADIUS,
      -localNorth * SKY_RADIUS
    );

    const altDeg = THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, localUp))));
    const azRad = Math.atan2(localEast, localNorth);
    const azDeg = (THREE.MathUtils.radToDeg(azRad) + 360) % 360;

    const entry = {
      id: star.id,
      name: NAMED_STARS[star.id] || `HIP ${star.id}`,
      hasProperName: Boolean(NAMED_STARS[star.id]),
      isSun: Boolean(star.isSun),
      appMag: Number(appMag.toFixed(2)),
      earthVmag: star.vmag,
      distLyFromPlanet: Number((distPc * PARSEC_TO_LY).toFixed(2)),
      teff: star.teff,
      bv: star.B_V,
      color: star.color.clone(),
      position: localPos,
      altDeg: Number(altDeg.toFixed(1)),
      azDeg: Number(azDeg.toFixed(1)),
      compass: azimuthToCompass16(azDeg),
      aboveHorizon: altDeg >= 0,
      raw: star
    };

    activeSkyStars.push(entry);
    starByHipMap.set(String(star.id), entry);
  }

  if (skyStarsPoints) {
    skyScene.remove(skyStarsPoints);
    skyStarGeometry.dispose();
    skyStarMaterial.dispose();
  }

  const count = activeSkyStars.length;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const s = activeSkyStars[i];
    s.index = i;
    positions[i * 3] = s.position.x;
    positions[i * 3 + 1] = s.position.y;
    positions[i * 3 + 2] = s.position.z;
  }

  skyStarGeometry = new THREE.BufferGeometry();
  skyStarGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  skyStarGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  skyStarGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  skyStarGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

  skyStarMaterial = new THREE.ShaderMaterial({
    vertexShader: SKY_STAR_VERTEX_SHADER,
    fragmentShader: SKY_STAR_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  skyStarsPoints = new THREE.Points(skyStarGeometry, skyStarMaterial);
  skyScene.add(skyStarsPoints);

  refreshStarVisualAttributes();
  buildHorizonAndCompassGrid(quadrant);
  buildEarthHorizonBeaconAndSolarSystemSky(planet, quadrant);
  buildSpaceMissionsInSky(planet, quadrant);
  buildDeepSkyObjectsInSky(planet, quadrant);
  rebuildIAUConstellationsAndLabels();
  rebuildCustomConstellationLines();
  rebuildInspectorScene(planet);
  updateDossierAndQuadrantUI(planet, quadrant);

  if (resetCam) {
    resetActiveCamera();
  }
}

function refreshStarVisualAttributes() {
  if (!skyStarGeometry) return;
  const colors = skyStarGeometry.attributes.aColor.array;
  const sizes = skyStarGeometry.attributes.aSize.array;
  const alphas = skyStarGeometry.attributes.aAlpha.array;

  for (let i = 0; i < activeSkyStars.length; i++) {
    const s = activeSkyStars[i];
    const isHighlighted = highlightedStarIndices.has(s.id);
    const isDimmed = allStarsDimmed || individuallyDimmedStars.has(s.id);

    const clampedMag = Math.max(-2.0, Math.min(7.0, s.appMag));
    const fluxFactor = Math.pow(2.512, (6.5 - clampedMag) * 0.36);
    let pointSize = Math.max(1.8, Math.min(20.0, 1.35 * fluxFactor));

    let col = s.color;
    if (isHighlighted) {
      col = new THREE.Color(0x00ffff);
      pointSize *= 1.45;
    } else if (s.isSun) {
      col = new THREE.Color(0xffe066);
      pointSize = Math.max(pointSize, 11.0);
    }

    let alpha = 1.0;
    if (!s.aboveHorizon) {
      if (belowHorizonMode === 'hidden') {
        alpha = 0.0;
      } else if (belowHorizonMode === 'dimmed') {
        alpha = 0.16;
      }
    }
    if (isDimmed && !isHighlighted) {
      alpha *= 0.22;
    }

    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
    sizes[i] = pointSize;
    alphas[i] = alpha;
  }

  skyStarGeometry.attributes.aColor.needsUpdate = true;
  skyStarGeometry.attributes.aSize.needsUpdate = true;
  skyStarGeometry.attributes.aAlpha.needsUpdate = true;
}

function rebuildIAUConstellationsAndLabels() {
  while (iauGroup.children.length > 0) {
    const c = iauGroup.children[0];
    iauGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
  }
  while (labelsGroup.children.length > 0) {
    const c = labelsGroup.children[0];
    labelsGroup.remove(c);
    if (c.material && c.material.map) c.material.map.dispose();
  }

  const aboveMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45
  });
  const belowMat = new THREE.LineBasicMaterial({
    color: 0x334155,
    transparent: true,
    opacity: belowHorizonMode === 'hidden' ? 0.0 : 0.18
  });

  IAU_CONSTELLATIONS.forEach(constellation => {
    const centroid = new THREE.Vector3();
    let validVertices = 0;
    let anyAbove = false;

    constellation.lines.forEach(([hipA, hipB]) => {
      const starA = starByHipMap.get(String(hipA));
      const starB = starByHipMap.get(String(hipB));
      if (!starA || !starB) return;

      const bothAbove = starA.aboveHorizon && starB.aboveHorizon;
      if (bothAbove) anyAbove = true;
      if (!bothAbove && belowHorizonMode === 'hidden') return;

      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        starA.position.clone(),
        starB.position.clone()
      ]);
      const line = new THREE.Line(lineGeo, bothAbove ? aboveMat : belowMat);
      iauGroup.add(line);

      centroid.add(starA.position).add(starB.position);
      validVertices += 2;
    });

    if (validVertices > 0 && (anyAbove || belowHorizonMode === 'full')) {
      centroid.divideScalar(validVertices).normalize().multiplyScalar(SKY_RADIUS * 0.96);
      const labelSprite = createBadgeSprite(constellation.name, 0x38bdf8, 13);
      labelSprite.position.copy(centroid);
      labelSprite.material.opacity = anyAbove ? 0.78 : 0.25;
      labelSprite.userData = {
        baseScale: labelSprite.scale.clone(),
        minZoom: 1.0,
        baseOpacity: anyAbove ? 0.78 : 0.25
      };
      labelsGroup.add(labelSprite);
    }
  });

  activeSkyStars.forEach(s => {
    if (!s.aboveHorizon && belowHorizonMode === 'hidden') return;
    if (s.isSun || (s.hasProperName && s.appMag <= 5.5)) {
      const badgeColor = s.isSun ? 0xfacc15 : s.appMag <= 2.3 ? 0x94a3b8 : 0x60a5fa;
      const text = s.isSun
        ? `☀️ Sol (Mag ${s.appMag})`
        : s.appMag <= 2.3
        ? s.name.split(' (')[0]
        : `${s.name} (Mag ${s.appMag})`;
      const sprite = createBadgeSprite(text, badgeColor, s.isSun ? 18 : 12.5);
      sprite.position.copy(s.position.clone().normalize().multiplyScalar(SKY_RADIUS * 0.97));
      sprite.position.y += 8;
      const baseOp = s.aboveHorizon ? 0.88 : 0.25;
      sprite.material.opacity = baseOp;
      const minZoom = s.isSun || s.appMag <= 2.35 ? 1.0 : s.appMag <= 3.6 ? 1.45 : 2.1;
      sprite.userData = {
        baseScale: sprite.scale.clone(),
        minZoom,
        baseOpacity: baseOp,
        starEntry: s
      };
      labelsGroup.add(sprite);
    }
  });

  iauGroup.visible = showIAUConstellations;
  labelsGroup.visible = showStarLabels;
  solarSystemSkyGroup.visible = showStarLabels;
  spaceMissionsSkyGroup.visible = showStarLabels;
  deepSkyGroup.visible = showDeepSky;
  updateSkyZoomLabels();
}

// Dynamically scale Sky Dome label sprites & reveal deeper star labels as user zooms in
function updateSkyZoomLabels() {
  const zoomFactor = DEFAULT_SKY_FOV / skyFov;
  const fovScale = Math.pow(skyFov / DEFAULT_SKY_FOV, 0.82);

  labelsGroup.children.forEach(sprite => {
    if (!sprite.userData?.baseScale) {
      sprite.userData = {
        baseScale: sprite.scale.clone(),
        minZoom: 1.0,
        baseOpacity: sprite.material?.opacity ?? 0.85
      };
    }
    const visibleAtZoom = zoomFactor >= (sprite.userData.minZoom || 1.0);
    sprite.visible = visibleAtZoom;
    if (visibleAtZoom) {
      sprite.scale.copy(sprite.userData.baseScale).multiplyScalar(fovScale);
    }
  });

  [solarSystemSkyGroup, spaceMissionsSkyGroup, deepSkyGroup, earthBeaconGroup, horizonCompassGroup].forEach(group => {
    group.children.forEach(obj => {
      if (obj.isSprite) {
        if (!obj.userData?.baseScale) {
          obj.userData = { ...obj.userData, baseScale: obj.scale.clone() };
        }
        obj.scale.copy(obj.userData.baseScale).multiplyScalar(Math.max(0.28, fovScale));
      }
    });
  });

  const zoomReadout = document.getElementById('zoomLevelReadout');
  if (zoomReadout && viewMode === 'sky') {
    zoomReadout.textContent = `🔭 ${zoomFactor.toFixed(1)}× (${Math.round(skyFov)}°)`;
  }
}

function setSkyFov(newFov) {
  skyFov = Math.max(MIN_SKY_FOV, Math.min(MAX_SKY_FOV, newFov));
  skyCamera.fov = skyFov;
  skyCamera.updateProjectionMatrix();
  skyControls.rotateSpeed = -0.45 * (skyFov / DEFAULT_SKY_FOV);
  updateSkyZoomLabels();
}

function applyViewportZoom(zoomMultiplier, reset = false) {
  if (viewMode === 'sky') {
    if (reset) {
      setSkyFov(DEFAULT_SKY_FOV);
    } else {
      setSkyFov(skyFov * zoomMultiplier);
    }
  } else if (viewMode === 'inspector') {
    if (reset) {
      resetActiveCamera();
    } else {
      const offset = inspectorCamera.position.clone().sub(inspectorControls.target);
      const newLen = Math.max(inspectorControls.minDistance, Math.min(inspectorControls.maxDistance, offset.length() * zoomMultiplier));
      offset.setLength(newLen);
      inspectorCamera.position.copy(inspectorControls.target).add(offset);
      inspectorControls.update();
    }
    const dist = inspectorCamera.position.distanceTo(inspectorControls.target);
    const zoomReadout = document.getElementById('zoomLevelReadout');
    if (zoomReadout) {
      zoomReadout.textContent = `🔭 ${(3.3 / Math.max(0.5, dist)).toFixed(1)}× (3D)`;
    }
  } else if (viewMode === 'system') {
    if (reset) {
      resetActiveCamera();
    } else {
      const offset = systemCamera.position.clone().sub(systemControls.target);
      const newLen = Math.max(systemControls.minDistance, Math.min(systemControls.maxDistance, offset.length() * zoomMultiplier));
      offset.setLength(newLen);
      systemCamera.position.copy(systemControls.target).add(offset);
      systemControls.update();
    }
    const baseDist = Math.max(12, activeSystemOrrery?.maxOrbitRadius || 18) * 1.36;
    const dist = systemCamera.position.distanceTo(systemControls.target);
    const zoomReadout = document.getElementById('zoomLevelReadout');
    if (zoomReadout) {
      zoomReadout.textContent = `🔭 ${(baseDist / Math.max(1.0, dist)).toFixed(1)}× (Sys)`;
    }
  }
}

function rebuildInspectorScene(planet) {
  if (activeCelestialSystem) {
    inspectorScene.remove(activeCelestialSystem.rootGroup);
  }
  activeCelestialSystem = buildCelestialSystem(planet, currentQuadrantId);
  inspectorScene.add(activeCelestialSystem.rootGroup);

  if (activeSystemOrrery) {
    systemScene.remove(activeSystemOrrery.rootGroup);
  }
  activeSystemOrrery = buildStarSystemOrrery(planet, exoplanets);
  systemScene.add(activeSystemOrrery.rootGroup);

  if (!inspectorBgStars) {
    const bgGeo = new THREE.BufferGeometry();
    const bgCount = 1500;
    const bgPos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 85;
      bgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i * 3 + 2] = r * Math.cos(phi);
    }
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    inspectorBgStars = new THREE.Points(
      bgGeo,
      new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.25, transparent: true, opacity: 0.6 })
    );
    inspectorScene.add(inspectorBgStars);
  }

  if (!systemBgStars) {
    const sysBgGeo = new THREE.BufferGeometry();
    const sysBgCount = 2200;
    const sysBgPos = new Float32Array(sysBgCount * 3);
    for (let i = 0; i < sysBgCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 420;
      sysBgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sysBgPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sysBgPos[i * 3 + 2] = r * Math.cos(phi);
    }
    sysBgGeo.setAttribute('position', new THREE.BufferAttribute(sysBgPos, 3));
    systemBgStars = new THREE.Points(
      sysBgGeo,
      new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.85, transparent: true, opacity: 0.55 })
    );
    systemScene.add(systemBgStars);
  }
}

function updateDossierAndQuadrantUI(planet, quadrant) {
  const profile = classifyPlanet(planet);

  document.getElementById('dossierTitle').textContent = planet.id;
  const badge = document.getElementById('planetTypeBadge');
  badge.textContent = profile.type;

  document.getElementById('planetVisualDesc').textContent = profile.description;

  const distText = formatDistanceToEarth(planet);
  const sysCount = activeSystemOrrery?.systemPlanetsCount || 1;

  if (planet.isDeepSky) {
    const massSol = planet.st_mass ? `${Number(planet.st_mass).toLocaleString('en-US')} M☉` : 'Extended Object';
    const sizeText = `${Number(planet.pl_rade ?? 1.0).toLocaleString('en-US')} R⊕ / ly`;
    const magText = planet.vmag !== undefined ? `Mag ${planet.vmag}` : 'Radio / X-Ray';
    const discMethod = planet.discoverymethod || 'Deep-Sky Survey';

    document.getElementById('planetStatsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Distance to Earth</div>
        <div class="stat-val">${distText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Discovery / Survey</div>
        <div class="stat-val">${discMethod}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Characteristic Scale</div>
        <div class="stat-val">${sizeText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Mass</div>
        <div class="stat-val">${massSol}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Apparent Mag</div>
        <div class="stat-val">${magText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cosmic Class</div>
        <div class="stat-val">${profile.type}</div>
      </div>
    `;
  } else {
    const tempC = planet.pl_eqt ? `${planet.pl_eqt} K (${Math.round(planet.pl_eqt - 273.15)}°C)` : 'N/A';
    const radText = `${planet.pl_rade ?? 1.0} R⊕ (${planet.pl_radj ?? 0.09} R♃)`;
    const massText = planet.pl_bmasse ? `${Number(planet.pl_bmasse).toFixed(3)} M⊕` : 'Est. from Radius';
    const orbText = planet.pl_orbper ? `${Number(planet.pl_orbper).toFixed(1)} d (${planet.pl_orbsmax ?? '?'} AU)` : 'N/A';
    const moonsCount = activeCelestialSystem?.moonsList?.length || 0;
    const moonsLabel = planet.bodyType === 'moon'
      ? `Moon of ${planet.parentBody.split(' (')[0]}`
      : `${moonsCount} Moons · ${sysCount} Sys Worlds`;

    document.getElementById('planetStatsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Distance to Earth</div>
        <div class="stat-val">${distText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Equilibrium Temp</div>
        <div class="stat-val">${tempC}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Body Radius</div>
        <div class="stat-val">${radText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Body Mass</div>
        <div class="stat-val">${massText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Orbit Period / Axis</div>
        <div class="stat-val">${orbText}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Moons &amp; System</div>
        <div class="stat-val">${moonsLabel}</div>
      </div>
    `;
  }

  const starHex = '#' + teffToColor(planet.st_teff || 5778).getHexString();
  const swatch = document.getElementById('hostStarSwatch');
  swatch.style.backgroundColor = starHex;
  swatch.style.color = starHex;

  document.getElementById('hostStarMeta').innerHTML = `
    <strong>Host System: ${planet.hostname} (${sysCount} ${sysCount === 1 ? 'Body' : 'Worlds'})</strong><br/>
    Star/Core Type: <strong>${planet.st_spectype || 'G2 V'}</strong> · Teff: <strong>${planet.st_teff || 5778} K</strong><br/>
    Radius: ${planet.st_rad || 1.0} R☉ · Mass: ${planet.st_mass || 1.0} M☉
  `;

  const visibleAbove = activeSkyStars.filter(s => s.aboveHorizon && s.appMag <= 6.5);
  let brightest = null;
  visibleAbove.forEach(s => {
    if (!brightest || s.appMag < brightest.appMag) brightest = s;
  });

  const earthSign = currentEarthHorizonInfo.altDeg >= 0 ? '+' : '';
  const earthLine = planet.isEarth
    ? `<br/>🌍 <strong>Earth Horizon:</strong> 0 km (Home World · Continents shown on globe)`
    : `<br/>🌍 <strong>Earth Bearing on Horizon:</strong> Look <strong>${currentEarthHorizonInfo.compass} (Az ${currentEarthHorizonInfo.azDeg}°)</strong> · Dist: <strong>${currentEarthHorizonInfo.distText}</strong> (True Alt ${earthSign}${currentEarthHorizonInfo.altDeg}°)`;

  const regionDesc = planet.isEarth ? quadrant.earthRegion : quadrant.exoRegion;
  document.getElementById('skySummaryBox').innerHTML = `
    <strong>Active Quadrant: ${quadrant.name}</strong><br/>
    Region: ${regionDesc}<br/>
    Zenith Center: Lat ${quadrant.centerLat}°, Lon ${quadrant.centerLon}°<br/>
    Naked-Eye Stars Above Horizon: <strong>${visibleAbove.length}</strong>
    ${brightest ? `<br/>Brightest Overhead: <strong>${brightest.name}</strong> (Mag ${brightest.appMag}, Look ${brightest.compass})` : ''}
    ${earthLine}
  `;

  // Populate Live Signal Light-Time, Propulsion Travel Time & SETI / Observatory Telemetry Box
  const telemetryBox = document.getElementById('telemetryGuideBox');
  if (telemetryBox) {
    const tGuide = computeTelemetryAndTravelGuide(planet);
    telemetryBox.innerHTML = `
      <div class="telemetry-title">
        <span>📡 Signal Light-Time &amp; Travel Telemetry</span>
      </div>
      <div><strong>One-Way Light / Radio Delay:</strong> <span style="color:#fde68a;font-weight:700;">${tGuide.lightTime}</span></div>
      <div class="telemetry-grid">
        <div class="telemetry-pill">
          <span class="t-label">Apollo Chemical (40k km/h)</span>
          <span class="t-val">${tGuide.apolloTime}</span>
        </div>
        <div class="telemetry-pill">
          <span class="t-label">Voyager 1 (17 km/s)</span>
          <span class="t-val">${tGuide.voyagerTime}</span>
        </div>
        <div class="telemetry-pill">
          <span class="t-label">Parker Solar Probe (192 km/s)</span>
          <span class="t-val">${tGuide.parkerTime}</span>
        </div>
        <div class="telemetry-pill">
          <span class="t-label">Starshot Laser Sail (0.20c)</span>
          <span class="t-val">${tGuide.starshotTime}</span>
        </div>
      </div>
      <div style="margin-top:4px;color:#cbd5e1;"><strong>🔭 SETI &amp; Observatory Status:</strong> ${tGuide.setiStatus}</div>
    `;
  }

  // Populate Scientific Expeditions, Vehicles Sent & Results Box
  const expBox = document.getElementById('expeditionsBox');
  if (expBox) {
    const expeditions = getExpeditionsForWorld(planet);
    const cardsHtml = expeditions
      .map(exp => {
        const canJump = exp.targetObjectId && exp.targetObjectId !== planet.id;
        const jumpBtnHtml = canJump
          ? `<button type="button" class="expedition-jump-btn" data-target-id="${exp.targetObjectId}">🛰️ Inspect ${exp.probeLabel || exp.mission.split('(')[0]} in 3D &amp; Sky ⤢</button>`
          : '';
        return `
        <div class="expedition-card">
          <div class="expedition-name">🛰️ ${exp.mission}</div>
          <div class="expedition-agency">${exp.agency}</div>
          <div class="expedition-vehicles"><strong>Vehicles:</strong> ${exp.vehicles}</div>
          <div class="expedition-results"><strong>Results:</strong> ${exp.results}</div>
          ${jumpBtnHtml}
        </div>
      `;
      })
      .join('');
    expBox.innerHTML = `
      <div class="expeditions-title">
        <span>🚀 Scientific Expeditions &amp; Vehicles (${expeditions.length})</span>
      </div>
      ${cardsHtml}
    `;
    expBox.querySelectorAll('.expedition-jump-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tid = btn.getAttribute('data-target-id');
        if (tid) jumpToCelestialObjectById(tid, 'inspector');
      });
    });
  }

  document.getElementById('activeQuadrantInfo').innerHTML = `
    <strong>${quadrant.shortLabel}</strong> · ${regionDesc}
  `;
  document.querySelectorAll('.quad-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.quadId === currentQuadrantId);
  });
}

// Jump directly to any celestial body, moon, space station, telescope, probe, or SETI landmark by ID
function jumpToCelestialObjectById(targetId, switchMode = null) {
  if (!targetId) return;
  const found = exoplanets.find(p => p.id === targetId);
  if (!found) return;

  const selectEl = document.getElementById('exoplanetSelect');
  if (!filteredPlanets.some(p => p.id === found.id)) {
    const catEl = document.getElementById('planetCategoryFilter');
    const searchEl = document.getElementById('planetSearchInput');
    if (catEl) catEl.value = 'all';
    if (searchEl) searchEl.value = '';
    filterAndPopulatePlanets(false);
  }
  if (selectEl) selectEl.value = found.id;
  updateSkyAndInspectorForPlanet(found, true);
  if (switchMode) {
    setViewMode(switchMode);
  }
  const popup = document.getElementById('popup');
  if (popup) popup.style.display = 'none';
}

function initQuadrantButtons() {
  const qContainer = document.getElementById('quadrantButtonsContainer');
  qContainer.innerHTML = '';
  PLANETARY_QUADRANTS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = `quad-btn${q.id === currentQuadrantId ? ' active' : ''}`;
    btn.dataset.quadId = q.id;
    btn.textContent = q.shortLabel;
    btn.title = `${q.name}: ${q.earthRegion} (Lat ${q.latRange[0]}°..${q.latRange[1]}°, Lon ${q.lonRange[0]}°..${q.lonRange[1]}°)`;
    btn.addEventListener('click', () => {
      selectQuadrant(q.id);
    });
    qContainer.appendChild(btn);
  });
}

function selectQuadrant(quadId) {
  if (!PLANETARY_QUADRANTS.some(q => q.id === quadId)) return;
  currentQuadrantId = quadId;
  if (currentPlanet) {
    updateSkyAndInspectorForPlanet(currentPlanet, false);
  }
}

function setViewMode(mode) {
  viewMode = mode;
  const isSky = mode === 'sky';
  const isInspector = mode === 'inspector';
  const isSystem = mode === 'system';

  document.getElementById('modeSkyBtn').classList.toggle('active', isSky);
  document.getElementById('modeInspectorBtn').classList.toggle('active', isInspector);
  const sysBtn = document.getElementById('modeSystemBtn');
  if (sysBtn) sysBtn.classList.toggle('active', isSystem);

  document.getElementById('miniGlobeHud').style.display = isSky ? 'flex' : 'none';

  skyControls.enabled = isSky;
  inspectorControls.enabled = isInspector;
  systemControls.enabled = isSystem;
  resetActiveCamera();
}

function resetActiveCamera() {
  if (viewMode === 'sky') {
    setSkyFov(DEFAULT_SKY_FOV);
    skyCamera.position.set(0, 0, 0.01);
    skyControls.target.set(0, 0.5, -1.0);
    skyControls.update();
  } else if (viewMode === 'system') {
    const maxR = Math.max(12, activeSystemOrrery?.maxOrbitRadius || 18);
    systemCamera.position.set(0, maxR * 0.68, maxR * 1.18);
    systemControls.target.set(0, 0, 0);
    systemControls.update();
    const zoomReadout = document.getElementById('zoomLevelReadout');
    if (zoomReadout) zoomReadout.textContent = '🔭 1.0× (Sys)';
  } else {
    const q = PLANETARY_QUADRANTS.find(item => item.id === currentQuadrantId) || PLANETARY_QUADRANTS[0];
    const latRad = THREE.MathUtils.degToRad(q.centerLat * 0.6);
    const lonRad = THREE.MathUtils.degToRad(q.centerLon);
    inspectorCamera.position.set(
      3.55 * Math.cos(latRad) * Math.cos(lonRad),
      3.55 * Math.sin(latRad),
      -3.55 * Math.cos(latRad) * Math.sin(lonRad)
    );
    inspectorControls.target.set(0, 0, 0);
    inspectorControls.update();
    const zoomReadout = document.getElementById('zoomLevelReadout');
    if (zoomReadout) zoomReadout.textContent = '🔭 1.0× (3D)';
  }
}

// Snap Sky Camera to look directly at Earth on the Horizon
function lookAtEarthOnHorizon() {
  if (viewMode !== 'sky') {
    setViewMode('sky');
  }
  const hPos = currentEarthHorizonInfo.horizonPos.clone().normalize();
  skyCamera.position.set(0, 0, 0.01);
  skyControls.target.set(hPos.x, 0.08, hPos.z);
  skyControls.update();
}

// Search & Category Filtering for Planets, Moons, Space Stations, Telescopes, Popular Media & Deep-Sky Objects
function filterAndPopulatePlanets(keepCurrentSelection = true) {
  const query = (document.getElementById('planetSearchInput').value || '').trim().toLowerCase();
  const cat = document.getElementById('planetCategoryFilter').value;

  filteredPlanets = exoplanets.filter(p => {
    if (cat === 'space_missions') {
      if (!p.isSpaceMission) return false;
    } else if (cat === 'solar_system') {
      if (!p.isSolarSystem || p.isSpaceMission) return false;
    } else if (cat === 'popular_media') {
      if (!p.isPopularMedia) return false;
    } else if (cat === 'deep_sky') {
      if (!p.isDeepSky) return false;
    } else if (cat === 'earth_nearby') {
      if (!p.isSolarSystem && !p.isSpaceMission && p.distance > 50) return false;
    } else if (cat !== 'all') {
      if (!p._filterGroup) {
        p._filterGroup = classifyPlanet(p).filterGroup;
      }
      if (p._filterGroup !== cat && !p.isEarth) return false;
    }
    if (query) {
      const matchName = p.id.toLowerCase().includes(query);
      const matchHost = (p.hostname || '').toLowerCase().includes(query);
      const matchSpec = (p.st_spectype || '').toLowerCase().includes(query);
      const matchMedia = (p.mediaFranchise || '').toLowerCase().includes(query);
      const matchDesc = (p.description || '').toLowerCase().includes(query);
      return matchName || matchHost || matchSpec || matchMedia || matchDesc;
    }
    return true;
  });

  const select = document.getElementById('exoplanetSelect');
  const prevValue = select.value;
  select.innerHTML = '';

  const displayList = filteredPlanets.slice(0, 800);
  displayList.forEach(exo => {
    const option = document.createElement('option');
    option.value = exo.id;
    const distBadge = formatDistanceToEarth(exo);
    const dType = exo.deepSkyType || exo.bodyType;
    let prefix = '';
    if (exo.isEarth) prefix = '🌍 ';
    else if (exo.isSpaceMission) {
      const mt = exo.stationPreset || exo.missionType || '';
      prefix = mt.startsWith('seti') ? '📡 ' : (mt === 'jwst' || mt === 'hubble' || mt === 'gaia_kepler') ? '🔭 ' : '🛰️ ';
    } else if (exo.isPopularMedia && !exo.isSolarSystem && !exo.isDeepSky) prefix = '🎬 ';
    else if (dType === 'moon') prefix = '🌕 ';
    else if (exo.isSolarSystem) prefix = '🪐 ';
    else if (dType === 'black_hole') prefix = '🕳️ ';
    else if (dType === 'galaxy') prefix = '🌀 ';
    else if (dType === 'nebula') prefix = '🌫️ ';
    else if (dType === 'pulsar') prefix = '⚡ ';
    else if (dType === 'cluster') prefix = '✨ ';

    option.textContent = `${prefix}${exo.id} · ${distBadge}`;
    select.appendChild(option);
  });

  document.getElementById('planetCountLabel').textContent = filteredPlanets.length;

  if (filteredPlanets.length > 0) {
    const targetPlanet = (keepCurrentSelection && filteredPlanets.find(p => p.id === prevValue)) || filteredPlanets[0];
    select.value = targetPlanet.id;
    if (targetPlanet !== currentPlanet) {
      updateSkyAndInspectorForPlanet(targetPlanet, true);
    }
  }
}

function rebuildCustomConstellationLines() {
  while (customLinesGroup.children.length > 0) {
    const l = customLinesGroup.children[0];
    customLinesGroup.remove(l);
    if (l.geometry) l.geometry.dispose();
  }

  const lineMat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 });
  customConstellations.forEach(seg => {
    const s1 = starByHipMap.get(String(seg.star1Id));
    const s2 = starByHipMap.get(String(seg.star2Id));
    if (!s1 || !s2) return;
    const geo = new THREE.BufferGeometry().setFromPoints([
      s1.position.clone(),
      s2.position.clone()
    ]);
    const line = new THREE.Line(geo, lineMat);
    customLinesGroup.add(line);
  });
}

// Map any Sky Star (Sun, Named Star, or Hipparcos Catalog Star) to a navigable 3D World / System in exoplanets
const HIP_TO_WORLD_ID = {
  '71683': 'Alpha Centauri A — Pandora / Polyphemus (Avatar)',
  '70890': 'Proxima Centauri b',
  '8102': 'Tau Ceti e — Planet Adrian (Project Hail Mary)',
  '19849': '40 Eridani A (HD 26965 b) — Planet Vulcan (Star Trek)',
  '32349': 'Sirius AB Binary System — Dog Star (8.6 ly)',
  '37279': 'Procyon AB System — White Dwarf Binary (11.46 ly)',
  '30438': 'Canopus (Alpha Carinae) — Arrakis / Dune (Frank Herbert)',
  '16537': 'Epsilon Eridani b (AEgir) — Babylon 5 / Reach / Borg',
  '91262': 'Vega (Alpha Lyrae) — Contact (Carl Sagan)',
  '97649': 'Altair IV — Forbidden Planet (16.7 ly)',
  '37826': 'Pollux b',
  '21421': 'Aldebaran b',
  '113368': 'Fomalhaut b'
};

function resolveOrCreateWorldForSkyStar(starEntry) {
  if (!starEntry) return null;

  // 1. Sol (Our Sun) -> Jump to Earth (or Mercury if already on Earth)
  if (starEntry.isSun) {
    return currentPlanet?.isEarth ? 'Mercury (Sol System)' : 'Earth (Sol System)';
  }

  // 2. Direct Hipparcos ID match to curated Popular Media / Solar / Exoplanet systems
  const mappedId = HIP_TO_WORLD_ID[String(starEntry.id)];
  if (mappedId && exoplanets.some(p => p.id === mappedId)) {
    return mappedId;
  }

  // 3. Match by proper star name against existing catalog worlds
  if (starEntry.hasProperName) {
    const cleanStarName = starEntry.name.split(' (')[0].trim().toLowerCase();
    const matchedWorld = exoplanets.find(
      p =>
        (p.hostname && p.hostname.toLowerCase().includes(cleanStarName)) ||
        p.id.toLowerCase().startsWith(cleanStarName)
    );
    if (matchedWorld) return matchedWorld.id;
  }

  // 4. Dynamically synthesize & register a navigable 3D Stellar Vantage Point for any Hipparcos star
  const synthId = starEntry.hasProperName
    ? `${starEntry.name} (Stellar System — HIP ${starEntry.id})`
    : `HIP ${starEntry.id} (Stellar System — ${starEntry.distLyFromPlanet} ly)`;

  const existingSynth = exoplanets.find(p => p.id === synthId);
  if (existingSynth) return existingSynth.id;

  const raw = starEntry.raw || {};
  const distPc = raw.distPcEarth || 1000.0 / Math.max(0.25, raw.Plx || 10);
  const distLy = Number((distPc * PARSEC_TO_LY).toFixed(2));
  const teff = starEntry.teff || 5778;
  const specClass =
    teff >= 20000
      ? 'B0 V (Luminous Blue Star)'
      : teff >= 9500
      ? 'A1 V (White Main-Sequence Star)'
      : teff >= 7200
      ? 'F5 V (Yellow-White Star)'
      : teff >= 5200
      ? 'G2 V (Solar-Type Star)'
      : teff >= 3700
      ? 'K2 V (Orange Star)'
      : 'M2 V (Red Star)';

  const synthWorld = {
    id: synthId,
    pl_name: synthId,
    hostname: starEntry.name,
    isStellarVantage: true,
    ra: raw.RAJ2000 ?? 0,
    dec: raw.DEJ2000 ?? 0,
    dist_pc: Number(distPc.toFixed(2)),
    distance: distLy,
    pl_rade: 1.35,
    pl_radj: 0.12,
    pl_bmasse: 2.1,
    pl_bmassj: 0.0066,
    pl_orbper: 240,
    pl_orbsmax: 0.85,
    pl_orbeccen: 0.03,
    pl_eqt: Math.round(Math.min(1800, Math.max(180, teff * 0.048))),
    discoverymethod: 'Hipparcos / Gaia Astrometric Stellar Catalog',
    disc_year: 1997,
    st_spectype: specClass,
    st_teff: teff,
    st_rad: teff < 4200 && starEntry.earthVmag < 2.5 ? 65.0 : teff > 8500 ? 2.4 : 1.1,
    st_mass: teff > 8500 ? 2.2 : 1.0,
    sy_snum: 1,
    sy_pnum: 1,
    description: `Direct 3D stellar vantage point at ${starEntry.name} (Hipparcos Catalog HIP ${starEntry.id}), located ${distLy} light-years (${distPc.toFixed(2)} pc) from Earth at RA ${Number(raw.RAJ2000 || 0).toFixed(2)}°, Dec ${Number(raw.DEJ2000 || 0).toFixed(2)}°.`
  };

  exoplanets.push(synthWorld);
  return synthWorld.id;
}

function handleStarClickInSky(starEntry) {
  highlightedStarIndices.add(starEntry.id);
  selectedStars.push(starEntry);

  if (selectedStars.length >= 2) {
    const prev = selectedStars[selectedStars.length - 2];
    const curr = selectedStars[selectedStars.length - 1];
    if (prev.id !== curr.id) {
      const cname = (document.getElementById('constellationNameInput').value || 'Custom Constellation').trim();
      customConstellations.push({
        star1Id: prev.id,
        star2Id: curr.id,
        name: cname
      });
      rebuildCustomConstellationLines();
    }
  }

  refreshStarVisualAttributes();
  const targetWorldId = resolveOrCreateWorldForSkyStar(starEntry);
  showObjectDetails({
    Name: starEntry.name,
    'Hipparcos ID': starEntry.id,
    'Where to Look': `${starEntry.compass} (Azimuth ${starEntry.azDeg}°, Altitude ${starEntry.altDeg}°)`,
    'Horizon Status': starEntry.aboveHorizon ? 'Above Local Horizon' : 'Below Local Horizon',
    'Apparent Magnitude': `${starEntry.appMag} (Earth Vmag: ${starEntry.earthVmag})`,
    'Distance from World': `${starEntry.distLyFromPlanet} light-years`,
    'Effective Temp': `${starEntry.teff} K (B-V: ${starEntry.bv})`,
    Tip: 'Double-click this star in the sky or click the buttons below to travel to it in 3D!',
    _targetObjectId: targetWorldId
  });
}

function undoLastLine() {
  if (customConstellations.length > 0) {
    customConstellations.pop();
    rebuildCustomConstellationLines();
  }
  selectedStars = [];
}

function clearCustomConstellations() {
  customConstellations = [];
  selectedStars = [];
  highlightedStarIndices.clear();
  rebuildCustomConstellationLines();
  refreshStarVisualAttributes();
}

const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();

// Precise angular hit-test against visible Sky Markers (ignores oversized 2D Sprite text bounding boxes on hover)
function findClosestSkyMarker(ray, maxAngularRad = 0.016, allowSpriteClick = false) {
  const dirVec = ray?.ray?.direction || ray?.direction;
  if (!dirVec) return null;
  const rayDir = dirVec.clone().normalize();
  let bestAngle = maxAngularRad * (skyFov / DEFAULT_SKY_FOV);
  let bestUserData = null;

  const groups = [earthBeaconGroup];
  if (spaceMissionsSkyGroup.visible) groups.push(spaceMissionsSkyGroup);
  if (solarSystemSkyGroup.visible) groups.push(solarSystemSkyGroup);
  if (deepSkyGroup.visible) groups.push(deepSkyGroup);

  for (let g = 0; g < groups.length; g++) {
    const children = groups[g].children;
    for (let i = 0; i < children.length; i++) {
      const obj = children[i];
      if (obj.isLine || obj.isSprite) continue;
      const ud = obj.userData;
      if (!ud || !ud.data) continue;
      const pos = ud.skyPos || obj.position;
      if (!pos || pos.lengthSq() < 1) continue;
      const dir = pos.clone().normalize();
      const dot = Math.max(-1, Math.min(1, rayDir.dot(dir)));
      const angle = Math.acos(dot);
      if (angle < bestAngle) {
        bestAngle = angle;
        bestUserData = ud;
      }
    }
  }

  // Fallback for clicks/double-clicks directly on 3D marker meshes or label badges
  if (!bestUserData && allowSpriteClick) {
    const targets = [];
    groups.forEach(grp => {
      grp.children.forEach(c => {
        if (!c.isLine) targets.push(c);
      });
    });
    const hits = ray.intersectObjects(targets, true);
    const validHit = hits.find(
      h =>
        h.object.userData?.data ||
        h.object.userData?.targetObjectId ||
        h.object.userData?.targetPlanetId
    );
    if (validHit) {
      bestUserData = validHit.object.userData;
    }
  }

  return bestUserData;
}

function findClosestSkyStar(ray, maxAngularRad = 0.022, isHover = false) {
  let bestStar = null;
  const zoomScale = skyFov / DEFAULT_SKY_FOV;
  let bestAngle = maxAngularRad * zoomScale;
  const dirVec = ray?.ray?.direction || ray?.direction;
  if (!dirVec) return null;
  const rayDir = dirVec.clone().normalize();
  // In hover mode, filter out faint unnamed background stars unless zoomed in so empty sky doesn't keep tooltip stuck open
  const hoverMagCutoff = 4.75 + Math.max(0, Math.log2(DEFAULT_SKY_FOV / Math.max(8, skyFov))) * 1.15;

  for (let i = 0; i < activeSkyStars.length; i++) {
    const s = activeSkyStars[i];
    if (!s.aboveHorizon && belowHorizonMode === 'hidden') continue;
    const isProminent = s.isSun || s.hasProperName || highlightedStarIndices.has(s.id);
    if (isHover && !isProminent && s.appMag > hoverMagCutoff) continue;

    const starDir = s.position.clone().normalize();
    const dot = Math.max(-1, Math.min(1, rayDir.dot(starDir)));
    const angle = Math.acos(dot);
    const allowedAngle = isHover && !isProminent ? bestAngle * 0.65 : bestAngle;
    if (angle < allowedAngle) {
      bestAngle = angle;
      bestStar = s;
    }
  }
  return bestStar;
}

// Mouse wheel optical zoom in Sky Observatory mode
renderer.domElement.addEventListener(
  'wheel',
  e => {
    if (viewMode === 'sky') {
      e.preventDefault();
      const zoomStep = e.deltaY > 0 ? 1.12 : 0.89;
      setSkyFov(skyFov * zoomStep);
    }
  },
  { passive: false }
);

// Two-finger touch pinch-to-zoom in Sky Observatory mode
let pinchStartDist = 0;
let pinchStartFov = DEFAULT_SKY_FOV;
renderer.domElement.addEventListener(
  'touchstart',
  e => {
    if (viewMode === 'sky' && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist = Math.hypot(dx, dy);
      pinchStartFov = skyFov;
    }
  },
  { passive: true }
);

renderer.domElement.addEventListener(
  'touchmove',
  e => {
    if (viewMode === 'sky' && e.touches.length === 2 && pinchStartDist > 10) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (dist > 5) {
        const ratio = pinchStartDist / dist;
        setSkyFov(pinchStartFov * ratio);
      }
    }
  },
  { passive: true }
);

let pointerDownPos = { x: 0, y: 0 };
let isPointerDown = false;
const DRAG_THRESHOLD_PX = 5;

renderer.domElement.addEventListener('pointerdown', e => {
  pointerDownPos.x = e.clientX;
  pointerDownPos.y = e.clientY;
  isPointerDown = true;
});

renderer.domElement.addEventListener('pointerup', e => {
  isPointerDown = false;
  if (e.button !== 0) return;
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return;

  handleViewportClick(e);
});

// Hide hover info card immediately when pointer leaves the 3D canvas
const hideHoverCard = () => {
  isPointerDown = false;
  const tooltip = document.getElementById('starHoverTooltip');
  if (tooltip) tooltip.style.display = 'none';
};
renderer.domElement.addEventListener('pointerleave', hideHoverCard);
renderer.domElement.addEventListener('mouseleave', hideHoverCard);

renderer.domElement.addEventListener('dblclick', e => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  const tooltip = document.getElementById('starHoverTooltip');
  if (tooltip) tooltip.style.display = 'none';

  if (viewMode === 'sky') {
    raycaster.setFromCamera(mouseNDC, skyCamera);

    // 1. Check if user double-clicked a Space Station, Telescope, Probe, Deep-Sky, Solar System, or Earth Beacon marker/label
    const markerUd = findClosestSkyMarker(raycaster, 0.028, true);
    if (markerUd) {
      const targetId =
        markerUd.targetObjectId ||
        markerUd.targetPlanetId ||
        markerUd.data?._targetObjectId;
      if (targetId) {
        jumpToCelestialObjectById(targetId, 'inspector');
        return;
      }
    }

    // 2. Check if user double-clicked a Star or a Star's Label Badge in Sky Mode -> Navigate straight to that Star System!
    let hitStar = findClosestSkyStar(raycaster, 0.028, false);
    if (!hitStar && labelsGroup.visible) {
      const labelHits = raycaster.intersectObjects(labelsGroup.children, true);
      const starLabelHit = labelHits.find(h => h.object.visible && h.object.userData?.starEntry);
      if (starLabelHit) {
        hitStar = starLabelHit.object.userData.starEntry;
      }
    }
    if (hitStar) {
      // Remove any accidental custom constellation line created by the two single-clicks preceding dblclick
      if (selectedStars.length > 0 && selectedStars[selectedStars.length - 1]?.id === hitStar.id) {
        selectedStars.pop();
      }
      if (
        customConstellations.length > 0 &&
        customConstellations[customConstellations.length - 1]?.star2Id === hitStar.id
      ) {
        customConstellations.pop();
        rebuildCustomConstellationLines();
      }
      const targetWorldId = resolveOrCreateWorldForSkyStar(hitStar);
      if (targetWorldId) {
        jumpToCelestialObjectById(targetWorldId, 'inspector');
        return;
      }
    }
  } else if (viewMode === 'system' && activeSystemOrrery) {
    raycaster.setFromCamera(mouseNDC, systemCamera);
    const hits = raycaster.intersectObjects(activeSystemOrrery.rootGroup.children, true);
    const planetHit = hits.find(h => h.object.userData?.isSystemPlanet);
    if (planetHit) {
      const moonTargetId = planetHit.object.userData.targetObjectId;
      const targetPlanet = planetHit.object.userData.planetData;
      if (moonTargetId) {
        jumpToCelestialObjectById(moonTargetId, 'inspector');
      } else if (targetPlanet) {
        jumpToCelestialObjectById(targetPlanet.id, 'inspector');
      }
    }
  } else if (activeCelestialSystem) {
    raycaster.setFromCamera(mouseNDC, inspectorCamera);
    // First check if user double-clicked an orbiting Moon, Space Station, Telescope, or Probe
    const moonOrProbeHits = raycaster.intersectObjects(activeCelestialSystem.moonsGroup.children, true);
    if (moonOrProbeHits.length > 0) {
      const hitObj = moonOrProbeHits.find(
        h => h.object.userData?.targetObjectId || h.object.userData?.data?._targetObjectId
      )?.object;
      const targetId = hitObj?.userData?.targetObjectId || hitObj?.userData?.data?._targetObjectId;
      if (targetId) {
        jumpToCelestialObjectById(targetId, 'inspector');
        return;
      }
    }

    const hits = raycaster.intersectObjects(activeCelestialSystem.quadrantOverlayGroup.children, true);
    if (hits.length > 0 && hits[0].object.userData.quadrantId) {
      selectQuadrant(hits[0].object.userData.quadrantId);
      setViewMode('sky');
    }
  }
});

function handleViewportClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  // 1. Check if click occurred inside the Corner 3D Mini-Globe while in Sky Mode
  if (viewMode === 'sky') {
    const miniHud = document.getElementById('miniGlobeHud');
    const miniRect = miniHud.getBoundingClientRect();
    if (
      event.clientX >= miniRect.left &&
      event.clientX <= miniRect.right &&
      event.clientY >= miniRect.top &&
      event.clientY <= miniRect.bottom &&
      activeCelestialSystem
    ) {
      const miniX = ((event.clientX - miniRect.left) / miniRect.width) * 2 - 1;
      const miniY = -((event.clientY - miniRect.top) / miniRect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(miniX, miniY), miniGlobeCamera);
      const qHits = raycaster.intersectObjects(activeCelestialSystem.quadrantOverlayGroup.children, true);
      if (qHits.length > 0 && qHits[0].object.userData.quadrantId) {
        selectQuadrant(qHits[0].object.userData.quadrantId);
      }
      return;
    }
  }

  mouseNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  if (viewMode === 'sky') {
    raycaster.setFromCamera(mouseNDC, skyCamera);

    // Check if user clicked Earth Horizon Beacon, a Space Station/Telescope/Probe, a Solar System Planet/Moon, or a Deep-Sky Object in the sky
    const markerUd = findClosestSkyMarker(raycaster, 0.024, true);
    if (markerUd && markerUd.data) {
      showObjectDetails(markerUd.data);
      return;
    }

    let hitStar = findClosestSkyStar(raycaster, 0.022, false);
    if (!hitStar && labelsGroup.visible) {
      const labelHits = raycaster.intersectObjects(labelsGroup.children, true);
      const starLabelHit = labelHits.find(h => h.object.visible && h.object.userData?.starEntry);
      if (starLabelHit) {
        hitStar = starLabelHit.object.userData.starEntry;
      }
    }
    if (hitStar) {
      handleStarClickInSky(hitStar);
      return;
    }

    // Clicked empty sky -> close any open Object Details popup card
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
  } else if (viewMode === 'system' && activeSystemOrrery) {
    raycaster.setFromCamera(mouseNDC, systemCamera);
    const hits = raycaster.intersectObjects(activeSystemOrrery.rootGroup.children, true);
    if (hits.length > 0) {
      const planetHit = hits.find(h => h.object.userData?.isSystemPlanet);
      const starHit = hits.find(h => h.object.userData?.isHostStar);
      if (planetHit) {
        const p = planetHit.object.userData.planetData;
        const moonName = planetHit.object.userData.moonName;
        const moonTargetId = planetHit.object.userData.targetObjectId;
        const prof = planetHit.object.userData.profile || classifyPlanet(p);
        if (p && p !== currentPlanet && !moonTargetId) {
          const selectEl = document.getElementById('exoplanetSelect');
          if (selectEl) selectEl.value = p.id;
          updateSkyAndInspectorForPlanet(p, false);
        }
        showObjectDetails({
          World: moonName ? `${moonName} (Moon of ${p.id.split(' (')[0]})` : p.id,
          Classification: moonName ? 'Natural Satellite / Moon' : prof.type,
          'Host System': `${p.hostname} (${activeSystemOrrery.systemPlanetsCount} Worlds in System)`,
          'Orbital Distance': `${p.pl_orbsmax ?? '?'} AU (Period: ${p.pl_orbper ?? '?'} days)`,
          Radius: `${p.pl_rade ?? 1.0} R⊕ (${p.pl_radj ?? 0.09} R♃)`,
          'Equilibrium Temp': `${p.pl_eqt ?? 'N/A'} K`,
          'Distance to Earth': formatDistanceToEarth(p),
          Tip: 'Click the buttons below or double-click in the Star System to inspect in 3D or view its sky!',
          _targetObjectId: moonTargetId || p.id
        });
        return;
      } else if (starHit) {
        showObjectDetails(starHit.object.userData.data);
        return;
      }
    }
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
  } else if (activeCelestialSystem) {
    raycaster.setFromCamera(mouseNDC, inspectorCamera);
    const hits = raycaster.intersectObjects(activeCelestialSystem.rootGroup.children, true);
    if (hits.length > 0) {
      const obj = hits.find(
        h =>
          h.object.userData &&
          (h.object.userData.isExpeditionProbe ||
            h.object.userData.isQuadrant ||
            h.object.userData.isMoon ||
            h.object.userData.isHostStar ||
            h.object.userData.isPlanet)
      )?.object || hits[0].object;

      if (obj.userData.isExpeditionProbe) {
        showObjectDetails(obj.userData.data);
        return;
      } else if (obj.userData.isQuadrant) {
        selectQuadrant(obj.userData.quadrantId);
        const q = obj.userData.quadrantData;
        showObjectDetails({
          Quadrant: q.name,
          Latitude: `${q.latRange[0]}° to ${q.latRange[1]}°`,
          Longitude: `${q.lonRange[0]}° to ${q.lonRange[1]}°`,
          'Earth Reference': q.earthRegion,
          'Planet Sector': q.exoRegion,
          Tip: 'Double-click any quadrant or click "Sky Observatory" to view the constellations from here!'
        });
        return;
      } else if (obj.userData.isMoon) {
        showObjectDetails(obj.userData.data);
        return;
      } else if (obj.userData.isHostStar) {
        showObjectDetails(obj.userData.data);
        return;
      } else if (obj.userData.isPlanet) {
        showObjectDetails({
          World: currentPlanet.id,
          Classification: activeCelestialSystem.profile.type,
          'Distance to Earth': formatDistanceToEarth(currentPlanet),
          Radius: `${currentPlanet.pl_rade} R⊕ (${currentPlanet.pl_radj} R♃)`,
          Mass: `${currentPlanet.pl_bmasse ?? 'N/A'} M⊕`,
          'Equilibrium Temp': `${currentPlanet.pl_eqt} K`,
          'Host Star': `${currentPlanet.hostname} (${currentPlanet.st_spectype || 'G2 V'})`,
          _targetObjectId: currentPlanet.id
        });
        return;
      }
    }
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';
  }
}

// Hover Tooltip Handler
renderer.domElement.addEventListener('pointermove', event => {
  const tooltip = document.getElementById('starHoverTooltip');
  if (!tooltip) return;

  // Hide tooltip immediately if user is dragging the camera
  if (isPointerDown) {
    const moveDist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
    if (moveDist > DRAG_THRESHOLD_PX) {
      tooltip.style.display = 'none';
      return;
    }
  }

  const rect = renderer.domElement.getBoundingClientRect();
  mouseNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  if (viewMode === 'sky') {
    raycaster.setFromCamera(mouseNDC, skyCamera);

    // 1. Check Earth Beacon, Space Missions/Stations, Solar System Sky Bodies, or Deep-Sky Objects using tight angular hit-test
    const markerUd = findClosestSkyMarker(raycaster, 0.015, false);
    if (markerUd && markerUd.data) {
      const d = markerUd.data;
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>${d.Object}</strong><br/>
        📏 Dist: <strong>${d['Distance from Current World']}</strong><br/>
        🧭 ${d['Horizon Bearing'] || d['Where to Look'] || ''}<br/>
        <em>Click for details · Double-click to inspect in 3D</em>
      `;
      return;
    }

    // 2. Check prominent / visible stars using tight hover radius so moving onto empty sky immediately hides the card
    const hitStar = findClosestSkyStar(raycaster, 0.011, true);
    if (hitStar) {
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>${hitStar.name}</strong> (HIP ${hitStar.id})<br/>
        🧭 Look: <strong>${hitStar.compass}</strong> · Az ${hitStar.azDeg}° · Alt ${hitStar.altDeg}°<br/>
        ✨ Mag: <strong>${hitStar.appMag}</strong> · Dist: ${hitStar.distLyFromPlanet} ly · ${hitStar.teff} K<br/>
        <em>Click for details · Double-click to travel to this star</em>
      `;
      return;
    }
  } else if (viewMode === 'system' && activeSystemOrrery) {
    raycaster.setFromCamera(mouseNDC, systemCamera);
    const hits = raycaster.intersectObjects(activeSystemOrrery.rootGroup.children, true);
    const planetHit = hits.find(h => h.object.userData?.isSystemPlanet && !h.object.isSprite);
    if (planetHit) {
      const p = planetHit.object.userData.planetData;
      const moonName = planetHit.object.userData.moonName;
      const prof = planetHit.object.userData.profile || classifyPlanet(p);
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>${moonName ? `🌕 ${moonName} (${p.id.split(' (')[0]})` : p.id}</strong> (${prof.type})<br/>
        🪐 Orbit: <strong>${p.pl_orbsmax ?? '?'} AU</strong> · Period: ${p.pl_orbper ?? '?'} d<br/>
        🌡️ Temp: ${p.pl_eqt ?? 'N/A'} K · Radius: ${p.pl_rade ?? 1.0} R⊕<br/>
        <em>Click to select · Double-click to inspect up close</em>
      `;
      return;
    }
  } else if (activeCelestialSystem) {
    raycaster.setFromCamera(mouseNDC, inspectorCamera);
    const allHits = raycaster.intersectObjects(activeCelestialSystem.rootGroup.children, true);
    const probeHit = allHits.find(h => h.object.userData?.isExpeditionProbe && !h.object.isSprite);
    if (probeHit && probeHit.object.userData.data) {
      const d = probeHit.object.userData.data;
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>🛰️ ${d['Scientific Expedition'] || 'Spacecraft'}</strong><br/>
        🏛️ ${d['Agency & Timeline'] || ''}<br/>
        🚀 <strong>${d['Vehicles / Spacecraft Sent'] || ''}</strong><br/>
        <em>Click for details · Double-click to inspect 3D spacecraft</em>
      `;
      return;
    }
    const moonHit = allHits.find(
      h => h.object.userData?.isMoon && !h.object.userData?.isExpeditionProbe && !h.object.isSprite
    );
    if (moonHit && moonHit.object.userData.data) {
      const d = moonHit.object.userData.data;
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>🌕 ${d.Moon || d['Parent World'] || 'Satellite'}</strong><br/>
        🪐 ${d['Parent World'] ? `Parent: ${d['Parent World']}` : ''}<br/>
        <em>Click for details · Double-click to inspect in 3D</em>
      `;
      return;
    }
    const qHits = raycaster.intersectObjects(activeCelestialSystem.quadrantOverlayGroup.children, true);
    if (qHits.length > 0 && qHits[0].object.userData.isQuadrant) {
      const q = qHits[0].object.userData.quadrantData;
      renderer.domElement.style.cursor = 'pointer';
      tooltip.style.display = 'block';
      tooltip.style.left = `${Math.min(rect.width - 260, event.clientX - rect.left + 14)}px`;
      tooltip.style.top = `${Math.max(10, event.clientY - rect.top + 14)}px`;
      tooltip.innerHTML = `
        <strong>${q.name}</strong><br/>
        ${currentPlanet?.isEarth ? q.earthRegion : q.exoRegion}<br/>
        <em>Click to select · Double-click to enter Sky View</em>
      `;
      return;
    }
  }

  renderer.domElement.style.cursor = 'grab';
  tooltip.style.display = 'none';
});

function showObjectDetails(data) {
  let popup = document.getElementById('popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popup';
    document.body.appendChild(popup);
  }

  popup.innerHTML = '<h3>Object Details</h3>';
  for (const key in data) {
    if (key.startsWith('_')) continue;
    popup.innerHTML += `<strong>${key}:</strong> ${data[key]}<br/>`;
  }

  const targetId = data._targetObjectId || data.targetObjectId;
  if (targetId && exoplanets.some(p => p.id === targetId)) {
    const shortTarget = targetId.split(' (')[0].split(' — ')[0];
    const inspectBtn = document.createElement('button');
    inspectBtn.className = 'popup-jump-btn';
    inspectBtn.textContent = `🪐 Inspect 3D Model (${shortTarget})`;
    inspectBtn.onclick = () => {
      jumpToCelestialObjectById(targetId, 'inspector');
    };
    popup.appendChild(inspectBtn);

    const skyBtn = document.createElement('button');
    skyBtn.className = 'popup-jump-btn';
    skyBtn.textContent = `🌌 View Sky from ${shortTarget}`;
    skyBtn.onclick = () => {
      jumpToCelestialObjectById(targetId, 'sky');
    };
    popup.appendChild(skyBtn);
  }

  const closeButton = document.createElement('button');
  closeButton.className = 'tool-btn';
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '8px';
  closeButton.style.width = '100%';
  closeButton.onclick = () => {
    popup.style.display = 'none';
  };
  popup.appendChild(closeButton);
  popup.style.display = 'block';
}

// Bind All UI Controls
document.getElementById('planetSearchInput').addEventListener('input', () => {
  filterAndPopulatePlanets(false);
});

document.getElementById('planetCategoryFilter').addEventListener('change', () => {
  filterAndPopulatePlanets(false);
});

document.getElementById('exoplanetSelect').addEventListener('change', e => {
  const selected = exoplanets.find(p => p.id === e.target.value);
  if (selected) {
    updateSkyAndInspectorForPlanet(selected, false);
  }
});

document.getElementById('earthHorizonReadout').addEventListener('click', lookAtEarthOnHorizon);

document.getElementById('modeSkyBtn').addEventListener('click', () => setViewMode('sky'));
document.getElementById('modeInspectorBtn').addEventListener('click', () => setViewMode('inspector'));
const modeSystemBtnEl = document.getElementById('modeSystemBtn');
if (modeSystemBtnEl) {
  modeSystemBtnEl.addEventListener('click', () => setViewMode('system'));
}
document.getElementById('expandInspectorBtn').addEventListener('click', () => setViewMode('inspector'));

// Bind On-Screen Optical Zoom HUD Controls
const zoomInBtnEl = document.getElementById('zoomInBtn');
if (zoomInBtnEl) {
  zoomInBtnEl.addEventListener('click', () => applyViewportZoom(0.75, false));
}
const zoomOutBtnEl = document.getElementById('zoomOutBtn');
if (zoomOutBtnEl) {
  zoomOutBtnEl.addEventListener('click', () => applyViewportZoom(1.33, false));
}
const zoomResetBtnEl = document.getElementById('zoomResetBtn');
if (zoomResetBtnEl) {
  zoomResetBtnEl.addEventListener('click', () => applyViewportZoom(1.0, true));
}
const zoomReadoutEl = document.getElementById('zoomLevelReadout');
if (zoomReadoutEl) {
  zoomReadoutEl.addEventListener('click', () => applyViewportZoom(1.0, true));
}

document.getElementById('toggleDossierBtn').addEventListener('click', e => {
  const body = document.getElementById('dossierBody');
  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'block' : 'none';
  e.target.textContent = isHidden ? '−' : '+';
});

// Auto-collapse dossier drawer on mobile screens so 3D viewport is unobstructed
if (typeof window !== 'undefined' && window.innerWidth <= 768) {
  const dBody = document.getElementById('dossierBody');
  const dBtn = document.getElementById('toggleDossierBtn');
  if (dBody && dBtn) {
    dBody.style.display = 'none';
    dBtn.textContent = '+';
  }
}

document.getElementById('toggleIAUButton').addEventListener('click', e => {
  showIAUConstellations = !showIAUConstellations;
  iauGroup.visible = showIAUConstellations;
  e.target.classList.toggle('active', showIAUConstellations);
  e.target.textContent = `✨ IAU Constellations: ${showIAUConstellations ? 'ON' : 'OFF'}`;
});

const toggleDeepSkyBtnEl = document.getElementById('toggleDeepSkyButton');
if (toggleDeepSkyBtnEl) {
  toggleDeepSkyBtnEl.addEventListener('click', e => {
    showDeepSky = !showDeepSky;
    deepSkyGroup.visible = showDeepSky;
    e.target.classList.toggle('active', showDeepSky);
    e.target.textContent = `🌀 Deep-Sky: ${showDeepSky ? 'ON' : 'OFF'}`;
  });
}

document.getElementById('toggleHorizonButton').addEventListener('click', e => {
  showHorizonCompass = !showHorizonCompass;
  horizonCompassGroup.visible = showHorizonCompass;
  e.target.classList.toggle('active', showHorizonCompass);
  e.target.textContent = `🧭 Compass & Horizon: ${showHorizonCompass ? 'ON' : 'OFF'}`;
});

document.getElementById('toggleBelowHorizonButton').addEventListener('click', e => {
  const order = ['dimmed', 'hidden', 'full'];
  belowHorizonMode = order[(order.indexOf(belowHorizonMode) + 1) % order.length];
  const labels = { dimmed: 'Dimmed', hidden: 'Hidden', full: 'Full Sky' };
  e.target.textContent = `🌗 Below Horizon: ${labels[belowHorizonMode]}`;
  refreshStarVisualAttributes();
  const q = PLANETARY_QUADRANTS.find(item => item.id === currentQuadrantId) || PLANETARY_QUADRANTS[0];
  buildHorizonAndCompassGrid(q);
  if (currentPlanet) {
    buildEarthHorizonBeaconAndSolarSystemSky(currentPlanet, q);
    buildSpaceMissionsInSky(currentPlanet, q);
    buildDeepSkyObjectsInSky(currentPlanet, q);
  }
  rebuildIAUConstellationsAndLabels();
});

document.getElementById('toggleStarLabelsButton').addEventListener('click', e => {
  showStarLabels = !showStarLabels;
  labelsGroup.visible = showStarLabels;
  solarSystemSkyGroup.visible = showStarLabels;
  spaceMissionsSkyGroup.visible = showStarLabels;
  e.target.classList.toggle('active', showStarLabels);
  e.target.textContent = `🏷️ Labels: ${showStarLabels ? 'ON' : 'OFF'}`;
});

document.getElementById('undoButton').addEventListener('click', undoLastLine);
document.getElementById('clearLinesButton').addEventListener('click', clearCustomConstellations);

document.getElementById('toggleAllStarsButton').addEventListener('click', e => {
  allStarsDimmed = !allStarsDimmed;
  e.target.classList.toggle('active', allStarsDimmed);
  refreshStarVisualAttributes();
});

document.getElementById('resetCameraButton').addEventListener('click', resetActiveCamera);

document.getElementById('saveConstellationsButton').addEventListener('click', () => {
  const data = {
    exoplanet: currentPlanet?.id,
    quadrant: currentQuadrantId,
    constellations: customConstellations
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `constellations_${(currentPlanet?.id || 'world').replace(/\s+/g, '_')}_${currentQuadrantId}.json`;
  link.href = url;
  link.click();
});

document.getElementById('loadConstellationsBtn').addEventListener('click', () => {
  document.getElementById('loadConstellationsInput').click();
});

document.getElementById('loadConstellationsInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.exoplanet) {
        const target = exoplanets.find(p => p.id === parsed.exoplanet);
        if (target) {
          document.getElementById('exoplanetSelect').value = target.id;
          currentPlanet = target;
        }
      }
      if (parsed.quadrant) {
        currentQuadrantId = parsed.quadrant;
      }
      if (Array.isArray(parsed.constellations)) {
        if (parsed.constellations.length > 0 && typeof parsed.constellations[0] === 'object') {
          customConstellations = parsed.constellations;
        } else {
          customConstellations = [];
          for (let i = 1; i < parsed.constellations.length; i++) {
            customConstellations.push({
              star1Id: String(parsed.constellations[i - 1]).trim(),
              star2Id: String(parsed.constellations[i]).trim(),
              name: 'Loaded Constellation'
            });
          }
        }
      }
      if (currentPlanet) {
        updateSkyAndInspectorForPlanet(currentPlanet, false);
      }
    } catch (err) {
      console.error('Failed to load constellations JSON:', err);
    }
  };
  reader.readAsText(file);
});

document.getElementById('exportButton').addEventListener('click', () => {
  renderFrame(performance.now() * 0.001);
  const dataURL = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `exosky_${(currentPlanet?.id || 'chart').replace(/\s+/g, '_')}_${currentQuadrantId}.png`;
  link.href = dataURL;
  link.click();
});

document.getElementById('downloadDataButton').addEventListener('click', () => {
  const data = {
    selectedWorld: currentPlanet,
    selectedQuadrant: currentQuadrantId,
    earthHorizonBearing: currentEarthHorizonInfo,
    visibleSkyStarsCount: activeSkyStars.length,
    customConstellations
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'exosky_active_data.json';
  link.href = url;
  link.click();
});

function handleResize() {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || (window.innerHeight - 130);
  skyCamera.aspect = w / h;
  skyCamera.updateProjectionMatrix();
  inspectorCamera.aspect = w / h;
  inspectorCamera.updateProjectionMatrix();
  systemCamera.aspect = w / h;
  systemCamera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

window.addEventListener('resize', handleResize);
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(handleResize).observe(container);
}
handleResize();

function updateLiveCompassReadout() {
  const readoutEl = document.getElementById('compassReadout');
  if (!readoutEl) return;

  if (viewMode === 'sky') {
    const lookDir = new THREE.Vector3();
    skyCamera.getWorldDirection(lookDir);
    const altDeg = Math.round(THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, lookDir.y)))));
    const azRad = Math.atan2(lookDir.x, -lookDir.z);
    const azDeg = Math.round((THREE.MathUtils.radToDeg(azRad) + 360) % 360);
    const comp = azimuthToCompass16(azDeg);
    const sign = altDeg >= 0 ? '+' : '';
    readoutEl.innerHTML = `🧭 Look: <strong>${comp} (Az ${azDeg}°) · Alt ${sign}${altDeg}°</strong>`;
  } else if (viewMode === 'system') {
    const sysCount = activeSystemOrrery?.systemPlanetsCount || 1;
    readoutEl.innerHTML = `☀️ System: <strong>${currentPlanet?.hostname || 'Sol'} (${sysCount} Worlds)</strong>`;
  } else {
    readoutEl.innerHTML = `🪐 Mode: <strong>Up-Close 3D Inspector (${currentQuadrantId})</strong>`;
  }
}

function renderFrame(timeSec) {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || (window.innerHeight - 130);

  if (activeCelestialSystem) {
    activeCelestialSystem.planetMat.uniforms.uTime.value = timeSec;
    activeCelestialSystem.starMat.uniforms.uTime.value = timeSec;
    if (activeCelestialSystem.updateOrbitingMoons) {
      activeCelestialSystem.updateOrbitingMoons(timeSec);
    }
  }

  if (activeSystemOrrery && activeSystemOrrery.updateOrrery) {
    activeSystemOrrery.updateOrrery(timeSec);
  }

  renderer.setViewport(0, 0, w, h);
  renderer.setScissor(0, 0, w, h);
  renderer.setScissorTest(false);
  renderer.clear();

  if (viewMode === 'sky') {
    skyControls.update();
    renderer.render(skyScene, skyCamera);

    // Render Corner 3D Mini-Globe in bottom-right HUD box
    const miniHud = document.getElementById('miniGlobeHud');
    if (miniHud && miniHud.style.display !== 'none' && activeCelestialSystem) {
      const cRect = container.getBoundingClientRect();
      const mRect = miniHud.getBoundingClientRect();
      const vpW = mRect.width;
      const vpH = mRect.height;
      const vpX = mRect.left - cRect.left;
      const vpY = cRect.bottom - mRect.bottom;

      if (vpW > 20 && vpH > 20) {
        miniGlobeCamera.aspect = vpW / vpH;
        miniGlobeCamera.updateProjectionMatrix();

        const q = PLANETARY_QUADRANTS.find(item => item.id === currentQuadrantId) || PLANETARY_QUADRANTS[0];
        const latRad = THREE.MathUtils.degToRad(q.centerLat * 0.55);
        const lonRad = THREE.MathUtils.degToRad(q.centerLon) + Math.sin(timeSec * 0.35) * 0.18;
        miniGlobeCamera.position.set(
          3.4 * Math.cos(latRad) * Math.cos(lonRad),
          3.4 * Math.sin(latRad),
          -3.4 * Math.cos(latRad) * Math.sin(lonRad)
        );
        miniGlobeCamera.lookAt(0, 0, 0);
        if (activeCelestialSystem.updateHiddenSideLabels) {
          activeCelestialSystem.updateHiddenSideLabels(miniGlobeCamera);
        }

        renderer.setViewport(vpX, vpY, vpW, vpH);
        renderer.setScissor(vpX, vpY, vpW, vpH);
        renderer.setScissorTest(true);
        renderer.clearDepth();
        renderer.render(inspectorScene, miniGlobeCamera);
        renderer.setScissorTest(false);
      }
    }
  } else if (viewMode === 'system') {
    systemControls.update();
    renderer.render(systemScene, systemCamera);
  } else {
    inspectorControls.update();
    if (activeCelestialSystem && activeCelestialSystem.updateHiddenSideLabels) {
      activeCelestialSystem.updateHiddenSideLabels(inspectorCamera);
    }
    renderer.render(inspectorScene, inspectorCamera);
  }

  updateLiveCompassReadout();
}

function animate(nowMs) {
  requestAnimationFrame(animate);
  renderFrame((nowMs || 0) * 0.001);
}

initQuadrantButtons();
resetActiveCamera();

Promise.all([
  fetch('planet_batch_1.json').then(r => r.json()),
  fetch('stars.json').then(r => r.json())
]).then(([planetData, starData]) => {
  exoplanets = planetData;
  starsCatalog = starData;
  precomputeStarCatalogCartesian();
  filterAndPopulatePlanets(false);
  console.log(`Loaded ${exoplanets.length} worlds (including Solar System planets, moons & deep-sky objects) and ${starsCatalog.length} catalog stars.`);
  animate(0);
}).catch(err => {
  console.error('Error loading ExoSky datasets:', err);
});
