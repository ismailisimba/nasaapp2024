// Curated Astronomical Reference Data:
// 1. 8 Planetary Quadrants (Octants) for Earth, Solar System Bodies & Exoplanets
// 2. Solar System Planets, Dwarf Planets & Major Moons (with 3D Heliocentric/Planetocentric Positions & Moons)
// 3. Accurate Earth Continent Polygons (Lon/Lat) aligned with the 8 Quadrants
// 4. Major IAU Constellation Stick Figures (Hipparcos HIP ID pairs) & Named Stars

export const PLANETARY_QUADRANTS = [
  {
    id: 'Q1',
    shortLabel: 'Q1 · NE-1',
    name: 'Quadrant 1 (North-East I)',
    hemisphere: 'Northern',
    latRange: [0, 90],
    lonRange: [0, 90],
    centerLat: 45,
    centerLon: 45,
    earthRegion: 'Europe, Middle East, Central & South Asia',
    exoRegion: 'Northern Sub-Stellar East (0°–90°N, 0°–90°E)',
    color: 0x38bdf8
  },
  {
    id: 'Q2',
    shortLabel: 'Q2 · NW-1',
    name: 'Quadrant 2 (North-West I)',
    hemisphere: 'Northern',
    latRange: [0, 90],
    lonRange: [-90, 0],
    centerLat: 45,
    centerLon: -45,
    earthRegion: 'Eastern North America, Greenland, Caribbean, N. Atlantic',
    exoRegion: 'Northern Sub-Stellar West (0°–90°N, 0°–90°W)',
    color: 0x60a5fa
  },
  {
    id: 'Q3',
    shortLabel: 'Q3 · NW-2',
    name: 'Quadrant 3 (North-West II)',
    hemisphere: 'Northern',
    latRange: [0, 90],
    lonRange: [-180, -90],
    centerLat: 45,
    centerLon: -135,
    earthRegion: 'Western North America, Alaska, N. Pacific',
    exoRegion: 'Northern Anti-Stellar West (0°–90°N, 90°–180°W)',
    color: 0x818cf8
  },
  {
    id: 'Q4',
    shortLabel: 'Q4 · NE-2',
    name: 'Quadrant 4 (North-East II)',
    hemisphere: 'Northern',
    latRange: [0, 90],
    lonRange: [90, 180],
    centerLat: 45,
    centerLon: 135,
    earthRegion: 'East Asia, China, Japan, Siberia, Western N. Pacific',
    exoRegion: 'Northern Anti-Stellar East (0°–90°N, 90°–180°E)',
    color: 0x2dd4bf
  },
  {
    id: 'Q5',
    shortLabel: 'Q5 · SE-1',
    name: 'Quadrant 5 (South-East I)',
    hemisphere: 'Southern',
    latRange: [-90, 0],
    lonRange: [0, 90],
    centerLat: -45,
    centerLon: 45,
    earthRegion: 'Southern & Eastern Africa, Madagascar, Indian Ocean',
    exoRegion: 'Southern Sub-Stellar East (0°–90°S, 0°–90°E)',
    color: 0xf59e0b
  },
  {
    id: 'Q6',
    shortLabel: 'Q6 · SW-1',
    name: 'Quadrant 6 (South-West I)',
    hemisphere: 'Southern',
    latRange: [-90, 0],
    lonRange: [-90, 0],
    centerLat: -45,
    centerLon: -45,
    earthRegion: 'South America, Amazon & Andes, South Atlantic',
    exoRegion: 'Southern Sub-Stellar West (0°–90°S, 0°–90°W)',
    color: 0xf97316
  },
  {
    id: 'Q7',
    shortLabel: 'Q7 · SW-2',
    name: 'Quadrant 7 (South-West II)',
    hemisphere: 'Southern',
    latRange: [-90, 0],
    lonRange: [-180, -90],
    centerLat: -45,
    centerLon: -135,
    earthRegion: 'Polynesia, New Zealand East, South Pacific Ocean',
    exoRegion: 'Southern Anti-Stellar West (0°–90°S, 90°–180°W)',
    color: 0xec4899
  },
  {
    id: 'Q8',
    shortLabel: 'Q8 · SE-2',
    name: 'Quadrant 8 (South-East II)',
    hemisphere: 'Southern',
    latRange: [-90, 0],
    lonRange: [90, 180],
    centerLat: -45,
    centerLon: 135,
    earthRegion: 'Australia, Indonesia, Maritime SE Asia',
    exoRegion: 'Southern Anti-Stellar East (0°–90°S, 90°–180°E)',
    color: 0x10b981
  }
];

// Solar System Planets & Major Moons
// Heliocentric coordinates (x_au, y_au, z_au) in ICRS/Equatorial J2000 where Earth is at (1.0, 0.0, 0.0) AU
export const SOLAR_SYSTEM_BODIES = [
  {
    id: 'Earth (Sol System)',
    pl_name: 'Earth (Sol System)',
    hostname: 'Sol (Our Sun)',
    isEarth: true,
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'earth',
    x_au: 1.0,
    y_au: 0.0,
    z_au: 0.0,
    dist_km_from_earth: 0,
    pl_rade: 1.0,
    pl_radj: 0.0892,
    pl_bmasse: 1.0,
    pl_bmassj: 0.00315,
    pl_orbper: 365.256,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.0167,
    pl_eqt: 255,
    discoverymethod: 'Home World (Solar System)',
    disc_year: 'Prehistoric',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Moon (Luna)', radiusRatio: 0.273, orbitRadius: 5.35, speed: 0.42, color: 0xcbd5e1, inclination: 0.09, targetObjectId: 'Moon / Luna (Earth Moon)' }
    ]
  },
  {
    id: 'Moon / Luna (Earth Moon)',
    pl_name: 'Moon / Luna (Earth Moon)',
    hostname: 'Earth / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Earth (Sol System)',
    solarPreset: 'moon',
    x_au: 1.0018,
    y_au: 0.0018,
    z_au: 0.0003,
    dist_km_from_earth: 384400,
    pl_rade: 0.2727,
    pl_radj: 0.0243,
    pl_bmasse: 0.0123,
    pl_bmassj: 0.000039,
    pl_orbper: 27.32,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.0549,
    pl_eqt: 250,
    discoverymethod: 'Solar System Moon',
    disc_year: 'Prehistoric',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Mercury (Sol System)',
    pl_name: 'Mercury (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'mercury',
    x_au: 0.26,
    y_au: 0.28,
    z_au: 0.09,
    dist_km_from_earth: 118000000,
    pl_rade: 0.3829,
    pl_radj: 0.0341,
    pl_bmasse: 0.0553,
    pl_bmassj: 0.000174,
    pl_orbper: 87.97,
    pl_orbsmax: 0.387,
    pl_orbeccen: 0.2056,
    pl_eqt: 440,
    discoverymethod: 'Solar System Planet',
    disc_year: 'Antiquity',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Venus (Sol System)',
    pl_name: 'Venus (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'venus',
    x_au: 0.52,
    y_au: -0.46,
    z_au: -0.19,
    dist_km_from_earth: 102000000,
    pl_rade: 0.9499,
    pl_radj: 0.0847,
    pl_bmasse: 0.815,
    pl_bmassj: 0.00256,
    pl_orbper: 224.7,
    pl_orbsmax: 0.723,
    pl_orbeccen: 0.0067,
    pl_eqt: 737,
    discoverymethod: 'Solar System Planet',
    disc_year: 'Antiquity',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Mars (Sol System)',
    pl_name: 'Mars (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'mars',
    x_au: 1.38,
    y_au: 0.62,
    z_au: 0.24,
    dist_km_from_earth: 112000000,
    pl_rade: 0.532,
    pl_radj: 0.0475,
    pl_bmasse: 0.107,
    pl_bmassj: 0.000338,
    pl_orbper: 686.98,
    pl_orbsmax: 1.524,
    pl_orbeccen: 0.0934,
    pl_eqt: 210,
    discoverymethod: 'Solar System Planet',
    disc_year: 'Antiquity',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Phobos', radiusRatio: 0.032, orbitRadius: 1.55, speed: 1.45, color: 0xa89f91, inclination: 0.03, targetObjectId: 'Phobos (Mars Moon)' },
      { name: 'Deimos', radiusRatio: 0.024, orbitRadius: 2.65, speed: 0.78, color: 0xc2b8a3, inclination: 0.05 }
    ]
  },
  {
    id: 'Phobos (Mars Moon)',
    pl_name: 'Phobos (Mars Moon)',
    hostname: 'Mars / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Mars (Sol System)',
    solarPreset: 'phobos',
    x_au: 1.3801,
    y_au: 0.6201,
    z_au: 0.24,
    dist_km_from_earth: 112009000,
    pl_rade: 0.0018,
    pl_radj: 0.00016,
    pl_bmasse: 0.000001,
    pl_bmassj: 0.0000001,
    pl_orbper: 0.319,
    pl_orbsmax: 1.524,
    pl_orbeccen: 0.015,
    pl_eqt: 233,
    discoverymethod: 'Solar System Moon',
    disc_year: 1877,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Jupiter (Sol System)',
    pl_name: 'Jupiter (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'jupiter',
    x_au: 3.45,
    y_au: 3.55,
    z_au: 1.42,
    dist_km_from_earth: 662000000,
    pl_rade: 11.209,
    pl_radj: 1.0,
    pl_bmasse: 317.83,
    pl_bmassj: 1.0,
    pl_orbper: 4332.59,
    pl_orbsmax: 5.204,
    pl_orbeccen: 0.0489,
    pl_eqt: 110,
    discoverymethod: 'Solar System Planet',
    disc_year: 'Antiquity',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Io', radiusRatio: 0.042, orbitRadius: 2.35, speed: 1.25, color: 0xfacc15, inclination: 0.02, targetObjectId: 'Io (Jupiter Moon)' },
      { name: 'Europa', radiusRatio: 0.036, orbitRadius: 3.25, speed: 0.90, color: 0xe0f2fe, inclination: 0.03, targetObjectId: 'Europa (Jupiter Moon)' },
      { name: 'Ganymede', radiusRatio: 0.058, orbitRadius: 4.55, speed: 0.62, color: 0x94a3b8, inclination: 0.04, targetObjectId: 'Ganymede (Jupiter Moon)' },
      { name: 'Callisto', radiusRatio: 0.052, orbitRadius: 6.35, speed: 0.42, color: 0x64748b, inclination: 0.05, targetObjectId: 'Callisto (Jupiter Moon)' }
    ]
  },
  {
    id: 'Io (Jupiter Moon)',
    pl_name: 'Io (Jupiter Moon)',
    hostname: 'Jupiter / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Jupiter (Sol System)',
    solarPreset: 'io',
    x_au: 3.452,
    y_au: 3.551,
    z_au: 1.42,
    dist_km_from_earth: 662420000,
    pl_rade: 0.286,
    pl_radj: 0.0255,
    pl_bmasse: 0.015,
    pl_bmassj: 0.000047,
    pl_orbper: 1.769,
    pl_orbsmax: 5.204,
    pl_orbeccen: 0.004,
    pl_eqt: 110,
    discoverymethod: 'Galilean Moon',
    disc_year: 1610,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Europa (Jupiter Moon)',
    pl_name: 'Europa (Jupiter Moon)',
    hostname: 'Jupiter / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Jupiter (Sol System)',
    solarPreset: 'europa',
    x_au: 3.454,
    y_au: 3.553,
    z_au: 1.421,
    dist_km_from_earth: 662670000,
    pl_rade: 0.245,
    pl_radj: 0.0219,
    pl_bmasse: 0.008,
    pl_bmassj: 0.000025,
    pl_orbper: 3.551,
    pl_orbsmax: 5.204,
    pl_orbeccen: 0.009,
    pl_eqt: 102,
    discoverymethod: 'Galilean Moon',
    disc_year: 1610,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Ganymede (Jupiter Moon)',
    pl_name: 'Ganymede (Jupiter Moon)',
    hostname: 'Jupiter / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Jupiter (Sol System)',
    solarPreset: 'ganymede',
    x_au: 3.457,
    y_au: 3.555,
    z_au: 1.422,
    dist_km_from_earth: 663070000,
    pl_rade: 0.413,
    pl_radj: 0.0369,
    pl_bmasse: 0.0248,
    pl_bmassj: 0.000078,
    pl_orbper: 7.155,
    pl_orbsmax: 5.204,
    pl_orbeccen: 0.001,
    pl_eqt: 110,
    discoverymethod: 'Galilean Moon',
    disc_year: 1610,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Callisto (Jupiter Moon)',
    pl_name: 'Callisto (Jupiter Moon)',
    hostname: 'Jupiter / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Jupiter (Sol System)',
    solarPreset: 'callisto',
    x_au: 3.461,
    y_au: 3.559,
    z_au: 1.423,
    dist_km_from_earth: 663880000,
    pl_rade: 0.378,
    pl_radj: 0.0338,
    pl_bmasse: 0.018,
    pl_bmassj: 0.000056,
    pl_orbper: 16.689,
    pl_orbsmax: 5.204,
    pl_orbeccen: 0.007,
    pl_eqt: 134,
    discoverymethod: 'Galilean Moon',
    disc_year: 1610,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Saturn (Sol System)',
    pl_name: 'Saturn (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'saturn',
    x_au: 8.65,
    y_au: -3.65,
    z_au: -1.65,
    dist_km_from_earth: 1295000000,
    pl_rade: 9.449,
    pl_radj: 0.843,
    pl_bmasse: 95.16,
    pl_bmassj: 0.299,
    pl_orbper: 10759.22,
    pl_orbsmax: 9.582,
    pl_orbeccen: 0.0565,
    pl_eqt: 81,
    discoverymethod: 'Solar System Planet',
    disc_year: 'Antiquity',
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Enceladus', radiusRatio: 0.028, orbitRadius: 2.85, speed: 1.08, color: 0xf0f9ff, inclination: 0.04, targetObjectId: 'Enceladus (Saturn Moon)' },
      { name: 'Titan', radiusRatio: 0.062, orbitRadius: 5.45, speed: 0.56, color: 0xf59e0b, inclination: 0.06, targetObjectId: 'Titan (Saturn Moon)' }
    ]
  },
  {
    id: 'Titan (Saturn Moon)',
    pl_name: 'Titan (Saturn Moon)',
    hostname: 'Saturn / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Saturn (Sol System)',
    solarPreset: 'titan',
    x_au: 8.658,
    y_au: -3.652,
    z_au: -1.651,
    dist_km_from_earth: 1296200000,
    pl_rade: 0.404,
    pl_radj: 0.036,
    pl_bmasse: 0.0225,
    pl_bmassj: 0.000071,
    pl_orbper: 15.945,
    pl_orbsmax: 9.582,
    pl_orbeccen: 0.0288,
    pl_eqt: 94,
    discoverymethod: 'Solar System Moon',
    disc_year: 1655,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Enceladus (Saturn Moon)',
    pl_name: 'Enceladus (Saturn Moon)',
    hostname: 'Saturn / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Saturn (Sol System)',
    solarPreset: 'enceladus',
    x_au: 8.652,
    y_au: -3.651,
    z_au: -1.65,
    dist_km_from_earth: 1295240000,
    pl_rade: 0.0395,
    pl_radj: 0.0035,
    pl_bmasse: 0.000018,
    pl_bmassj: 0.0000001,
    pl_orbper: 1.37,
    pl_orbsmax: 9.582,
    pl_orbeccen: 0.0047,
    pl_eqt: 75,
    discoverymethod: 'Solar System Moon',
    disc_year: 1789,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Uranus (Sol System)',
    pl_name: 'Uranus (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'uranus',
    x_au: 14.2,
    y_au: 12.1,
    z_au: 5.1,
    dist_km_from_earth: 2820000000,
    pl_rade: 4.007,
    pl_radj: 0.358,
    pl_bmasse: 14.54,
    pl_bmassj: 0.0457,
    pl_orbper: 30688.5,
    pl_orbsmax: 19.191,
    pl_orbeccen: 0.0472,
    pl_eqt: 59,
    discoverymethod: 'Solar System Planet',
    disc_year: 1781,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Titania', radiusRatio: 0.045, orbitRadius: 3.15, speed: 0.78, color: 0xcbd5e1, inclination: 0.45 },
      { name: 'Oberon', radiusRatio: 0.042, orbitRadius: 4.25, speed: 0.52, color: 0x94a3b8, inclination: 0.45 }
    ]
  },
  {
    id: 'Neptune (Sol System)',
    pl_name: 'Neptune (Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'planet',
    solarPreset: 'neptune',
    x_au: 29.8,
    y_au: -1.9,
    z_au: -0.9,
    dist_km_from_earth: 4320000000,
    pl_rade: 3.883,
    pl_radj: 0.346,
    pl_bmasse: 17.15,
    pl_bmassj: 0.054,
    pl_orbper: 60195.0,
    pl_orbsmax: 30.07,
    pl_orbeccen: 0.0086,
    pl_eqt: 47,
    discoverymethod: 'Solar System Planet',
    disc_year: 1846,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Triton', radiusRatio: 0.055, orbitRadius: 3.35, speed: -0.72, color: 0xfce7f3, inclination: 0.35, targetObjectId: 'Triton (Neptune Moon)' }
    ]
  },
  {
    id: 'Triton (Neptune Moon)',
    pl_name: 'Triton (Neptune Moon)',
    hostname: 'Neptune / Sol',
    isSolarSystem: true,
    bodyType: 'moon',
    parentBody: 'Neptune (Sol System)',
    solarPreset: 'triton',
    x_au: 29.803,
    y_au: -1.901,
    z_au: -0.9,
    dist_km_from_earth: 4320355000,
    pl_rade: 0.212,
    pl_radj: 0.0189,
    pl_bmasse: 0.00359,
    pl_bmassj: 0.000011,
    pl_orbper: 5.877,
    pl_orbsmax: 30.07,
    pl_orbeccen: 0.000016,
    pl_eqt: 38,
    discoverymethod: 'Solar System Moon',
    disc_year: 1846,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: []
  },
  {
    id: 'Pluto (Dwarf Planet)',
    pl_name: 'Pluto (Dwarf Planet)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    bodyType: 'dwarf_planet',
    solarPreset: 'pluto',
    x_au: 16.5,
    y_au: -29.2,
    z_au: -11.8,
    dist_km_from_earth: 5180000000,
    pl_rade: 0.186,
    pl_radj: 0.0166,
    pl_bmasse: 0.00218,
    pl_bmassj: 0.000007,
    pl_orbper: 90560.0,
    pl_orbsmax: 39.48,
    pl_orbeccen: 0.2488,
    pl_eqt: 44,
    discoverymethod: 'Solar System Dwarf Planet',
    disc_year: 1930,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    moons: [
      { name: 'Charon', radiusRatio: 0.51, orbitRadius: 3.45, speed: 0.55, color: 0x9ca3af, inclination: 0.18 }
    ]
  }
];

// Accurate Earth Continent Outlines (Lon in [-180, 180], Lat in [-90, 90])
// Aligned with Q1 (0..90E, 0..90N), Q2 (-90..0W, 0..90N), Q3 (-180..-90W, 0..90N),
// Q4 (90..180E, 0..90N), Q5 (0..90E, -90..0S), Q6 (-90..0W, -90..0S),
// Q7 (-180..-90W, -90..0S), Q8 (90..180E, -90..0S)
export const EARTH_CONTINENT_POLYGONS = [
  {
    name: 'North America',
    biome: 'temperate',
    points: [
      [-168, 66], [-162, 71], [-140, 70], [-125, 70], [-110, 73], [-95, 72], [-82, 70],
      [-78, 63], [-64, 60], [-55, 52], [-60, 46], [-67, 45], [-70, 42], [-75, 35],
      [-80, 25], [-82, 29], [-90, 29], [-97, 26], [-96, 19], [-87, 21], [-83, 10],
      [-78, 8], [-84, 9], [-92, 15], [-105, 20], [-110, 24], [-114, 30], [-117, 32],
      [-122, 37], [-124, 48], [-135, 58], [-150, 60], [-162, 55], [-166, 60]
    ]
  },
  {
    name: 'Greenland',
    biome: 'ice',
    points: [
      [-72, 76], [-58, 82], [-30, 83], [-18, 76], [-22, 70], [-36, 65], [-44, 60],
      [-52, 64], [-56, 72]
    ]
  },
  {
    name: 'Caribbean / Cuba',
    biome: 'tropical',
    points: [
      [-85, 22], [-74, 20], [-76, 19], [-84, 21]
    ]
  },
  {
    name: 'South America',
    biome: 'tropical',
    points: [
      [-78, 9], [-72, 12], [-62, 10], [-50, 2], [-35, -6], [-38, -14], [-40, -22],
      [-48, -26], [-54, -34], [-62, -40], [-66, -48], [-68, -55], [-74, -52],
      [-73, -42], [-71, -30], [-70, -18], [-77, -12], [-81, -5], [-79, 2]
    ]
  },
  {
    name: 'Africa',
    biome: 'arid_tropical',
    points: [
      [-17, 15], [-13, 28], [-6, 36], [10, 37], [12, 33], [25, 32], [33, 31],
      [43, 12], [51, 12], [41, -2], [40, -15], [35, -25], [28, -33], [18, -35],
      [15, -23], [12, -12], [9, -2], [9, 4], [2, 6], [-8, 5], [-16, 11]
    ]
  },
  {
    name: 'Madagascar',
    biome: 'tropical',
    points: [
      [49, -12], [50, -18], [47, -25], [44, -25], [44, -17]
    ]
  },
  {
    name: 'Eurasia (Europe & Asia)',
    biome: 'temperate',
    points: [
      [-9, 37], [-9, 43], [-2, 43], [-4, 48], [2, 51], [8, 54], [8, 58], [5, 62],
      [16, 69], [28, 71], [32, 69], [22, 60], [14, 54], [20, 55], [28, 60],
      [42, 68], [60, 70], [75, 73], [105, 77], [140, 73], [178, 66], [160, 52],
      [142, 54], [135, 44], [129, 35], [126, 38], [120, 40], [122, 31], [114, 22],
      [108, 21], [109, 12], [104, 1], [100, 13], [96, 16], [90, 22], [80, 14],
      [77, 8], [72, 19], [67, 24], [56, 26], [50, 29], [59, 22], [44, 13],
      [35, 29], [36, 36], [26, 37], [26, 41], [23, 37], [19, 41], [13, 45],
      [16, 38], [12, 42], [9, 44], [3, 43], [0, 39], [-5, 36]
    ]
  },
  {
    name: 'Great Britain & Ireland',
    biome: 'temperate',
    points: [
      [-6, 50], [2, 51], [-2, 58], [-6, 58], [-10, 52]
    ]
  },
  {
    name: 'Japan',
    biome: 'temperate',
    points: [
      [130, 31], [136, 34], [141, 38], [145, 44], [140, 43], [137, 37], [131, 34]
    ]
  },
  {
    name: 'Sumatra, Java & Borneo',
    biome: 'tropical',
    points: [
      [96, 5], [106, -6], [115, -8], [118, 4], [110, 2], [103, 1]
    ]
  },
  {
    name: 'New Guinea & Philippines',
    biome: 'tropical',
    points: [
      [121, 18], [126, 7], [132, -2], [148, -6], [150, -10], [138, -8], [130, -4], [120, 12]
    ]
  },
  {
    name: 'Australia',
    biome: 'arid_tropical',
    points: [
      [114, -22], [122, -17], [131, -12], [136, -12], [137, -16], [142, -11],
      [146, -18], [153, -26], [150, -37], [140, -38], [135, -34], [129, -32],
      [118, -35], [115, -34]
    ]
  },
  {
    name: 'New Zealand',
    biome: 'temperate',
    points: [
      [173, -35], [178, -38], [174, -42], [167, -46], [171, -41]
    ]
  },
  {
    name: 'Antarctica',
    biome: 'ice',
    points: [
      [-180, -89], [-180, -72], [-120, -73], [-60, -64], [-55, -74], [0, -70],
      [45, -67], [90, -66], [140, -66], [175, -72], [180, -72], [180, -89]
    ]
  }
];

export const NAMED_STARS = {
  "SUN": "Sol (Our Sun)",
  "32349": "Sirius (α CMa)",
  "30438": "Canopus (α Car)",
  "71683": "Rigil Kentaurus (α Cen A)",
  "71681": "Toliman (α Cen B)",
  "70890": "Proxima Centauri",
  "69673": "Arcturus (α Boo)",
  "91262": "Vega (α Lyr)",
  "24608": "Capella (α Aur)",
  "24436": "Rigel (β Ori)",
  "37279": "Procyon (α CMi)",
  "7588": "Achernar (α Eri)",
  "27989": "Betelgeuse (α Ori)",
  "68702": "Hadar (β Cen)",
  "97649": "Altair (α Aql)",
  "60718": "Acrux (α Cru)",
  "21421": "Aldebaran (α Tau)",
  "80763": "Antares (α Sco)",
  "65474": "Spica (α Vir)",
  "37826": "Pollux (β Gem)",
  "113368": "Fomalhaut (α PsA)",
  "102098": "Deneb (α Cyg)",
  "62434": "Mimosa (β Cru)",
  "49669": "Regulus (α Leo)",
  "33579": "Adhara (ε CMa)",
  "36850": "Castor (α Gem)",
  "61084": "Gacrux (γ Cru)",
  "85927": "Shaula (λ Sco)",
  "25336": "Bellatrix (γ Ori)",
  "25428": "Elnath (β Tau)",
  "45238": "Miaplacidus (β Car)",
  "26311": "Alnilam (ε Ori)",
  "26727": "Alnitak (ζ Ori)",
  "25930": "Mintaka (δ Ori)",
  "27366": "Saiph (κ Ori)",
  "109268": "Alnair (α Gru)",
  "62956": "Alioth (ε UMa)",
  "54061": "Dubhe (α UMa)",
  "53910": "Merak (β UMa)",
  "58001": "Phecda (γ UMa)",
  "59774": "Megrez (δ UMa)",
  "65378": "Mizar (ζ UMa)",
  "67301": "Alkaid (η UMa)",
  "11767": "Polaris (α UMi)",
  "72607": "Kochab (β UMi)",
  "75097": "Pherkad (γ UMi)",
  "3179": "Schedar (α Cas)",
  "746": "Caph (β Cas)",
  "4427": "Navi (γ Cas)",
  "6686": "Ruchbah (δ Cas)",
  "8886": "Segin (ε Cas)",
  "15863": "Mirfak (α Per)",
  "14576": "Algol (β Per)",
  "9884": "Hamal (α Ari)",
  "677": "Alpheratz (α And)",
  "5447": "Mirach (β And)",
  "9640": "Almach (γ And)",
  "113963": "Markab (α Peg)",
  "113881": "Scheat (β Peg)",
  "1067": "Algenib (γ Peg)",
  "107315": "Enif (ε Peg)",
  "95947": "Albireo (β Cyg)",
  "100453": "Sadr (γ Cyg)",
  "97278": "Fawaris (δ Cyg)",
  "102488": "Aljanah (ε Cyg)",
  "87833": "Eltanin (γ Dra)",
  "3419": "Diphda (β Cet)",
  "90185": "Kaus Australis (ε Sgr)",
  "92855": "Nunki (σ Sgr)",
  "76267": "Alphecca (α CrB)",
  "86032": "Rasalhague (α Oph)",
  "57632": "Denebola (β Leo)",
  "50583": "Algieba (γ Leo)",
  "41037": "Avior (ε Car)",
  "45556": "Aspidiske (ι Car)",
  "34444": "Wezen (δ CMa)",
  "30324": "Mirzam (β CMa)",
  "35904": "Aludra (η CMa)"
};

export const IAU_CONSTELLATIONS = [
  {
    name: "Ursa Major",
    abbr: "UMa",
    lines: [
      ["54061", "53910"], ["53910", "58001"], ["58001", "59774"],
      ["59774", "54061"], ["59774", "62956"], ["62956", "65378"],
      ["65378", "67301"]
    ]
  },
  {
    name: "Ursa Minor",
    abbr: "UMi",
    lines: [
      ["11767", "85822"], ["85822", "82080"], ["82080", "77055"],
      ["77055", "72607"], ["72607", "75097"], ["75097", "79822"],
      ["79822", "77055"]
    ]
  },
  {
    name: "Cassiopeia",
    abbr: "Cas",
    lines: [
      ["746", "3179"], ["3179", "4427"], ["4427", "6686"], ["6686", "8886"]
    ]
  },
  {
    name: "Orion",
    abbr: "Ori",
    lines: [
      ["27989", "25336"], ["25336", "25930"], ["25930", "26311"],
      ["26311", "26727"], ["26727", "27989"], ["25930", "24436"],
      ["24436", "27366"], ["27366", "26727"]
    ]
  },
  {
    name: "Cygnus",
    abbr: "Cyg",
    lines: [
      ["102098", "100453"], ["100453", "95947"],
      ["97278", "100453"], ["100453", "102488"]
    ]
  },
  {
    name: "Lyra",
    abbr: "Lyr",
    lines: [
      ["91262", "91971"], ["91971", "92791"], ["92791", "93194"],
      ["93194", "92420"], ["92420", "91971"]
    ]
  },
  {
    name: "Aquila",
    abbr: "Aql",
    lines: [
      ["97649", "97278"], ["97649", "98036"], ["97649", "95501"],
      ["95501", "93747"], ["95501", "99473"]
    ]
  },
  {
    name: "Taurus",
    abbr: "Tau",
    lines: [
      ["21421", "20889"], ["20889", "20205"], ["20205", "20455"],
      ["20455", "21421"], ["21421", "26451"], ["20455", "25428"]
    ]
  },
  {
    name: "Gemini",
    abbr: "Gem",
    lines: [
      ["36850", "37826"], ["36850", "32246"], ["32246", "30343"],
      ["37826", "35550"], ["35550", "31681"]
    ]
  },
  {
    name: "Auriga",
    abbr: "Aur",
    lines: [
      ["24608", "28360"], ["28360", "28380"], ["28380", "25428"],
      ["25428", "23015"], ["23015", "24608"]
    ]
  },
  {
    name: "Leo",
    abbr: "Leo",
    lines: [
      ["49669", "49583"], ["49583", "50583"], ["50583", "50335"],
      ["50335", "47908"], ["49669", "54872"], ["54872", "57632"],
      ["57632", "50583"]
    ]
  },
  {
    name: "Virgo",
    abbr: "Vir",
    lines: [
      ["65474", "61941"], ["61941", "63608"], ["61941", "60129"],
      ["60129", "57757"], ["65474", "66249"], ["66249", "69701"]
    ]
  },
  {
    name: "Bootes",
    abbr: "Boo",
    lines: [
      ["69673", "72105"], ["72105", "74666"], ["74666", "71075"],
      ["71075", "69713"], ["69713", "69673"]
    ]
  },
  {
    name: "Scorpius",
    abbr: "Sco",
    lines: [
      ["78820", "80763"], ["78401", "80763"], ["78265", "80763"],
      ["80763", "81266"], ["81266", "82396"], ["82396", "82514"],
      ["82514", "84143"], ["84143", "86228"], ["86228", "86670"],
      ["86670", "85927"]
    ]
  },
  {
    name: "Sagittarius",
    abbr: "Sgr",
    lines: [
      ["90185", "89931"], ["89931", "88635"], ["88635", "90185"],
      ["89931", "90496"], ["90496", "92855"], ["92855", "93506"],
      ["93506", "90185"]
    ]
  },
  {
    name: "Crux",
    abbr: "Cru",
    lines: [
      ["60718", "61084"], ["62434", "59747"]
    ]
  },
  {
    name: "Centaurus",
    abbr: "Cen",
    lines: [
      ["71683", "68702"], ["68702", "66657"], ["66657", "68933"],
      ["68933", "71352"], ["66657", "61932"]
    ]
  },
  {
    name: "Carina",
    abbr: "Car",
    lines: [
      ["30438", "41037"], ["41037", "45556"], ["45556", "50099"],
      ["50099", "45238"]
    ]
  },
  {
    name: "Canis Major",
    abbr: "CMa",
    lines: [
      ["32349", "30324"], ["32349", "34444"], ["34444", "33579"],
      ["34444", "35904"]
    ]
  },
  {
    name: "Canis Minor",
    abbr: "CMi",
    lines: [
      ["37279", "36188"]
    ]
  },
  {
    name: "Pegasus",
    abbr: "Peg",
    lines: [
      ["677", "113881"], ["113881", "113963"], ["113963", "1067"],
      ["1067", "677"], ["113963", "112158"], ["112158", "107315"]
    ]
  },
  {
    name: "Andromeda",
    abbr: "And",
    lines: [
      ["677", "2912"], ["2912", "5447"], ["5447", "9640"]
    ]
  },
  {
    name: "Perseus",
    abbr: "Per",
    lines: [
      ["15863", "13268"], ["15863", "14576"], ["15863", "17358"],
      ["17358", "18532"]
    ]
  }
];

// Curated Deep-Sky & Exotic Cosmic Objects (Black Holes, Galaxies, Nebulae, Pulsars & Clusters)
export const DEEP_SKY_OBJECTS = [
  // --- BLACK HOLES ---
  {
    id: 'Sagittarius A* (Milky Way SMBH)',
    pl_name: 'Sagittarius A* (Milky Way SMBH)',
    hostname: 'Galactic Center (Sgr A*)',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: false,
    ra: 266.4168,
    dec: -29.0078,
    distance: 26670,
    dist_pc: 8178,
    vmag: 14.5,
    pl_rade: 1880,
    pl_radj: 167.7,
    pl_bmasse: 1.38e12,
    pl_orbper: 5840,
    pl_orbsmax: 120,
    pl_eqt: 100000,
    discoverymethod: 'Radio Interferometry / EHT',
    disc_year: 1974,
    st_spectype: 'Supermassive Black Hole (4.15M M☉)',
    st_teff: 28000,
    st_rad: 17.0,
    st_mass: 4154000,
    description: 'Supermassive black hole (4.15 million M☉) at the center of our Milky Way Galaxy in Sagittarius, orbited by high-velocity S-stars (S2, S62).',
    moons: [
      { name: 'Star S62 (Pericenter 16 AU)', radiusRatio: 0.12, orbitRadius: 2.3, speed: 1.5, color: 0x93c5fd, inclination: 0.35 },
      { name: 'Star S2 (16-yr Orbit)', radiusRatio: 0.16, orbitRadius: 3.1, speed: 0.9, color: 0x60a5fa, inclination: -0.28 }
    ]
  },
  {
    id: 'M87* / Powehi (Virgo Supermassive BH)',
    pl_name: 'M87* / Powehi (Virgo Supermassive BH)',
    hostname: 'Messier 87 Core',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: true,
    ra: 187.7059,
    dec: 12.3911,
    distance: 53490000,
    dist_pc: 16400000,
    vmag: 8.6,
    pl_rade: 2950000,
    pl_radj: 263000,
    pl_bmasse: 2.16e15,
    pl_orbper: 36500,
    pl_orbsmax: 500,
    pl_eqt: 150000,
    discoverymethod: 'Event Horizon Telescope (EHT)',
    disc_year: 2019,
    st_spectype: 'Supermassive Black Hole (6.5B M☉)',
    st_teff: 32000,
    st_rad: 120.0,
    st_mass: 6500000000,
    description: 'First black hole ever directly imaged (6.5 billion M☉), powering a 5,000-light-year relativistic plasma jet from the heart of galaxy M87.',
    moons: []
  },
  {
    id: 'Cygnus X-1 (Stellar Black Hole Binary)',
    pl_name: 'Cygnus X-1 (Stellar Black Hole Binary)',
    hostname: 'Cygnus X-1 / HDE 226868',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: true,
    ra: 299.5903,
    dec: 35.2016,
    distance: 7200,
    dist_pc: 2208,
    vmag: 8.95,
    pl_rade: 0.01,
    pl_radj: 0.001,
    pl_bmasse: 7050000,
    pl_orbper: 5.5998,
    pl_orbsmax: 0.24,
    pl_eqt: 31000,
    discoverymethod: 'X-Ray Astronomy (Uhuru)',
    disc_year: 1964,
    st_spectype: 'O9.7 Iab + Black Hole (21.2 M☉)',
    st_teff: 31000,
    st_rad: 22.0,
    st_mass: 21.2,
    description: 'Iconic stellar-mass black hole (21.2 M☉) accreting stellar wind from blue supergiant companion HDE 226868 every 5.6 days.',
    moons: [
      { name: 'HDE 226868 (O9.7 Blue Supergiant)', radiusRatio: 0.34, orbitRadius: 2.75, speed: 1.1, color: 0x93c5fd, inclination: 0.08 }
    ]
  },
  {
    id: 'Gaia BH1 (Closest Known Black Hole)',
    pl_name: 'Gaia BH1 (Closest Known Black Hole)',
    hostname: 'Gaia BH1 System',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: false,
    ra: 262.1712,
    dec: -0.5811,
    distance: 1560,
    dist_pc: 478,
    vmag: 13.8,
    pl_rade: 0.005,
    pl_radj: 0.0004,
    pl_bmasse: 3190000,
    pl_orbper: 185.59,
    pl_orbsmax: 1.4,
    pl_eqt: 5850,
    discoverymethod: 'Gaia Astrometry',
    disc_year: 2022,
    st_spectype: 'G2 V + Dormant Black Hole (9.6 M☉)',
    st_teff: 5850,
    st_rad: 0.99,
    st_mass: 9.62,
    description: 'Closest known black hole to Earth (1,560 ly in Ophiuchus), a 9.6 M☉ dormant black hole orbited by a Sun-like G-dwarf star at 1.4 AU.',
    moons: [
      { name: 'Gaia BH1 G-Dwarf Star (1.4 AU)', radiusRatio: 0.25, orbitRadius: 2.6, speed: 0.8, color: 0xfff1df, inclination: 0.1 }
    ]
  },
  {
    id: 'V616 Monocerotis (A0620-00 Black Hole)',
    pl_name: 'V616 Monocerotis (A0620-00 Black Hole)',
    hostname: 'A0620-00 Binary',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: true,
    ra: 95.685,
    dec: -0.345,
    distance: 3300,
    dist_pc: 1012,
    vmag: 11.2,
    pl_rade: 0.004,
    pl_radj: 0.0003,
    pl_bmasse: 2200000,
    pl_orbper: 0.323,
    pl_orbsmax: 0.02,
    pl_eqt: 4000,
    discoverymethod: 'X-Ray Nova (Ariel V)',
    disc_year: 1975,
    st_spectype: 'K5 V + Black Hole (6.6 M☉)',
    st_teff: 4400,
    st_rad: 0.67,
    st_mass: 6.6,
    description: 'Compact X-ray binary black hole (6.6 M☉) in Monoceros stripping gas from an orange K-dwarf star in a 7.75-hour orbit.',
    moons: [
      { name: 'K5 V Companion Star', radiusRatio: 0.22, orbitRadius: 2.4, speed: 1.6, color: 0xfdba74, inclination: 0.05 }
    ]
  },
  {
    id: 'TON 618 (Ultramassive Quasar BH)',
    pl_name: 'TON 618 (Ultramassive Quasar BH)',
    hostname: 'TON 618 Quasar Core',
    isDeepSky: true,
    deepSkyType: 'black_hole',
    hasJets: true,
    ra: 187.104,
    dec: 31.477,
    distance: 10800000000,
    dist_pc: 3310000000,
    vmag: 15.9,
    pl_rade: 30000000,
    pl_radj: 2670000,
    pl_bmasse: 2.2e16,
    pl_orbper: 100000,
    pl_orbsmax: 2600,
    pl_eqt: 200000,
    discoverymethod: 'Spectroscopy / Radio Survey',
    disc_year: 1957,
    st_spectype: 'Hyperluminous Quasar BH (66B M☉)',
    st_teff: 35000,
    st_rad: 500.0,
    st_mass: 66000000000,
    description: 'One of the most massive black holes known (66 billion M☉), shining with the luminosity of 140 trillion Suns from an extreme accretion disk.',
    moons: []
  },

  // --- GALAXIES ---
  {
    id: 'Andromeda Galaxy (M31 / NGC 224)',
    pl_name: 'Andromeda Galaxy (M31 / NGC 224)',
    hostname: 'Andromeda Core (M31)',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 10.6847,
    dec: 41.2687,
    distance: 2537000,
    dist_pc: 778000,
    vmag: 3.44,
    pl_rade: 150000,
    pl_radj: 13380,
    pl_bmasse: 1e18,
    pl_orbper: 250000000,
    pl_orbsmax: 152000,
    pl_eqt: 5000,
    discoverymethod: 'Naked-Eye Astronomy (Al-Sufi)',
    disc_year: 964,
    st_spectype: 'SA(s)b Spiral Galaxy (1 Trillion Stars)',
    st_teff: 5500,
    st_rad: 100,
    st_mass: 1500000000000,
    description: 'Nearest major spiral galaxy to the Milky Way (2.54 million ly, diameter 152,000 ly), visible to the naked eye in Andromeda with satellite galaxies M32 & M110.',
    moons: [
      { name: 'M32 (Satellite Dwarf Galaxy)', radiusRatio: 0.14, orbitRadius: 2.5, speed: 0.4, color: 0xfef08a, inclination: 0.25 },
      { name: 'M110 (Satellite Elliptical Galaxy)', radiusRatio: 0.16, orbitRadius: 3.2, speed: 0.28, color: 0xfde68a, inclination: -0.35 }
    ]
  },
  {
    id: 'Triangulum Galaxy (M33 / NGC 598)',
    pl_name: 'Triangulum Galaxy (M33 / NGC 598)',
    hostname: 'Triangulum Core (M33)',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 23.4621,
    dec: 30.6599,
    distance: 2730000,
    dist_pc: 837000,
    vmag: 5.72,
    pl_rade: 61000,
    pl_radj: 5440,
    pl_bmasse: 5e16,
    pl_orbper: 200000000,
    pl_orbsmax: 61000,
    pl_eqt: 6500,
    discoverymethod: 'Telescopic Observation (Hodierna)',
    disc_year: 1654,
    st_spectype: 'SA(s)cd Spiral Galaxy (40B Stars)',
    st_teff: 6500,
    st_rad: 60,
    st_mass: 50000000000,
    description: 'Third-largest member of the Local Group (2.73 million ly), an unbarred spiral galaxy rich in H-II star-forming nebulae like NGC 604.',
    moons: []
  },
  {
    id: 'Large Magellanic Cloud (LMC)',
    pl_name: 'Large Magellanic Cloud (LMC)',
    hostname: 'LMC Bar Core',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 80.8942,
    dec: -69.7561,
    distance: 163000,
    dist_pc: 49970,
    vmag: 0.9,
    pl_rade: 32200,
    pl_radj: 2870,
    pl_bmasse: 1e16,
    pl_orbper: 150000000,
    pl_orbsmax: 32200,
    pl_eqt: 7200,
    discoverymethod: 'Naked-Eye Southern Sky',
    disc_year: 'Prehistoric',
    st_spectype: 'SB(s)m Satellite Galaxy (20B Stars)',
    st_teff: 7200,
    st_rad: 40,
    st_mass: 10000000000,
    description: 'Brightest satellite galaxy of the Milky Way (163,000 ly in Dorado/Mensa), home to the giant Tarantula Nebula (30 Doradus) and SN 1987A.',
    moons: []
  },
  {
    id: 'Small Magellanic Cloud (SMC / NGC 292)',
    pl_name: 'Small Magellanic Cloud (SMC / NGC 292)',
    hostname: 'SMC Core',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 13.1583,
    dec: -72.8003,
    distance: 203700,
    dist_pc: 62450,
    vmag: 2.7,
    pl_rade: 18900,
    pl_radj: 1680,
    pl_bmasse: 7e15,
    pl_orbper: 150000000,
    pl_orbsmax: 18900,
    pl_eqt: 6800,
    discoverymethod: 'Naked-Eye Southern Sky',
    disc_year: 'Prehistoric',
    st_spectype: 'SB(s)m Dwarf Irregular Galaxy',
    st_teff: 6800,
    st_rad: 30,
    st_mass: 7000000000,
    description: 'Dwarf irregular galaxy (203,700 ly in Tucana) gravitationally interacting with the Large Magellanic Cloud and the Milky Way.',
    moons: []
  },
  {
    id: 'Whirlpool Galaxy (M51 / NGC 5194)',
    pl_name: 'Whirlpool Galaxy (M51 / NGC 5194)',
    hostname: 'M51 Galactic Nucleus',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 202.4696,
    dec: 47.1952,
    distance: 31000000,
    dist_pc: 9500000,
    vmag: 8.4,
    pl_rade: 76900,
    pl_radj: 6860,
    pl_bmasse: 1.6e17,
    pl_orbper: 220000000,
    pl_orbsmax: 76900,
    pl_eqt: 7500,
    discoverymethod: 'Charles Messier',
    disc_year: 1773,
    st_spectype: 'SA(s)bc Grand-Design Spiral Galaxy',
    st_teff: 7500,
    st_rad: 85,
    st_mass: 160000000000,
    description: 'Classic grand-design spiral galaxy (31 million ly in Canes Venatici) with prominent star-forming arms tidally interacting with companion galaxy NGC 5195.',
    moons: [
      { name: 'NGC 5195 (Interacting Companion Galaxy)', radiusRatio: 0.24, orbitRadius: 2.65, speed: 0.35, color: 0xfde047, inclination: 0.15 }
    ]
  },
  {
    id: 'Sombrero Galaxy (M104 / NGC 4594)',
    pl_name: 'Sombrero Galaxy (M104 / NGC 4594)',
    hostname: 'M104 Core (1B M☉ SMBH)',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 189.9976,
    dec: -11.6231,
    distance: 31100000,
    dist_pc: 9550000,
    vmag: 8.0,
    pl_rade: 49000,
    pl_radj: 4370,
    pl_bmasse: 8e17,
    pl_orbper: 240000000,
    pl_orbsmax: 49000,
    pl_eqt: 5200,
    discoverymethod: 'Pierre Méchain',
    disc_year: 1781,
    st_spectype: 'SA(s)a Spiral / Lenticular Galaxy',
    st_teff: 5200,
    st_rad: 90,
    st_mass: 800000000000,
    description: 'Luminous galaxy in Virgo (31.1 million ly) featuring a brilliant central bulge, a 1-billion-M☉ black hole, and a dark symmetric dust ring.',
    moons: []
  },
  {
    id: 'Centaurus A (NGC 5128 Active Radio Galaxy)',
    pl_name: 'Centaurus A (NGC 5128 Active Radio Galaxy)',
    hostname: 'Centaurus A AGN Core',
    isDeepSky: true,
    deepSkyType: 'galaxy',
    ra: 201.3651,
    dec: -43.0191,
    distance: 13050000,
    dist_pc: 4000000,
    vmag: 6.84,
    pl_rade: 60000,
    pl_radj: 5350,
    pl_bmasse: 1e18,
    pl_orbper: 200000000,
    pl_orbsmax: 60000,
    pl_eqt: 6000,
    discoverymethod: 'James Dunlop',
    disc_year: 1826,
    st_spectype: 'S0 Peculiar / Active Galactic Nucleus',
    st_teff: 6000,
    st_rad: 95,
    st_mass: 1000000000000,
    description: 'Closest active radio galaxy to Earth (13 million ly in Centaurus), warped by a spiral-elliptical merger around a 55-million-M☉ black hole.',
    moons: []
  },

  // --- NEBULAE, PULSARS & STAR CLUSTERS ---
  {
    id: 'Orion Nebula (M42 / NGC 1976)',
    pl_name: 'Orion Nebula (M42 / NGC 1976)',
    hostname: 'Trapezium Cluster (θ¹ Ori)',
    isDeepSky: true,
    deepSkyType: 'nebula',
    ra: 83.8221,
    dec: -5.3911,
    distance: 1344,
    dist_pc: 412,
    vmag: 4.0,
    pl_rade: 24,
    pl_radj: 2.1,
    pl_bmasse: 6.6e8,
    pl_orbper: 10000,
    pl_orbsmax: 24,
    pl_eqt: 10000,
    discoverymethod: 'Naked-Eye / Peiresc',
    disc_year: 1610,
    st_spectype: 'O6 V Emission Nebula & Stellar Nursery',
    st_teff: 39000,
    st_rad: 20,
    st_mass: 2000,
    description: 'Closest massive star-forming H-II region to Earth (1,344 ly in Orion\'s Sword, 24 ly across), illuminated by the hot young Trapezium O-stars.',
    moons: []
  },
  {
    id: 'Crab Nebula & Pulsar (M1 / PSR B0531+21)',
    pl_name: 'Crab Nebula & Pulsar (M1 / PSR B0531+21)',
    hostname: 'Crab Pulsar (PSR B0531+21)',
    isDeepSky: true,
    deepSkyType: 'pulsar',
    ra: 83.6331,
    dec: 22.0145,
    distance: 6500,
    dist_pc: 1993,
    vmag: 8.4,
    pl_rade: 11,
    pl_radj: 1.0,
    pl_bmasse: 1.5e6,
    pl_orbper: 0.00000038,
    pl_orbsmax: 5.5,
    pl_eqt: 1600000,
    discoverymethod: 'SN 1054 Supernova / John Bevis',
    disc_year: 1054,
    st_spectype: 'Magnetized Neutron Star Pulsar (30.2 Hz)',
    st_teff: 30000,
    st_rad: 1.4,
    st_mass: 1.4,
    description: 'Expanding supernova remnant from AD 1054 in Taurus powered by a central neutron star spinning 30.2 times per second with twin synchrotron beams.',
    moons: []
  },
  {
    id: 'Carina Nebula (NGC 3372 / Eta Carinae)',
    pl_name: 'Carina Nebula (NGC 3372 / Eta Carinae)',
    hostname: 'Eta Carinae (LBV Binary)',
    isDeepSky: true,
    deepSkyType: 'nebula',
    ra: 161.265,
    dec: -59.867,
    distance: 8500,
    dist_pc: 2606,
    vmag: 1.0,
    pl_rade: 300,
    pl_radj: 26.8,
    pl_bmasse: 3e10,
    pl_orbper: 2022.7,
    pl_orbsmax: 15.4,
    pl_eqt: 37200,
    discoverymethod: 'Nicolas-Louis de Lacaille',
    disc_year: 1752,
    st_spectype: 'Luminous Blue Variable + H-II Nebula',
    st_teff: 37200,
    st_rad: 240,
    st_mass: 120,
    description: 'Giant southern star-forming nebula (8,500 ly, 300 ly wide) housing hypergiant Eta Carinae and the Mystic Mountain pillars.',
    moons: []
  },
  {
    id: 'Lagoon Nebula (M8 / NGC 6523)',
    pl_name: 'Lagoon Nebula (M8 / NGC 6523)',
    hostname: 'NGC 6530 Open Cluster',
    isDeepSky: true,
    deepSkyType: 'nebula',
    ra: 270.92,
    dec: -24.38,
    distance: 4100,
    dist_pc: 1257,
    vmag: 6.0,
    pl_rade: 55,
    pl_radj: 4.9,
    pl_bmasse: 1e9,
    pl_orbper: 10000,
    pl_orbsmax: 55,
    pl_eqt: 35000,
    discoverymethod: 'Giovanni Battista Hodierna',
    disc_year: 1654,
    st_spectype: 'O4 V Giant Interstellar H-II Cloud',
    st_teff: 35000,
    st_rad: 18,
    st_mass: 4000,
    description: 'Luminous emission nebula (4,100 ly in Sagittarius) containing Bok globules and the Hourglass Nebula ionized by young O-stars.',
    moons: []
  },
  {
    id: 'Ring Nebula (M57 / NGC 6720)',
    pl_name: 'Ring Nebula (M57 / NGC 6720)',
    hostname: 'M57 Central White Dwarf',
    isDeepSky: true,
    deepSkyType: 'nebula',
    ra: 283.396,
    dec: 33.029,
    distance: 2570,
    dist_pc: 788,
    vmag: 8.8,
    pl_rade: 2.6,
    pl_radj: 0.23,
    pl_bmasse: 200000,
    pl_orbper: 5000,
    pl_orbsmax: 1.3,
    pl_eqt: 120000,
    discoverymethod: 'Charles Messier / Darquier',
    disc_year: 1779,
    st_spectype: 'DAO White Dwarf + Planetary Nebula',
    st_teff: 25000,
    st_rad: 0.015,
    st_mass: 0.62,
    description: 'Bipolar planetary nebula in Lyra (2,570 ly) formed by a dying sun-like star ejecting glowing shells of ionized oxygen, nitrogen, and hydrogen.',
    moons: []
  },
  {
    id: 'Pleiades Star Cluster (M45 / Seven Sisters)',
    pl_name: 'Pleiades Star Cluster (M45 / Seven Sisters)',
    hostname: 'Alcyone (η Tauri)',
    isDeepSky: true,
    deepSkyType: 'cluster',
    ra: 56.75,
    dec: 24.1167,
    distance: 444,
    dist_pc: 136.2,
    vmag: 1.6,
    pl_rade: 17.5,
    pl_radj: 1.56,
    pl_bmasse: 2.6e8,
    pl_orbper: 10000,
    pl_orbsmax: 8.0,
    pl_eqt: 13000,
    discoverymethod: 'Naked-Eye Open Cluster',
    disc_year: 'Prehistoric',
    st_spectype: 'B7 III Open Cluster (~1,000 Stars)',
    st_teff: 13000,
    st_rad: 8.2,
    st_mass: 800,
    description: 'Iconic open star cluster in Taurus (444 ly) dominated by hot blue B-type stars (Alcyone, Atlas, Electra, Maia, Merope, Taygeta, Pleione) in reflection nebulosity.',
    moons: []
  },
  {
    id: 'Omega Centauri (NGC 5139 Globular Cluster)',
    pl_name: 'Omega Centauri (NGC 5139 Globular Cluster)',
    hostname: 'Omega Centauri Core',
    isDeepSky: true,
    deepSkyType: 'cluster',
    ra: 201.697,
    dec: -47.48,
    distance: 17090,
    dist_pc: 5240,
    vmag: 3.9,
    pl_rade: 150,
    pl_radj: 13.4,
    pl_bmasse: 1.3e12,
    pl_orbper: 50000,
    pl_orbsmax: 86,
    pl_eqt: 5200,
    discoverymethod: 'Naked-Eye / Edmond Halley',
    disc_year: 1677,
    st_spectype: 'Globular Star Cluster (10M Stars)',
    st_teff: 5200,
    st_rad: 50,
    st_mass: 4000000,
    description: 'Largest and most massive globular cluster in the Milky Way (17,090 ly, 10 million stars, 4 million M☉), the stripped core of an ancient dwarf galaxy.',
    moons: []
  },
  {
    id: 'Vela Pulsar (PSR B0833-45)',
    pl_name: 'Vela Pulsar (PSR B0833-45)',
    hostname: 'Vela Supernova Remnant',
    isDeepSky: true,
    deepSkyType: 'pulsar',
    ra: 128.836,
    dec: -45.176,
    distance: 936,
    dist_pc: 287,
    vmag: 23.6,
    pl_rade: 0.002,
    pl_radj: 0.0002,
    pl_bmasse: 450000,
    pl_orbper: 0.000001,
    pl_orbsmax: 1.0,
    pl_eqt: 680000,
    discoverymethod: 'Radio / X-Ray Astronomy',
    disc_year: 1968,
    st_spectype: 'Magnetized Neutron Star Pulsar (11.2 Hz)',
    st_teff: 28000,
    st_rad: 1.35,
    st_mass: 1.35,
    description: 'Nearby young magnetized neutron star (936 ly in Vela) spinning 11.2 times per second inside a pulsar-wind nebula.',
    moons: []
  }
];

// Popular Sci-Fi Media & Iconic Real Star Systems (Project Hail Mary, Star Trek, Avatar, Three-Body Problem, Dune, Interstellar, The Expanse, Alien, Halo, Star Wars)
export const POPULAR_MEDIA_SYSTEMS = [
  // --- PROJECT HAIL MARY (Andy Weir) ---
  {
    id: 'Tau Ceti e — "Adrian" (Project Hail Mary)',
    pl_name: 'Tau Ceti e — "Adrian" (Project Hail Mary)',
    hostname: 'Tau Ceti',
    isPopularMedia: true,
    mediaFranchise: 'Project Hail Mary (Andy Weir)',
    mediaPreset: 'adrian_tau_ceti',
    bodyType: 'planet',
    ra: 26.017,
    dec: -15.9375,
    distance: 11.91,
    dist_pc: 3.65,
    vmag: 3.5,
    pl_rade: 1.81,
    pl_radj: 0.161,
    pl_bmasse: 3.93,
    pl_bmassj: 0.0124,
    pl_orbper: 162.87,
    pl_orbsmax: 0.538,
    pl_orbeccen: 0.18,
    pl_eqt: 310,
    discoverymethod: 'Radial Velocity / Project Hail Mary',
    disc_year: 2012,
    st_spectype: 'G8 V (Solar-Analog Dwarf)',
    st_teff: 5344,
    st_rad: 0.793,
    st_mass: 0.783,
    description: 'Super-Earth orbiting real star Tau Ceti (11.9 ly in Cetus). In Project Hail Mary, named "Adrian" by Ryland Grace and Rocky—where Astrophage migrates along the glowing Petrova Line and nitrogen-resistant Taumoeba is bred in the upper atmosphere.',
    moons: [
      { name: 'Hail Mary (Spin-Drive Ship)', radiusRatio: 0.06, orbitRadius: 1.85, speed: 1.4, color: 0x38bdf8, inclination: 0.12 },
      { name: 'Blip-A (Xenonite Vessel)', radiusRatio: 0.08, orbitRadius: 2.15, speed: 1.15, color: 0xfbbf24, inclination: -0.15 }
    ]
  },
  {
    id: '40 Eridani A b — "Erid" (Project Hail Mary)',
    pl_name: '40 Eridani A b — "Erid" (Project Hail Mary)',
    hostname: '40 Eridani A (HD 26965)',
    isPopularMedia: true,
    mediaFranchise: 'Project Hail Mary (Andy Weir)',
    mediaPreset: 'erid_40_eridani',
    bodyType: 'planet',
    ra: 63.818,
    dec: -7.6529,
    distance: 16.34,
    dist_pc: 5.01,
    vmag: 4.43,
    pl_rade: 1.98,
    pl_radj: 0.177,
    pl_bmasse: 8.47,
    pl_bmassj: 0.0266,
    pl_orbper: 42.38,
    pl_orbsmax: 0.21,
    pl_orbeccen: 0.04,
    pl_eqt: 483,
    discoverymethod: 'Dharma Planet Survey / Project Hail Mary',
    disc_year: 2018,
    st_spectype: 'K1 V (Orange Main-Sequence Dwarf)',
    st_teff: 5126,
    st_rad: 0.81,
    st_mass: 0.78,
    description: 'High-gravity super-Earth (2.09 g) orbiting real orange dwarf 40 Eridani A (HD 26965, 16.3 ly). Homeworld of Rocky and the Eridanians in Project Hail Mary, shrouded in a crushing 29-atm pitch-black ammonia atmosphere with a space elevator tower.',
    moons: [
      { name: 'Erid Space Elevator Orbital Hub', radiusRatio: 0.07, orbitRadius: 1.9, speed: 1.2, color: 0xf59e0b, inclination: 0.0 }
    ]
  },

  // --- STAR TREK ---
  {
    id: 'Vulcan (Ni\'Var) — 40 Eridani A (Star Trek)',
    pl_name: 'Vulcan (Ni\'Var) — 40 Eridani A (Star Trek)',
    hostname: '40 Eridani A (HD 26965)',
    isPopularMedia: true,
    mediaFranchise: 'Star Trek',
    mediaPreset: 'vulcan',
    bodyType: 'planet',
    ra: 63.818,
    dec: -7.6529,
    distance: 16.34,
    dist_pc: 5.01,
    vmag: 4.43,
    pl_rade: 1.45,
    pl_radj: 0.129,
    pl_bmasse: 2.8,
    pl_bmassj: 0.0088,
    pl_orbper: 135.0,
    pl_orbsmax: 0.48,
    pl_orbeccen: 0.03,
    pl_eqt: 318,
    discoverymethod: 'Dharma Survey / Gene Roddenberry Canon',
    disc_year: 1966,
    st_spectype: 'K1 V + DA4 White Dwarf + M4.5V Triple',
    st_teff: 5126,
    st_rad: 0.81,
    st_mass: 0.78,
    description: 'Canon homeworld of Spock and the Vulcans (later Ni\'Var), confirmed by Gene Roddenberry and Harvard-Smithsonian astronomers to orbit real triple star 40 Eridani A (16.3 ly). Features crimson-rust deserts (The Forge), high 1.4g gravity, and twin companion stars 40 Eri B & C gleaming in its sky.',
    moons: [
      { name: '40 Eridani B (White Dwarf Companion)', radiusRatio: 0.14, orbitRadius: 2.7, speed: 0.45, color: 0xe0f2fe, inclination: 0.22 },
      { name: '40 Eridani C (Red Dwarf Companion)', radiusRatio: 0.16, orbitRadius: 3.15, speed: 0.35, color: 0xf87171, inclination: -0.18 }
    ]
  },
  {
    id: 'Andoria — Procyon System (Star Trek)',
    pl_name: 'Andoria — Procyon System (Star Trek)',
    hostname: 'Procyon A (Alpha Canis Minoris)',
    isPopularMedia: true,
    mediaFranchise: 'Star Trek',
    mediaPreset: 'andoria',
    bodyType: 'planet',
    ra: 114.8255,
    dec: 5.225,
    distance: 11.46,
    dist_pc: 3.51,
    vmag: 0.34,
    pl_rade: 0.92,
    pl_radj: 0.082,
    pl_bmasse: 0.85,
    pl_bmassj: 0.0027,
    pl_orbper: 280.0,
    pl_orbsmax: 1.45,
    pl_orbeccen: 0.02,
    pl_eqt: 225,
    discoverymethod: 'Astrometry / Star Trek Founding Federation World',
    disc_year: 1968,
    st_spectype: 'F5 IV-V + DQZ White Dwarf Binary',
    st_teff: 6530,
    st_rad: 2.048,
    st_mass: 1.499,
    description: 'Glaciated M-class icy moon orbiting a ringed gas giant in the Procyon binary system (11.46 ly in Canis Minor). Founding member of the United Federation of Planets with geothermal cities carved beneath blue ice sheets.',
    moons: [
      { name: 'Andor (Parent Ringed Gas Giant)', radiusRatio: 0.32, orbitRadius: 2.5, speed: 0.55, color: 0x38bdf8, inclination: 0.14 }
    ]
  },
  {
    id: 'Qo\'noS (Kronos) — Klingon Homeworld (Star Trek)',
    pl_name: 'Qo\'noS (Kronos) — Klingon Homeworld (Star Trek)',
    hostname: 'Qo\'noS (Omega Leonis / Arcturus Sector)',
    isPopularMedia: true,
    mediaFranchise: 'Star Trek',
    mediaPreset: 'qonos',
    bodyType: 'planet',
    ra: 141.7,
    dec: 9.1,
    distance: 112.0,
    dist_pc: 34.34,
    vmag: 5.4,
    pl_rade: 1.28,
    pl_radj: 0.114,
    pl_bmasse: 1.85,
    pl_bmassj: 0.0058,
    pl_orbper: 384.0,
    pl_orbsmax: 1.02,
    pl_orbeccen: 0.05,
    pl_eqt: 296,
    discoverymethod: 'Starfleet Cartography / NX-01 Enterprise',
    disc_year: 2151,
    st_spectype: 'K0 V (Orange-Gold Star)',
    st_teff: 5250,
    st_rad: 0.88,
    st_mass: 0.86,
    description: 'Capital world of the Klingon Empire with olive-emerald stormy skies, a single massive volcanic landmass, and its shattered moon Praxis whose 2293 subspace explosion led to the Khitomer Accords.',
    moons: [
      { name: 'Praxis (Shattered Mining Moon)', radiusRatio: 0.15, orbitRadius: 2.25, speed: 0.85, color: 0xa8a29e, inclination: 0.25 }
    ]
  },
  {
    id: 'Risa — Epsilon Ceti (Star Trek)',
    pl_name: 'Risa — Epsilon Ceti (Star Trek)',
    hostname: 'Epsilon Ceti AB',
    isPopularMedia: true,
    mediaFranchise: 'Star Trek',
    mediaPreset: 'risa',
    bodyType: 'planet',
    ra: 39.95,
    dec: -11.87,
    distance: 88.0,
    dist_pc: 26.98,
    vmag: 4.83,
    pl_rade: 1.04,
    pl_radj: 0.093,
    pl_bmasse: 1.08,
    pl_bmassj: 0.0034,
    pl_orbper: 312.0,
    pl_orbsmax: 1.15,
    pl_orbeccen: 0.01,
    pl_eqt: 294,
    discoverymethod: 'Binary Interferometry / Star Trek',
    disc_year: 1990,
    st_spectype: 'F5 V + G0 V Binary System',
    st_teff: 6400,
    st_rad: 1.35,
    st_mass: 1.25,
    description: 'Tropical Federation paradise world (88 ly in Cetus) orbiting the real binary star Epsilon Ceti, engineered with planetary weather-modification networks that transform seismic instability into warm turquoise lagoons and twin-moon skies.',
    moons: [
      { name: 'Risa Moon I', radiusRatio: 0.11, orbitRadius: 2.0, speed: 0.9, color: 0xfef08a, inclination: 0.1 },
      { name: 'Risa Moon II', radiusRatio: 0.09, orbitRadius: 2.55, speed: 0.65, color: 0xbae6fd, inclination: -0.15 }
    ]
  },
  {
    id: 'Wolf 359c — Battle of Wolf 359 Sector (Star Trek)',
    pl_name: 'Wolf 359c — Battle of Wolf 359 Sector (Star Trek)',
    hostname: 'Wolf 359 (CN Leonis)',
    isPopularMedia: true,
    mediaFranchise: 'Star Trek: The Next Generation',
    mediaPreset: 'wolf359',
    bodyType: 'planet',
    ra: 164.1203,
    dec: 7.0147,
    distance: 7.86,
    dist_pc: 2.41,
    vmag: 13.54,
    pl_rade: 1.55,
    pl_radj: 0.138,
    pl_bmasse: 3.8,
    pl_bmassj: 0.012,
    pl_orbper: 2.687,
    pl_orbsmax: 0.018,
    pl_orbeccen: 0.15,
    pl_eqt: 365,
    discoverymethod: 'Radial Velocity (HARPS / HIRES) & Star Trek TNG',
    disc_year: 2019,
    st_spectype: 'M6.5 V (Ultra-Cool Flare Red Dwarf)',
    st_teff: 2800,
    st_rad: 0.16,
    st_mass: 0.09,
    description: 'Fifth-closest star system to Earth (7.86 ly in Leo). A real ultra-cool M6.5V red dwarf famous in Star Trek as the site of the Battle of Wolf 359 (Stardate 44002.3), where 40 Starfleet vessels engaged a Borg Cube.',
    moons: []
  },

  // --- AVATAR & THREE-BODY PROBLEM & REAL ALPHA CENTAURI ---
  {
    id: 'Pandora (Polyphemus Moon) — Alpha Centauri A (Avatar)',
    pl_name: 'Pandora (Polyphemus Moon) — Alpha Centauri A (Avatar)',
    hostname: 'Alpha Centauri A (Rigil Kentaurus)',
    isPopularMedia: true,
    mediaFranchise: 'Avatar (James Cameron)',
    mediaPreset: 'pandora',
    bodyType: 'planet',
    ra: 219.9021,
    dec: -60.834,
    distance: 4.37,
    dist_pc: 1.34,
    vmag: -0.01,
    pl_rade: 0.91,
    pl_radj: 0.081,
    pl_bmasse: 0.72,
    pl_bmassj: 0.0023,
    pl_orbper: 365.0,
    pl_orbsmax: 1.22,
    pl_orbeccen: 0.02,
    pl_eqt: 292,
    discoverymethod: 'Direct Imaging / RDA Alpha Centauri Survey',
    disc_year: 2009,
    st_spectype: 'G2 V + K1 V + M5.5V Triple Star System',
    st_teff: 5790,
    st_rad: 1.223,
    st_mass: 1.1,
    description: 'Bioluminescent habitable exomoon (0.8g, rich in superconducting unobtanium and floating Hallelujah Mountains) orbiting the banded blue gas giant Polyphemus in the real Alpha Centauri A system just 4.37 light-years from Earth.',
    moons: [
      { name: 'Polyphemus (Parent Banded Gas Giant)', radiusRatio: 0.34, orbitRadius: 2.55, speed: 0.55, color: 0x2563eb, inclination: 0.12 }
    ]
  },
  {
    id: 'Trisolaris — Alpha Centauri ABC (Three-Body Problem)',
    pl_name: 'Trisolaris — Alpha Centauri ABC (Three-Body Problem)',
    hostname: 'Alpha Centauri A (Rigil Kentaurus)',
    isPopularMedia: true,
    mediaFranchise: 'The Three-Body Problem (Liu Cixin)',
    mediaPreset: 'trisolaris',
    bodyType: 'planet',
    ra: 219.9021,
    dec: -60.834,
    distance: 4.37,
    dist_pc: 1.34,
    vmag: -0.01,
    pl_rade: 1.05,
    pl_radj: 0.094,
    pl_bmasse: 1.12,
    pl_bmassj: 0.0035,
    pl_orbper: 410.0,
    pl_orbsmax: 1.35,
    pl_orbeccen: 0.38,
    pl_eqt: 315,
    discoverymethod: 'Red Coast Base Radio Astronomy / Three-Body Problem',
    disc_year: 1979,
    st_spectype: 'G2 V + K1 V + M5.5V Triple Suns',
    st_teff: 5790,
    st_rad: 1.223,
    st_mass: 1.1,
    description: 'World caught in the chaotic three-body gravitational dynamics of Alpha Centauri A, B, and Proxima (4.37 ly). Alternates unpredictably between temperate Stable Eras and scorching/freezing Chaotic Eras, prompting the Sophon project and Trisolaran Fleet.',
    moons: [
      { name: 'Alpha Centauri B (Toliman K1V Sun)', radiusRatio: 0.22, orbitRadius: 2.75, speed: 0.65, color: 0xf59e0b, inclination: 0.28 },
      { name: 'Sophon Unfolded Proton Mirror', radiusRatio: 0.09, orbitRadius: 1.85, speed: 1.6, color: 0xe2e8f0, inclination: -0.2 }
    ]
  },
  {
    id: 'Alpha Centauri A & B (Rigil Kentaurus & Toliman)',
    pl_name: 'Alpha Centauri A & B (Rigil Kentaurus & Toliman)',
    hostname: 'Alpha Centauri A (Rigil Kentaurus)',
    isPopularMedia: true,
    mediaFranchise: 'Closest Solar-Type Binary System',
    mediaPreset: 'alpha_centauri',
    bodyType: 'planet',
    ra: 219.9021,
    dec: -60.834,
    distance: 4.37,
    dist_pc: 1.34,
    vmag: -0.01,
    pl_rade: 3.3,
    pl_radj: 0.295,
    pl_bmasse: 12.0,
    pl_bmassj: 0.038,
    pl_orbper: 360.0,
    pl_orbsmax: 1.1,
    pl_orbeccen: 0.08,
    pl_eqt: 295,
    discoverymethod: 'VLT NEAR Direct Mid-IR Imaging Candidate',
    disc_year: 2021,
    st_spectype: 'G2 V + K1 V Binary (HIP 71683)',
    st_teff: 5790,
    st_rad: 1.223,
    st_mass: 1.1,
    description: 'Closest sun-like star system to Earth (4.37 ly in Centaurus). From here, our Sun (Sol) shines as a brilliant 0.5-magnitude golden star in Cassiopeia, completing the familiar W-shaped zigzag!',
    moons: [
      { name: 'Alpha Centauri B (Toliman)', radiusRatio: 0.24, orbitRadius: 2.8, speed: 0.5, color: 0xfbbf24, inclination: 0.18 }
    ]
  },
  {
    id: 'Proxima Centauri b (Closest Known Exoplanet)',
    pl_name: 'Proxima Centauri b (Closest Known Exoplanet)',
    hostname: 'Proxima Centauri',
    isPopularMedia: true,
    mediaFranchise: 'Nearest Exoplanet to Earth (4.24 ly)',
    mediaPreset: 'proxima_b',
    bodyType: 'planet',
    ra: 217.4289,
    dec: -62.6795,
    distance: 4.24,
    dist_pc: 1.30,
    vmag: 11.13,
    pl_rade: 1.03,
    pl_radj: 0.092,
    pl_bmasse: 1.07,
    pl_bmassj: 0.0034,
    pl_orbper: 11.186,
    pl_orbsmax: 0.0485,
    pl_orbeccen: 0.02,
    pl_eqt: 234,
    discoverymethod: 'Radial Velocity (Pale Red Dot / HARPS / ESPRESSO)',
    disc_year: 2016,
    st_spectype: 'M5.5 Ve (Red Dwarf)',
    st_teff: 3042,
    st_rad: 0.154,
    st_mass: 0.122,
    description: 'Closest confirmed exoplanet to our Solar System (4.24 ly), orbiting inside the habitable zone of red dwarf Proxima Centauri alongside sub-Earth companion Proxima d. Target of the Breakthrough Starshot laser-sail initiative.',
    moons: []
  },

  // --- DUNE (Frank Herbert) ---
  {
    id: 'Arrakis (Dune) — Canopus / Alpha Carinae',
    pl_name: 'Arrakis (Dune) — Canopus / Alpha Carinae',
    hostname: 'Canopus (Alpha Carinae)',
    isPopularMedia: true,
    mediaFranchise: 'Dune (Frank Herbert)',
    mediaPreset: 'arrakis',
    bodyType: 'planet',
    ra: 95.988,
    dec: -52.6957,
    distance: 309.8,
    dist_pc: 94.98,
    vmag: -0.74,
    pl_rade: 0.96,
    pl_radj: 0.086,
    pl_bmasse: 0.88,
    pl_bmassj: 0.0028,
    pl_orbper: 402.0,
    pl_orbsmax: 3.8,
    pl_orbeccen: 0.04,
    pl_eqt: 332,
    discoverymethod: 'Imperial Cartography / Hipparcos Canopus Survey',
    disc_year: 1965,
    st_spectype: 'F0 II (Bright Yellow-White Supergiant)',
    st_teff: 7400,
    st_rad: 71.4,
    st_mass: 8.0,
    description: 'Third planet of Canopus (Alpha Carinae, 310 ly, second-brightest star in Earth\'s night sky). Hyper-arid desert world of giant sandworms (Shai-Hulud), cinnamon spice melange, the Shield Wall, and twin moons Krelln and Arvon (Muad\'Dib).',
    moons: [
      { name: 'Krelln (First Moon — Hand of God)', radiusRatio: 0.14, orbitRadius: 2.05, speed: 0.95, color: 0xfde68a, inclination: 0.12 },
      { name: 'Arvon (Second Moon — Muad\'Dib Mouse)', radiusRatio: 0.09, orbitRadius: 2.6, speed: 0.65, color: 0xfcd34d, inclination: -0.16 }
    ]
  },
  {
    id: 'Caladan — Delta Pavonis (Dune)',
    pl_name: 'Caladan — Delta Pavonis (Dune)',
    hostname: 'Delta Pavonis',
    isPopularMedia: true,
    mediaFranchise: 'Dune (Frank Herbert)',
    mediaPreset: 'caladan',
    bodyType: 'planet',
    ra: 302.1817,
    dec: -66.182,
    distance: 19.92,
    dist_pc: 6.11,
    vmag: 3.56,
    pl_rade: 1.02,
    pl_radj: 0.091,
    pl_bmasse: 1.04,
    pl_bmassj: 0.0033,
    pl_orbper: 368.0,
    pl_orbsmax: 1.08,
    pl_orbeccen: 0.01,
    pl_eqt: 286,
    discoverymethod: 'Astrometry / House Atreides Homeworld',
    disc_year: 1965,
    st_spectype: 'G8 IV (Solar-Analog Subgiant)',
    st_teff: 5604,
    st_rad: 1.22,
    st_mass: 1.05,
    description: 'Third planet of real solar-analog star Delta Pavonis (19.9 ly in Pavo). Lush oceanic-archipelago ancestral homeworld of House Atreides, known for its sea cliffs, Pundi rice paddies, and monsoon winds.',
    moons: []
  },

  // --- INTERSTELLAR (Christopher Nolan & Kip Thorne) ---
  {
    id: 'Gargantua & Miller\'s Planet (Interstellar)',
    pl_name: 'Gargantua & Miller\'s Planet (Interstellar)',
    hostname: 'Gargantua (100M M☉ Spinning Kerr Black Hole)',
    isPopularMedia: true,
    isDeepSky: true,
    deepSkyType: 'black_hole',
    mediaFranchise: 'Interstellar (Kip Thorne / Christopher Nolan)',
    mediaPreset: 'gargantua',
    ra: 190.5,
    dec: 12.4,
    distance: 10000000000,
    dist_pc: 3066000000,
    vmag: 14.5,
    pl_rade: 1.3,
    pl_radj: 0.116,
    pl_bmasse: 1.9,
    pl_orbper: 0.07,
    pl_orbsmax: 2.0,
    pl_eqt: 290,
    discoverymethod: 'Lazarus & Endurance Wormhole Expeditions',
    disc_year: 2014,
    st_spectype: 'Rapidly Spinning Supermassive Kerr Black Hole (100M M☉)',
    st_teff: 4500,
    st_rad: 20.0,
    st_mass: 100000000,
    description: 'Supermassive Kerr black hole spinning at 99.999999999999% the maximum relativistic limit, modeled with physicist Kip Thorne\'s gravitational lensing equations. Orbits include Miller\'s water world (1 hour = 7 Earth years), Mann\'s ice world, and Edmunds\' desert world.',
    moons: [
      { name: 'Miller\'s Planet (Time-Dilation Ocean World)', radiusRatio: 0.18, orbitRadius: 2.1, speed: 1.8, color: 0x38bdf8, inclination: 0.04 },
      { name: 'Mann\'s Planet (Frozen Ammonia Clouds)', radiusRatio: 0.16, orbitRadius: 2.75, speed: 0.9, color: 0xe2e8f0, inclination: 0.15 },
      { name: 'Edmunds\' Planet (Habitable World)', radiusRatio: 0.17, orbitRadius: 3.3, speed: 0.55, color: 0xf59e0b, inclination: -0.08 }
    ]
  },

  // --- THE EXPANSE ---
  {
    id: 'Ceres Station (Asteroid Belt — Sol System)',
    pl_name: 'Ceres Station (Asteroid Belt — Sol System)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    isPopularMedia: true,
    mediaFranchise: 'NASA Dawn Mission & The Expanse',
    solarPreset: 'ceres',
    bodyType: 'dwarf_planet',
    x_au: -2.1,
    y_au: 1.75,
    z_au: 0.4,
    dist_km_from_earth: 413000000,
    ra: 185.0,
    dec: 11.0,
    distance: 0.000043,
    dist_pc: 0.000013,
    pl_rade: 0.074,
    pl_radj: 0.0066,
    pl_bmasse: 0.000157,
    pl_bmassj: 0.0000005,
    pl_orbper: 1682.0,
    pl_orbsmax: 2.768,
    pl_orbeccen: 0.0758,
    pl_eqt: 168,
    discoverymethod: 'Giuseppe Piazzi / NASA Dawn Orbiter',
    disc_year: 1801,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Largest object and only dwarf planet in the Main Asteroid Belt (2.77 AU, diameter 940 km). Explored up close by NASA\'s Dawn ion spacecraft (which discovered bright sodium-carbonate brines in Occator Crater) and famous in The Expanse as Tycho-spun Ceres Station.',
    moons: [
      { name: 'NASA Dawn Ion Orbiter', radiusRatio: 0.07, orbitRadius: 1.85, speed: 1.35, color: 0x38bdf8, inclination: 0.3 }
    ]
  },
  {
    id: 'Ilus (New Terra) — Lacaille 9352 (The Expanse)',
    pl_name: 'Ilus (New Terra) — Lacaille 9352 (The Expanse)',
    hostname: 'Lacaille 9352 (GJ 887)',
    isPopularMedia: true,
    mediaFranchise: 'The Expanse (Cibola Burn)',
    mediaPreset: 'ilus',
    bodyType: 'planet',
    ra: 346.4668,
    dec: -35.8531,
    distance: 10.72,
    dist_pc: 3.29,
    vmag: 7.34,
    pl_rade: 1.36,
    pl_radj: 0.121,
    pl_bmasse: 4.2,
    pl_bmassj: 0.013,
    pl_orbper: 21.8,
    pl_orbsmax: 0.12,
    pl_orbeccen: 0.05,
    pl_eqt: 298,
    discoverymethod: 'RedDots HARPS Survey / Ring Gate Network',
    disc_year: 2020,
    st_spectype: 'M0.5 V (Brightest Red Dwarf in Sky)',
    st_teff: 3688,
    st_rad: 0.47,
    st_mass: 0.49,
    description: 'Super-Earth orbiting real M0.5V red dwarf Lacaille 9352 (GJ 887, 10.7 ly in Piscis Austrinus). In The Expanse, known as Ilus / New Terra—a lithium-rich world with a single continent, global ocean, and ancient Ring Builder planetary defense moons.',
    moons: [
      { name: 'Rocinante (Corvette Frigate)', radiusRatio: 0.07, orbitRadius: 1.9, speed: 1.25, color: 0xf97316, inclination: 0.1 }
    ]
  },

  // --- ALIEN, HALO, STAR WARS & REAL SIRIUS ---
  {
    id: 'LV-426 (Acheron) — Zeta-2 Reticuli (Alien)',
    pl_name: 'LV-426 (Acheron) — Zeta-2 Reticuli (Alien)',
    hostname: 'Zeta-2 Reticuli',
    isPopularMedia: true,
    mediaFranchise: 'Alien & Aliens (Ridley Scott / James Cameron)',
    mediaPreset: 'lv426',
    bodyType: 'planet',
    ra: 53.2327,
    dec: -62.5753,
    distance: 39.3,
    dist_pc: 12.05,
    vmag: 5.24,
    pl_rade: 0.82,
    pl_radj: 0.073,
    pl_bmasse: 0.65,
    pl_bmassj: 0.002,
    pl_orbper: 245.0,
    pl_orbsmax: 0.92,
    pl_orbeccen: 0.04,
    pl_eqt: 238,
    discoverymethod: 'Weyland-Yutani Deep-Space Telemetry',
    disc_year: 1979,
    st_spectype: 'G2 V + G1 V Wide Solar Binary',
    st_teff: 5846,
    st_rad: 0.98,
    st_mass: 0.99,
    description: 'Primordial basaltic exomoon (diameter 1,200 km, 0.86g) orbiting the ringed gas giant Calpamos in the real solar-twin binary Zeta-2 Reticuli (39.3 ly). Site of the derelict Engineer vessel investigated by USCSS Nostromo and Hadley\'s Hope colony.',
    moons: [
      { name: 'Calpamos (Ringed Parent Gas Giant)', radiusRatio: 0.33, orbitRadius: 2.5, speed: 0.55, color: 0xd97706, inclination: 0.16 }
    ]
  },
  {
    id: 'Reach — Epsilon Eridani II (Halo)',
    pl_name: 'Reach — Epsilon Eridani II (Halo)',
    hostname: 'Epsilon Eridani (Ran)',
    isPopularMedia: true,
    mediaFranchise: 'Halo (Bungie / 343 Industries)',
    mediaPreset: 'reach',
    bodyType: 'planet',
    ra: 53.2327,
    dec: -9.4583,
    distance: 10.47,
    dist_pc: 3.21,
    vmag: 3.73,
    pl_rade: 1.19,
    pl_radj: 0.106,
    pl_bmasse: 1.42,
    pl_bmassj: 0.0045,
    pl_orbper: 390.0,
    pl_orbsmax: 0.88,
    pl_orbeccen: 0.03,
    pl_eqt: 278,
    discoverymethod: 'Project Ozma / UNSC Colonial Survey',
    disc_year: 2001,
    st_spectype: 'K2 V (Young Orange Dwarf with Debris Disk)',
    st_teff: 5084,
    st_rad: 0.735,
    st_mass: 0.82,
    description: 'Titanium-rich temperate world (1.08g) orbiting real K2V star Epsilon Eridani (Ran, 10.5 ly in Eridanus, famous as the first SETI target in Frank Drake\'s 1960 Project Ozma and host to confirmed gas giant AEgir).',
    moons: [
      { name: 'Csodaszarvas (Inner Moon)', radiusRatio: 0.12, orbitRadius: 2.0, speed: 0.95, color: 0xcbd5e1, inclination: 0.1 },
      { name: 'Turul (Outer Moon)', radiusRatio: 0.09, orbitRadius: 2.55, speed: 0.65, color: 0x94a3b8, inclination: -0.18 }
    ]
  },
  {
    id: 'Kepler-16b — "Tatooine" Real Circumbinary World',
    pl_name: 'Kepler-16b — "Tatooine" Real Circumbinary World',
    hostname: 'Kepler-16 AB',
    isPopularMedia: true,
    mediaFranchise: 'NASA Kepler & Star Wars ("Tatooine")',
    mediaPreset: 'tatooine',
    bodyType: 'planet',
    ra: 289.0757,
    dec: 51.7574,
    distance: 245.4,
    dist_pc: 75.24,
    vmag: 12.0,
    pl_rade: 8.45,
    pl_radj: 0.754,
    pl_bmasse: 105.8,
    pl_bmassj: 0.333,
    pl_orbper: 228.776,
    pl_orbsmax: 0.7048,
    pl_orbeccen: 0.0069,
    pl_eqt: 200,
    discoverymethod: 'Transit Timing (NASA Kepler Space Telescope)',
    disc_year: 2011,
    st_spectype: 'K5 V + M4.5 V Eclipsing Binary Suns',
    st_teff: 4450,
    st_rad: 0.649,
    st_mass: 0.69,
    description: 'First unambiguous circumbinary planet discovered by NASA\'s Kepler Space Telescope (245 ly in Cygnus), nicknamed "Tatooine" because it orbits two suns (an orange K-dwarf and a red M-dwarf) that cast a real double sunset across its skies.',
    moons: [
      { name: 'Kepler-16 B (Secondary Red Dwarf Sun)', radiusRatio: 0.25, orbitRadius: 2.7, speed: 0.65, color: 0xf87171, inclination: 0.05 }
    ]
  },
  {
    id: 'Sirius A & B (The Dog Star & White Dwarf)',
    pl_name: 'Sirius A & B (The Dog Star & White Dwarf)',
    hostname: 'Sirius A (Alpha Canis Majoris)',
    isPopularMedia: true,
    mediaFranchise: 'Brightest Star in Earth\'s Night Sky',
    mediaPreset: 'sirius',
    bodyType: 'planet',
    ra: 101.2872,
    dec: -16.7161,
    distance: 8.6,
    dist_pc: 2.64,
    vmag: -1.46,
    pl_rade: 2.1,
    pl_radj: 0.187,
    pl_bmasse: 5.0,
    pl_bmassj: 0.0157,
    pl_orbper: 500.0,
    pl_orbsmax: 2.2,
    pl_orbeccen: 0.05,
    pl_eqt: 380,
    discoverymethod: 'Bessel Astrometry / Hubble Space Telescope',
    disc_year: 1862,
    st_spectype: 'A0mA1 Va + DA2 White Dwarf Binary',
    st_teff: 9940,
    st_rad: 1.711,
    st_mass: 2.063,
    description: 'Brightest star in Earth\'s night sky (Mag -1.46, 8.60 ly in Canis Major). A dazzling blue-white A-type star (25.4 L☉) orbited every 50.1 years by Sirius B ("The Pup"), an ultra-dense Earth-sized white dwarf with the mass of our Sun.',
    moons: [
      { name: 'Sirius B ("The Pup" DA2 White Dwarf)', radiusRatio: 0.18, orbitRadius: 2.65, speed: 0.55, color: 0xe0f2fe, inclination: 0.2 }
    ]
  }
];

// 16 Pickable Space Stations, Space Telescopes, Interstellar Probes, SETI Landmarks & JWST Benchmark Exoplanets
export const SPACE_MISSIONS_AND_STATIONS = [
  {
    id: 'International Space Station (ISS — LEO 408 km)',
    pl_name: 'International Space Station (ISS — LEO 408 km)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Earth (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'iss',
    bodyType: 'space_station',
    x_au: -0.999997,
    y_au: 0.000001,
    z_au: 0.000001,
    dist_km_from_earth: 408,
    ra: 120.0,
    dec: 51.6,
    distance: 0.000000043,
    dist_pc: 0.000000013,
    pl_rade: 0.01,
    pl_radj: 0.0009,
    pl_bmasse: 0.00000007,
    pl_bmassj: 0.0000000002,
    pl_orbper: 0.0645,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.0004,
    pl_eqt: 288,
    discoverymethod: 'In-Orbit Modular Assembly (40+ Flights)',
    disc_year: 1998,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Humanity\'s flagship orbital laboratory in Low Earth Orbit (408 km altitude, 51.6° inclination, 27,600 km/h, 92.9-min period). Spanning 109 m × 73 m (football-field size, 450,000 kg) with 16 Sawyer solar array wings, pressurized labs (Destiny, Harmony, Columbus, Kibo, Zvezda, Nauka), Canadarm2, and the 7-window Cupola Earth-observatory dome.',
    moons: [
      { name: 'Crew Dragon "Endeavour" & Soyuz MS', radiusRatio: 0.08, orbitRadius: 1.85, speed: 1.35, color: 0xf8fafc, inclination: 0.12 },
      { name: 'Earth (Home World — 408 km Below)', radiusRatio: 0.38, orbitRadius: 2.8, speed: 0.35, color: 0x2563eb, inclination: -0.08, targetObjectId: 'Earth (Sol System)' }
    ]
  },
  {
    id: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)',
    pl_name: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Earth (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'jwst',
    bodyType: 'space_telescope',
    x_au: -1.01,
    y_au: 0.0,
    z_au: 0.002,
    dist_km_from_earth: 1500000,
    ra: 90.0,
    dec: -5.0,
    distance: 0.0000158,
    dist_pc: 0.0000048,
    pl_rade: 0.012,
    pl_radj: 0.001,
    pl_bmasse: 0.00000001,
    pl_bmassj: 0.00000000003,
    pl_orbper: 365.25,
    pl_orbsmax: 1.01,
    pl_orbeccen: 0.01,
    pl_eqt: 40,
    discoverymethod: 'Ariane 5 Launch to Sun-Earth L2 Halo Orbit',
    disc_year: 2021,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Premier infrared space observatory orbiting Sun-Earth Lagrange Point 2 (1.5 million km / 0.01 AU anti-sunward of Earth). Equipped with a 6.5m 18-segment gold-coated beryllium primary mirror, 5-layer tennis-court-sized Kapton sunshield (cooling NIRCam, NIRSpec, FGS/NIRISS to 40 K and MIRI to 7 K), discovering the earliest cosmic-dawn galaxies (JADES-GS-z14-0) and exoplanet atmospheric SO₂/CO₂/CH₄.',
    moons: [
      { name: 'Gaia Space Observatory (L2)', radiusRatio: 0.09, orbitRadius: 2.1, speed: 0.85, color: 0x38bdf8, inclination: 0.2, targetObjectId: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)' },
      { name: 'Earth & Moon at 1.5M km', radiusRatio: 0.24, orbitRadius: 2.85, speed: 0.45, color: 0x3b82f6, inclination: -0.1, targetObjectId: 'Earth (Sol System)' }
    ]
  },
  {
    id: 'Hubble Space Telescope (HST — LEO 535 km)',
    pl_name: 'Hubble Space Telescope (HST — LEO 535 km)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Earth (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'hubble',
    bodyType: 'space_telescope',
    x_au: -0.999996,
    y_au: -0.000002,
    z_au: 0.000001,
    dist_km_from_earth: 535,
    ra: 210.0,
    dec: 28.5,
    distance: 0.000000056,
    dist_pc: 0.000000017,
    pl_rade: 0.01,
    pl_radj: 0.0009,
    pl_bmasse: 0.00000002,
    pl_orbper: 0.066,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.0003,
    pl_eqt: 294,
    discoverymethod: 'Space Shuttle Discovery STS-31 & 5 Servicing Missions',
    disc_year: 1990,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Iconic 2.4-meter UV/Visible/Near-IR space telescope in Low Earth Orbit (535 km altitude, 28.5° inclination, 95-min orbit). Executed 1.6+ million observations since 1990—including the Hubble Ultra Deep Field (10,000 galaxies), Cepheid calibration of cosmic expansion (H₀), Pillars of Creation, and the first exoplanet atmospheric sodium detection (HD 209458 b).',
    moons: [
      { name: 'Earth (535 km Below)', radiusRatio: 0.36, orbitRadius: 2.7, speed: 0.4, color: 0x2563eb, inclination: 0.08, targetObjectId: 'Earth (Sol System)' }
    ]
  },
  {
    id: 'Tiangong Space Station (CSS — LEO 390 km)',
    pl_name: 'Tiangong Space Station (CSS — LEO 390 km)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Earth (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'tiangong',
    bodyType: 'space_station',
    x_au: -0.999997,
    y_au: 0.000002,
    z_au: -0.000001,
    dist_km_from_earth: 390,
    ra: 300.0,
    dec: 41.5,
    distance: 0.000000041,
    dist_pc: 0.000000012,
    pl_rade: 0.01,
    pl_radj: 0.0009,
    pl_bmasse: 0.00000003,
    pl_orbper: 0.064,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.0005,
    pl_eqt: 290,
    discoverymethod: 'CNSA Modular Assembly (Tianhe + Wentian + Mengtian)',
    disc_year: 2021,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Three-module T-shaped orbital space station in Low Earth Orbit (390 km altitude, 41.5° inclination) comprising the Tianhe core module and Wentian & Mengtian laboratory cabin modules, visited by Shenzhou crewed spacecraft and Tianzhou cargo freighters.',
    moons: [
      { name: 'Shenzhou Crew Vehicle', radiusRatio: 0.08, orbitRadius: 1.9, speed: 1.25, color: 0xfef08a, inclination: 0.14 },
      { name: 'Earth (390 km Below)', radiusRatio: 0.36, orbitRadius: 2.75, speed: 0.38, color: 0x2563eb, inclination: -0.08, targetObjectId: 'Earth (Sol System)' }
    ]
  },
  {
    id: 'Voyager 1 Interstellar Probe & Golden Record (172 AU — Ophiuchus)',
    pl_name: 'Voyager 1 Interstellar Probe & Golden Record (172 AU — Ophiuchus)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'voyager1',
    bodyType: 'space_probe',
    x_au: -32.0,
    y_au: -158.0,
    z_au: 60.0,
    dist_km_from_earth: 25800000000,
    ra: 258.0,
    dec: 12.1,
    distance: 0.00272,
    dist_pc: 0.00083,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 100000,
    pl_orbsmax: 172.0,
    pl_orbeccen: 3.7,
    pl_eqt: 45,
    discoverymethod: 'NASA Deep Space Network (DSN 70m Dish Telemetry)',
    disc_year: 1977,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Farthest human-made object in history (172+ AU / 25.8 billion km in Ophiuchus; one-way radio light-time ~23h 55m, speed 17.0 km/s). After imaging Jupiter & Saturn (and taking the "Pale Blue Dot" portrait of Earth at 40 AU in 1990), Voyager 1 crossed the heliopause into interstellar space in August 2012, carrying Carl Sagan\'s 12-inch gold-plated copper Voyager Golden Record.',
    moons: [
      { name: 'Voyager Golden Record (12-inch Gold Phonograph)', radiusRatio: 0.09, orbitRadius: 1.75, speed: 1.1, color: 0xfacc15, inclination: 0.15 }
    ]
  },
  {
    id: 'Voyager 2 Interstellar Grand Tour Probe (143 AU — Pavo)',
    pl_name: 'Voyager 2 Interstellar Grand Tour Probe (143 AU — Pavo)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'voyager2',
    bodyType: 'space_probe',
    x_au: 38.0,
    y_au: -65.0,
    z_au: -121.0,
    dist_km_from_earth: 21400000000,
    ra: 300.5,
    dec: -58.2,
    distance: 0.00226,
    dist_pc: 0.00069,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 100000,
    pl_orbsmax: 143.0,
    pl_orbeccen: 3.2,
    pl_eqt: 48,
    discoverymethod: 'NASA Grand Tour & Deep Space Network Canberra (DSS-43)',
    disc_year: 1977,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Only spacecraft ever to visit all four giant planets—Jupiter (1979), Saturn (1981), Uranus (1986), and Neptune/Triton (1989). Crossed the heliopause into the interstellar medium in November 2018 and now cruises at 15.4 km/s in the southern constellation Pavo (143+ AU / 21.4 billion km from Earth), carrying a twin Voyager Golden Record.',
    moons: [
      { name: 'Voyager Golden Record (Twin Interstellar Disc)', radiusRatio: 0.09, orbitRadius: 1.75, speed: 1.1, color: 0xfacc15, inclination: -0.15 }
    ]
  },
  {
    id: 'Parker Solar Probe (Solar Corona — 6.1M km Perihelion)',
    pl_name: 'Parker Solar Probe (Solar Corona — 6.1M km Perihelion)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'parker',
    bodyType: 'space_probe',
    x_au: 0.04,
    y_au: 0.01,
    z_au: 0.0,
    dist_km_from_earth: 143500000,
    ra: 280.0,
    dec: -23.0,
    distance: 0.000015,
    dist_pc: 0.0000046,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 88.0,
    pl_orbsmax: 0.38,
    pl_orbeccen: 0.89,
    pl_eqt: 1400,
    discoverymethod: 'NASA / JHUAPL Solar Corona Touchdown Mission',
    disc_year: 2018,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Fastest human-made object in history (692,000 km/h / 192 km/s — 0.064% the speed of light!). Protected by an 11.4 cm carbon-composite Thermal Protection System (TPS) heat shield withstanding 1,400°C, Parker Solar Probe dived inside the Sun\'s Alfvén critical surface to 6.1 million km (9.86 R☉) above the solar photosphere, discovering magnetic "switchbacks" in the young solar wind.',
    moons: []
  },
  {
    id: 'New Horizons Kuiper Belt Probe (61 AU — Pluto & Arrokoth)',
    pl_name: 'New Horizons Kuiper Belt Probe (61 AU — Pluto & Arrokoth)',
    hostname: 'Sol (Our Sun)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'newhorizons',
    bodyType: 'space_probe',
    x_au: 18.0,
    y_au: -55.0,
    z_au: -19.0,
    dist_km_from_earth: 9120000000,
    ra: 290.5,
    dec: -20.6,
    distance: 0.00096,
    dist_pc: 0.00029,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 50000,
    pl_orbsmax: 61.0,
    pl_orbeccen: 1.5,
    pl_eqt: 38,
    discoverymethod: 'NASA / JHUAPL / SwRI Kuiper Belt Extended Mission',
    disc_year: 2006,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Launched at record Earth-escape velocity (16.26 km/s), New Horizons performed the historic July 14, 2015 flyby of Pluto & Charon and the Jan 1, 2019 flyby of contact-binary Kuiper Belt Object Arrokoth (2014 MU69 at 43.4 AU). At 61+ AU, it even measured the first interplanetary stellar parallax of Proxima Centauri and Wolf 359!',
    moons: [
      { name: 'Arrokoth (2014 MU69 Contact Binary KBO)', radiusRatio: 0.14, orbitRadius: 2.1, speed: 0.7, color: 0xb45309, inclination: 0.12 },
      { name: 'Pluto (Visited 2015)', radiusRatio: 0.22, orbitRadius: 2.8, speed: 0.4, color: 0xd6b091, inclination: -0.15, targetObjectId: 'Pluto (Dwarf Planet)' }
    ]
  },
  {
    id: 'Cassini–Huygens Saturn Flagship Orbiter & Titan Probe',
    pl_name: 'Cassini–Huygens Saturn Flagship Orbiter & Titan Probe',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Saturn (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'cassini',
    bodyType: 'space_probe',
    x_au: 9.1,
    y_au: -2.9,
    z_au: -0.3,
    dist_km_from_earth: 1425000000,
    ra: 342.8,
    dec: -9.5,
    distance: 0.00015,
    dist_pc: 0.000046,
    pl_rade: 0.009,
    pl_radj: 0.0008,
    pl_bmasse: 0.000000001,
    pl_orbper: 10759.2,
    pl_orbsmax: 9.58,
    pl_orbeccen: 0.056,
    pl_eqt: 134,
    discoverymethod: 'NASA / ESA / ASI Flagship Saturn Orbiter (294 Orbits)',
    disc_year: 1997,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Monumental 6.7-meter flagship spacecraft that orbited Saturn 294 times (2004–2017), deployed the ESA Huygens lander onto Titan\'s surface, flew directly through Enceladus\'s hydrothermal water-vapor plumes, and completed 22 Grand Finale dives inside Saturn\'s rings.',
    moons: [
      { name: 'ESA Huygens Titan Parachute Probe', radiusRatio: 0.11, orbitRadius: 1.85, speed: 1.2, color: 0xf59e0b, inclination: 0.18 },
      { name: 'Saturn (Parent Ringed Giant)', radiusRatio: 0.38, orbitRadius: 2.85, speed: 0.35, color: 0xe3c38b, inclination: -0.1, targetObjectId: 'Saturn (Sol System)' }
    ]
  },
  {
    id: 'Apollo 11 "Eagle" Lunar Module (Tranquility Base — Moon)',
    pl_name: 'Apollo 11 "Eagle" Lunar Module (Tranquility Base — Moon)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Moon / Luna (Earth Moon)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'apollo_lm',
    bodyType: 'space_lander',
    x_au: -0.9974,
    y_au: 0.001,
    z_au: 0.0002,
    dist_km_from_earth: 384400,
    ra: 115.4,
    dec: 22.1,
    distance: 0.00000004,
    dist_pc: 0.000000012,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 27.32,
    pl_orbsmax: 1.0,
    pl_orbeccen: 0.055,
    pl_eqt: 250,
    discoverymethod: 'NASA Apollo 11 Crewed Lunar Landing (July 20, 1969)',
    disc_year: 1969,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Historic Apollo Lunar Module LM-5 "Eagle" landed by Neil Armstrong and Buzz Aldrin at Mare Tranquillitatis (0.674°N, 23.473°E) on July 20, 1969 while Michael Collins orbited overhead in Command Module "Columbia". Deployed the Laser Ranging Retroreflector (still used today!) and Passive Seismic Experiment.',
    moons: [
      { name: 'CSM "Columbia" in Lunar Orbit', radiusRatio: 0.09, orbitRadius: 1.9, speed: 1.15, color: 0xe2e8f0, inclination: 0.1 },
      { name: 'Moon (Luna — Mare Tranquillitatis)', radiusRatio: 0.34, orbitRadius: 2.7, speed: 0.4, color: 0xcbd5e1, inclination: -0.08, targetObjectId: 'Moon / Luna (Earth Moon)' }
    ]
  },
  {
    id: 'Perseverance Rover & Ingenuity Helicopter (Jezero Crater — Mars)',
    pl_name: 'Perseverance Rover & Ingenuity Helicopter (Jezero Crater — Mars)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Mars (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'perseverance',
    bodyType: 'space_lander',
    x_au: -1.1,
    y_au: 1.05,
    z_au: 0.03,
    dist_km_from_earth: 225000000,
    ra: 108.5,
    dec: 23.8,
    distance: 0.000024,
    dist_pc: 0.0000073,
    pl_rade: 0.008,
    pl_radj: 0.0007,
    pl_bmasse: 0.000000001,
    pl_orbper: 686.98,
    pl_orbsmax: 1.524,
    pl_orbeccen: 0.0934,
    pl_eqt: 210,
    discoverymethod: 'NASA Sky-Crane Touchdown at Octavia E. Butler Landing (Feb 18, 2021)',
    disc_year: 2021,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Car-sized nuclear-powered Mars 2020 rover and coaxial-rotor Ingenuity Mars Helicopter exploring the 45-km Jezero Crater ancient lake-delta system (18.38°N, 77.58°E). Cached 20+ titanium sample tubes, produced oxygen from Martian CO₂ via MOXIE, discovered organic-rich "Cheyava Falls" rock, and completed 72 powered flights on another planet!',
    moons: [
      { name: 'Ingenuity Mars Helicopter (72 Flights)', radiusRatio: 0.08, orbitRadius: 1.75, speed: 1.65, color: 0xfacc15, inclination: 0.22 },
      { name: 'Mars (Jezero Crater Delta)', radiusRatio: 0.35, orbitRadius: 2.75, speed: 0.38, color: 0xc85328, inclination: -0.06, targetObjectId: 'Mars (Sol System)' }
    ]
  },
  {
    id: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)',
    pl_name: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)',
    hostname: 'Sol (Our Sun)',
    parentBody: 'Earth (Sol System)',
    isSolarSystem: true,
    isSpaceMission: true,
    stationPreset: 'gaia_kepler',
    bodyType: 'space_telescope',
    x_au: -1.01,
    y_au: 0.002,
    z_au: -0.001,
    dist_km_from_earth: 1500000,
    ra: 92.0,
    dec: -4.0,
    distance: 0.0000158,
    dist_pc: 0.0000048,
    pl_rade: 0.01,
    pl_radj: 0.0009,
    pl_bmasse: 0.00000001,
    pl_orbper: 365.25,
    pl_orbsmax: 1.01,
    pl_orbeccen: 0.01,
    pl_eqt: 110,
    discoverymethod: 'ESA Gaia Astrometry + NASA Kepler & TESS Transit Surveys',
    disc_year: 2009,
    st_spectype: 'G2 V',
    st_teff: 5778,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'The trio of space observatories that built modern galactic cartography: ESA\'s Gaia at Sun-Earth L2 measured 3D positions, parallaxes, and proper motions for 1.8+ billion stars (and discovered dormant black holes Gaia BH1–BH3), while NASA\'s Kepler and TESS photometers discovered over two-thirds of the 5,740+ known exoplanets in this star chart!',
    moons: [
      { name: 'JWST (Co-Orbiting at Sun-Earth L2)', radiusRatio: 0.11, orbitRadius: 2.0, speed: 0.9, color: 0xfacc15, inclination: 0.15, targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)' }
    ]
  },
  {
    id: 'SETI: Arecibo Message & Globular Cluster M13 (Hercules — 22,200 ly)',
    pl_name: 'SETI: Arecibo Message & Globular Cluster M13 (Hercules — 22,200 ly)',
    hostname: 'Messier 13 (Great Globular Cluster in Hercules)',
    isDeepSky: true,
    isSpaceMission: true,
    deepSkyType: 'cluster',
    stationPreset: 'seti_arecibo',
    ra: 250.4218,
    dec: 36.4599,
    distance: 22200,
    dist_pc: 6800,
    vmag: 5.8,
    pl_rade: 8400,
    pl_radj: 750,
    pl_bmasse: 2e11,
    pl_orbper: 100000,
    pl_orbsmax: 145,
    pl_eqt: 5800,
    discoverymethod: 'Arecibo 305m Planetary Radar Broadcast (2,380 MHz, Nov 16, 1974)',
    disc_year: 1974,
    st_spectype: 'Globular Cluster (300,000+ Stars) + 1,679-Bit METI Signal',
    st_teff: 5900,
    st_rad: 84.0,
    st_mass: 600000,
    description: 'Target of humanity\'s most famous Active SETI (METI) interstellar broadcast! On November 16, 1974, Frank Drake and Carl Sagan used Puerto Rico\'s 305-meter Arecibo Radio Telescope (450 kW at 2,380 MHz) to beam a 1,679-bit (73 rows × 23 columns semiprime) binary bitmap toward the 300,000 stars of Globular Cluster M13 in Hercules—encoding numbers 1–10, DNA nucleotides, the double helix, a human figure, the Solar System, and the Arecibo dish.',
    moons: [
      { name: '1,679-Bit Arecibo Wavefront (Currently ~52 ly from Earth)', radiusRatio: 0.14, orbitRadius: 2.1, speed: 1.4, color: 0x10b981, inclination: 0.15 }
    ]
  },
  {
    id: 'SETI: The "Wow! Signal" Locus & Breakthrough Listen (Sagittarius)',
    pl_name: 'SETI: The "Wow! Signal" Locus & Breakthrough Listen (Sagittarius)',
    hostname: 'Chi Sagittarii Region (1420.4556 MHz Hydrogen Line)',
    isDeepSky: true,
    isSpaceMission: true,
    deepSkyType: 'nebula',
    stationPreset: 'seti_wow',
    ra: 291.38,
    dec: -26.95,
    distance: 1800,
    dist_pc: 552,
    vmag: 9.5,
    pl_rade: 120,
    pl_radj: 10.7,
    pl_bmasse: 1000,
    pl_orbper: 3650,
    pl_orbsmax: 10,
    pl_eqt: 5780,
    discoverymethod: 'OSU Big Ear Radio Telescope (Aug 15, 1977 — "6EQUJ5") & Breakthrough Listen',
    disc_year: 1977,
    st_spectype: '1420.4556 MHz (21-cm Neutral Hydrogen Line Signal)',
    st_teff: 5780,
    st_rad: 1.0,
    st_mass: 1.0,
    description: 'Sky locus in Sagittarius (near Chi Sagittarii) where astronomer Jerry Ehman detected the famous 72-second narrowband (<10 kHz) radio signal "6EQUJ5" (30σ above deep-space noise) on August 15, 1977 using Ohio State University\'s Big Ear Radio Telescope right at the 1420.4556 MHz 21-cm Hydrogen Line predicted by Cocconi, Morrison, and Frank Drake\'s Project Ozma.',
    moons: [
      { name: 'Breakthrough Listen / Green Bank & Allen Telescope Array Beam', radiusRatio: 0.12, orbitRadius: 2.0, speed: 1.25, color: 0x38bdf8, inclination: 0.18 }
    ]
  },
  {
    id: 'WASP-39b — JWST Photochemical SO₂ & CO₂ Discovery (700 ly)',
    pl_name: 'WASP-39b — JWST Photochemical SO₂ & CO₂ Discovery (700 ly)',
    hostname: 'WASP-39 (Malmok)',
    isPopularMedia: true,
    isSpaceMission: true,
    mediaFranchise: 'JWST Early Release Science Landmark Discovery',
    stationPreset: 'wasp39b',
    bodyType: 'planet',
    ra: 217.3267,
    dec: -3.4445,
    distance: 698.0,
    dist_pc: 214.0,
    vmag: 12.1,
    pl_rade: 14.2,
    pl_radj: 1.27,
    pl_bmasse: 89.0,
    pl_bmassj: 0.28,
    pl_orbper: 4.05526,
    pl_orbsmax: 0.0486,
    pl_orbeccen: 0.0,
    pl_eqt: 1166,
    discoverymethod: 'JWST NIRSpec / NIRISS / NIRCam Transmission Spectroscopy',
    disc_year: 2022,
    st_spectype: 'G8 V (Solar-Type Star in Virgo)',
    st_teff: 5400,
    st_rad: 0.895,
    st_mass: 0.93,
    description: 'Puffy "Hot Saturn" (0.28 M♃, 1.27 R♃, 1,166 K) 700 ly away in Virgo where the James Webb Space Telescope achieved a historic milestone: the first definitive detection of carbon dioxide (CO₂) and photochemical sulfur dioxide (SO₂) in an exoplanet atmosphere, alongside H₂O, CO, Na, and K—proving active starlight-driven photochemistry on a distant world!',
    moons: [
      { name: 'JWST NIRSpec Transmission Spectrum Probe', radiusRatio: 0.09, orbitRadius: 1.85, speed: 1.35, color: 0xfacc15, inclination: 0.2, targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)' }
    ]
  },
  {
    id: 'K2-18b — JWST Hycean Ocean World Candidate (124 ly)',
    pl_name: 'K2-18b — JWST Hycean Ocean World Candidate (124 ly)',
    hostname: 'K2-18 (EPIC 201912552)',
    isPopularMedia: true,
    isSpaceMission: true,
    mediaFranchise: 'JWST Habitable-Zone Hycean Discovery',
    stationPreset: 'k2_18b',
    bodyType: 'planet',
    ra: 172.5605,
    dec: 7.5884,
    distance: 124.0,
    dist_pc: 38.02,
    vmag: 13.5,
    pl_rade: 2.61,
    pl_radj: 0.233,
    pl_bmasse: 8.63,
    pl_bmassj: 0.027,
    pl_orbper: 32.9396,
    pl_orbsmax: 0.1429,
    pl_orbeccen: 0.09,
    pl_eqt: 265,
    discoverymethod: 'NASA Kepler K2 & JWST NIRISS / NIRSpec / MIRI Spectroscopy',
    disc_year: 2015,
    st_spectype: 'M2.5 V (Red Dwarf in Leo)',
    st_teff: 3457,
    st_rad: 0.411,
    st_mass: 0.359,
    description: 'Habitable-zone sub-Neptune (2.61 R⊕, 8.63 M⊕, 265 K) 124 ly away in Leo. In 2023–2024, JWST transmission spectra revealed abundant methane (CH₄) and carbon dioxide (CO₂) with a lack of ammonia—consistent with a "Hycean" world (a global liquid water ocean beneath a hydrogen-rich atmosphere) and sparking intense investigation into candidate dimethyl sulfide (DMS) signatures.',
    moons: [
      { name: 'JWST NIRISS / NIRSpec Biosignature Survey', radiusRatio: 0.09, orbitRadius: 1.85, speed: 1.35, color: 0xfacc15, inclination: 0.2, targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)' }
    ]
  }
];

// Comprehensive Scientific Expeditions, Vehicles Sent & Scientific Results Database
export const SCIENTIFIC_EXPEDITIONS = {
  earth: [
    {
      mission: 'International Space Station (ISS) & Crew Expeditions 1–72',
      agency: 'NASA / ESA / JAXA / Roscosmos / CSA (1998–Present)',
      vehicles: 'ISS Orbital Laboratory (408 km LEO), Space Shuttle, Crew Dragon, Soyuz, Cupola Observatory',
      results: 'Continuous human presence in Low Earth Orbit for 25+ years; conducted 3,500+ microgravity, Earth climate, cosmic-ray (AMS-02), and closed-loop life-support experiments.',
      probeLabel: '🛰️ ISS (408 km LEO)',
      targetObjectId: 'International Space Station (ISS — LEO 408 km)'
    },
    {
      mission: 'James Webb Space Telescope (JWST) at Sun-Earth L2',
      agency: 'NASA / ESA / CSA (2021–Present)',
      vehicles: 'JWST 6.5m Gold-Beryllium Infrared Observatory & 5-Layer Kapton Sunshield (1.5M km at L2)',
      results: 'Revolutionized infrared astrophysics and exoplanet spectroscopy from Sun-Earth L2: discovered earliest galaxies (JADES-GS-z14-0), detected photochemical SO₂ & CO₂ on WASP-39b, and identified CH₄ & CO₂ on habitable-zone Hycean candidate K2-18b.',
      probeLabel: '🛰️ James Webb (JWST L2)',
      targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
    },
    {
      mission: 'Hubble Space Telescope (HST) & Tiangong Space Station (CSS)',
      agency: 'NASA / ESA (1990–Present) & CNSA (2021–Present)',
      vehicles: 'Hubble 2.4m Space Telescope (535 km LEO) & Tiangong 3-Module Space Station (390 km LEO)',
      results: 'Hubble completed 1.6+ million cosmic observations (Hubble Ultra Deep Field, cosmic expansion rate H₀); Tiangong operates continuous microgravity science across its Tianhe, Wentian, and Mengtian modules.',
      probeLabel: '🛰️ Hubble & Tiangong',
      targetObjectId: 'Hubble Space Telescope (HST — LEO 535 km)'
    },
    {
      mission: 'SETI: Project Ozma, Arecibo Message, Wow! Signal & Breakthrough Listen',
      agency: 'NRAO Green Bank / Arecibo / OSU Big Ear / SETI Institute / Breakthrough Listen (1960–Present)',
      vehicles: 'Green Bank 100m Telescope, Arecibo 305m Dish, Allen Telescope Array (42 Dishes), Parkes & MeerKAT',
      results: 'Pioneered the search for extraterrestrial technosignatures across the 1420 MHz (21-cm H-I) "Water Hole", beamed the 1,679-bit Arecibo Message toward M13 (1974), recorded the 72-second "6EQUJ5" Wow! Signal (1977), and surveys 1,000,000 nearby stars.',
      probeLabel: '📡 SETI & Breakthrough Listen',
      targetObjectId: 'SETI: Arecibo Message & Globular Cluster M13 (Hercules — 22,200 ly)'
    }
  ],
  moon: [
    {
      mission: 'Apollo Program (Apollo 8, 10, 11, 12, 14, 15, 16, 17)',
      agency: 'NASA (1968–1972)',
      vehicles: 'Saturn V, Command/Service Module, Lunar Module (Eagle..Challenger), 3 Lunar Roving Vehicles (LRV)',
      results: 'Landed 12 astronauts across 6 lunar sites (Mare Tranquillitatis to Taurus-Littrow); returned 382 kg of lunar rocks confirming the Giant-Impact origin of the Moon; deployed ALSEP seismometers and laser retroreflectors.',
      probeLabel: '🛰️ Apollo 11 Eagle LM',
      targetObjectId: 'Apollo 11 "Eagle" Lunar Module (Tranquility Base — Moon)'
    },
    {
      mission: 'Chang\'e 4, 5 & 6 Lunar Far-Side & Sample Return Missions',
      agency: 'CNSA (2018–2024)',
      vehicles: 'Chang\'e Landers, Yutu-2 Rover, Queqiao Relay Satellite, Ascent Sample Return Capsules',
      results: 'First soft landing and roving on the Lunar Far Side (Von Kármán Crater); returned youngest 2.0-billion-year-old basalt (Chang\'e 5) and the first 1,935 g far-side samples from the South Pole–Aitken Basin (Chang\'e 6).',
      probeLabel: '🛰️ Chang\'e / Yutu-2'
    },
    {
      mission: 'Chandrayaan-3, LRO & Artemis Lunar Exploration',
      agency: 'ISRO / NASA / ESA (2009–Present)',
      vehicles: 'Vikram Lander & Pragyan Rover (ISRO), Lunar Reconnaissance Orbiter (LRO), Orion Spacecraft (Artemis I)',
      results: 'First landing in the lunar south polar region (69.37°S), confirming in-situ sulfur and steep thermal gradients; LRO mapped the entire Moon at 0.5m resolution and confirmed water-ice deposits in permanently shadowed polar craters.',
      probeLabel: '🛰️ LRO & Vikram'
    }
  ],
  mercury: [
    {
      mission: 'MESSENGER (MErcury Surface, Space ENvironment, GEochemistry, and Ranging)',
      agency: 'NASA (2004–2015, Orbit 2011–2015)',
      vehicles: 'MESSENGER Mercury Orbiter',
      results: 'First spacecraft to orbit Mercury; mapped 100% of the globe, confirmed abundant water ice and dark organic volatiles inside permanently shadowed polar craters, and revealed a massive molten iron core occupying 85% of the planet\'s radius.',
      probeLabel: '🛰️ MESSENGER Orbiter'
    },
    {
      mission: 'Mariner 10 & BepiColombo Dual-Orbiter Mission',
      agency: 'NASA (1974–1975) / ESA & JAXA (2018–Present)',
      vehicles: 'Mariner 10 Flyby Probe, Mercury Planetary Orbiter (MPO) & Mio Magnetospheric Orbiter',
      results: 'Mariner 10 discovered Mercury\'s intrinsic dipole magnetic field and Caloris Basin; BepiColombo completed 6 gravity-assist flybys imaging lobate scarps and volcanic hollows ahead of orbital insertion.',
      probeLabel: '🛰️ BepiColombo'
    }
  ],
  venus: [
    {
      mission: 'Venera 7, 9, 13 & 14 & Vega 1–2 Atmospheric Balloons',
      agency: 'Soviet Space Program (1970–1985)',
      vehicles: 'Titanium Pressure-Hull Surface Landers (Venera 7–14) & Vega Superpressure Helium Balloons',
      results: 'First human-made vehicles to land on another planet and transmit color panoramic photographs, audio recordings of Venusian wind, and X-ray fluorescence drilling showing tholeiitic basalt rocks under 92 bar / 465°C conditions.',
      probeLabel: '🛰️ Venera 13 Lander'
    },
    {
      mission: 'Magellan Radar Mapper, Mariner 2, Venus Express & Akatsuki',
      agency: 'NASA / ESA / JAXA (1962–Present)',
      vehicles: 'Magellan Synthetic Aperture Radar Orbiter, Venus Express, Akatsuki Climate Orbiter',
      results: 'Magellan penetrated Venus\'s opaque sulfuric-acid clouds to map 98% of the surface topography (Maxwell Montes, Maat Mons, arachnoids, pancake domes) and confirmed active volcanism and 360 km/h atmospheric super-rotation.',
      probeLabel: '🛰️ Magellan Radar Orbiter'
    }
  ],
  mars: [
    {
      mission: 'Mars 2020 Perseverance Rover & Ingenuity Mars Helicopter',
      agency: 'NASA / JPL (2020–Present)',
      vehicles: 'Perseverance Nuclear-Powered Rover & Ingenuity Coaxial Rotorcraft',
      results: 'Explored ancient Jezero Crater river delta; discovered organic-bearing mudstones ("Cheyava Falls") and cached sample tubes for return; Ingenuity completed 72 powered flights—the first aircraft flight on another planet.',
      probeLabel: '🛰️ Perseverance & Ingenuity',
      targetObjectId: 'Perseverance Rover & Ingenuity Helicopter (Jezero Crater — Mars)'
    },
    {
      mission: 'Mars Science Laboratory (Curiosity) & MER Spirit / Opportunity',
      agency: 'NASA / JPL (2004–Present)',
      vehicles: 'Curiosity Rover (Gale Crater / Mount Sharp), Spirit (Gusev Crater) & Opportunity (Meridiani Planum)',
      results: 'Confirmed Mars once hosted long-lived habitable freshwater lakes and streams with neutral pH, clay minerals, hematite "blueberries", and complex organic carbon molecules.',
      probeLabel: '🛰️ Curiosity & MRO'
    },
    {
      mission: 'Viking 1 & 2, MRO, Mars Express, Hope & Tianwen-1 / Zhurong',
      agency: 'NASA / ESA / UAESA / CNSA (1975–Present)',
      vehicles: 'Viking 1–2 Landers & Orbiters, Mars Reconnaissance Orbiter (HiRISE), Tianwen-1 & Zhurong Rover',
      results: 'Viking performed the first Mars surface landings and biological soil tests; MRO & Mars Express discovered subsurface water-ice glaciers and seasonal slope streaks.',
      probeLabel: '🛰️ Viking & Tianwen-1'
    }
  ],
  phobos: [
    {
      mission: 'Mars Express, Viking Orbiters, Phobos 2 & MMX (Martian Moons eXploration)',
      agency: 'ESA / NASA / JAXA (1977–Present)',
      vehicles: 'Mars Express Orbiter (45 km flybys), Viking 1 Orbiter, JAXA MMX Sample-Return Spacecraft & IDEFIX Rover',
      results: 'Mapped Stickney Crater and linear tidal grooves; measured Phobos\'s low bulk density (1.87 g/cm³), indicating a porous "rubble-pile" interior of carbonaceous chondrite or Mars impact ejecta.',
      probeLabel: '🛰️ Mars Express & MMX'
    }
  ],
  ceres: [
    {
      mission: 'NASA Dawn Ion-Propulsion Orbiter Mission',
      agency: 'NASA / JPL (2007–2018, Ceres Orbit 2015–2018)',
      vehicles: 'Dawn Xenon Ion-Thruster Spacecraft',
      results: 'First spacecraft to orbit two extraterrestrial targets (Vesta and dwarf planet Ceres); discovered bright sodium-carbonate evaporite deposits ("Cerealia & Vinalia Faculae") in Occator Crater fed by a deep subsurface brine reservoir, plus cryovolcano Ahuna Mons.',
      probeLabel: '🛰️ Dawn Ion Orbiter'
    }
  ],
  jupiter: [
    {
      mission: 'Juno Polar Orbiter & Galileo Orbiter / Atmospheric Entry Probe',
      agency: 'NASA / JPL (Galileo 1989–2003, Juno 2011–Present)',
      vehicles: 'Juno Solar-Powered Polar Orbiter, Galileo Orbiter & Titanium Atmospheric Parachute Probe',
      results: 'Galileo dropped a probe 156 km into Jupiter\'s crushing atmosphere and discovered subsurface oceans on Europa, Ganymede, and Callisto; Juno revealed polygonal geometric vortex clusters at Jupiter\'s poles, a "fuzzy" diluted core, and 350 km deep roots of the Great Red Spot.',
      probeLabel: '🛰️ Juno & Galileo'
    },
    {
      mission: 'Voyager 1 & 2, Pioneer 10 & 11, JUICE & Europa Clipper',
      agency: 'NASA / ESA (1972–Present)',
      vehicles: 'Pioneer 10–11, Voyager 1–2, ESA JUICE Orbiter, NASA Europa Clipper',
      results: 'Pioneer & Voyager executed the first outer-planet flybys, discovering Jupiter\'s faint gossamer rings, lightning, aurorae, and active volcanism in the Jovian system.',
      probeLabel: '🛰️ Voyager 1 & Clipper',
      targetObjectId: 'Voyager 1 Interstellar Probe & Golden Record (172 AU — Ophiuchus)'
    }
  ],
  io: [
    {
      mission: 'Voyager 1, Galileo Orbiter & Juno Ultra-Close Flybys',
      agency: 'NASA / JPL (1979–Present)',
      vehicles: 'Voyager 1, Galileo Orbiter, Juno Spacecraft (1,500 km flybys in 2023–2024)',
      results: 'Discovered the first active extraterrestrial volcanoes (Loki Patera, Pele, Prometheus, Tvashtar) with 400 km tall sulfur-dioxide plumes driven by relentless tidal flexing between Jupiter, Europa, and Ganymede.',
      probeLabel: '🛰️ Juno Io Flyby'
    }
  ],
  europa: [
    {
      mission: 'Galileo Orbiter, Juno Flyby & NASA Europa Clipper',
      agency: 'NASA / JPL (1995–Present)',
      vehicles: 'Galileo Magnetometer Orbiter, Juno (352 km flyby, 2022), Europa Clipper Flagship Spacecraft',
      results: 'Measured induced magnetic fields proving a global liquid salt-water ocean (containing ~2x Earth\'s total ocean volume) beneath Europa\'s 15–25 km fractured chaos-terrain ice shell, plus Hubble water-vapor plume detections.',
      probeLabel: '🛰️ Europa Clipper'
    }
  ],
  ganymede: [
    {
      mission: 'Galileo Orbiter, Juno Flyby & ESA JUICE (Jupiter Icy Moons Explorer)',
      agency: 'NASA / ESA (1996–Present)',
      vehicles: 'Galileo Orbiter, Juno (1,038 km flyby), ESA JUICE Ganymede Orbiter',
      results: 'Discovered that Ganymede is the only moon in the Solar System with its own intrinsic magnetosphere and aurorae, plus a deep subsurface saltwater ocean sandwiched between ice layers.',
      probeLabel: '🛰️ ESA JUICE Orbiter'
    }
  ],
  callisto: [
    {
      mission: 'Voyager 1 & 2, Galileo Orbiter & ESA JUICE',
      agency: 'NASA / ESA (1979–Present)',
      vehicles: 'Voyager 1–2, Galileo Orbiter, ESA JUICE (21 planned Callisto flybys)',
      results: 'Mapped the 3,800 km multi-ring Valhalla impact basin; magnetic induction measurements revealed a conductive subsurface briny ocean 150 km beneath Callisto\'s ancient cratered ice crust.',
      probeLabel: '🛰️ Galileo & JUICE'
    }
  ],
  saturn: [
    {
      mission: 'Cassini–Huygens Flagship Saturn Tour (294 Orbits)',
      agency: 'NASA / ESA / ASI (1997–2017)',
      vehicles: 'Cassini Orbiter & Huygens Titan Lander (plus Pioneer 11 & Voyager 1–2)',
      results: 'Spent 13 years orbiting Saturn; imaged Saturn\'s north polar Hexagon jet stream, ring-moon "propellers" and vertical ring waves, discovered 7 new moons, and executed the Grand Finale diving 22 times between Saturn\'s cloud tops and innermost D-ring.',
      probeLabel: '🛰️ Cassini–Huygens Orbiter',
      targetObjectId: 'Cassini–Huygens Saturn Flagship Orbiter & Titan Probe'
    }
  ],
  titan: [
    {
      mission: 'Cassini Radar Orbiter, ESA Huygens Surface Lander & NASA Dragonfly',
      agency: 'ESA / NASA / ASI (2005–Present)',
      vehicles: 'Huygens Atmospheric Parachute Lander (2005), Cassini SAR Radar, Dragonfly Nuclear Octocopter (Launching 2028)',
      results: 'Huygens achieved the farthest landing from Earth in history, transmitting images of rounded water-ice river cobbles and orange tholin haze; Cassini Radar mapped northern liquid methane/ethane seas (Kraken Mare, Ligeia Mare) and river networks.',
      probeLabel: '🛰️ Huygens & Cassini',
      targetObjectId: 'Cassini–Huygens Saturn Flagship Orbiter & Titan Probe'
    }
  ],
  enceladus: [
    {
      mission: 'Cassini Plume-Dive Flybys (23 Close Encounters)',
      agency: 'NASA / ESA / ASI (2005–2017)',
      vehicles: 'Cassini Ion & Neutral Mass Spectrometer (INMS) & Cosmic Dust Analyzer',
      results: 'Flew directly through Enceladus\'s south polar "Tiger Stripe" cryovolcanic geysers at 48 km altitude; detected water vapor, salts, silica nanograins (proving seafloor hydrothermal vents!), complex organic molecules, and molecular hydrogen (H2).',
      probeLabel: '🛰️ Cassini Plume Diver',
      targetObjectId: 'Cassini–Huygens Saturn Flagship Orbiter & Titan Probe'
    }
  ],
  uranus: [
    {
      mission: 'Voyager 2 Uranus Flyby & JWST Infrared Ring Survey',
      agency: 'NASA / JPL / ESA (1986 & 2023)',
      vehicles: 'Voyager 2 Grand Tour Spacecraft & James Webb Space Telescope (NIRCam)',
      results: 'Voyager 2 flew within 81,500 km of Uranus\'s cloud tops in Jan 1986, discovering 10 new moons (including Puck), 2 new rings, Miranda\'s 20 km Verona Rupes cliff, and a bizarre 59°-tilted offset magnetosphere.',
      probeLabel: '🛰️ Voyager 2 Flyby',
      targetObjectId: 'Voyager 2 Interstellar Grand Tour Probe (143 AU — Pavo)'
    }
  ],
  neptune: [
    {
      mission: 'Voyager 2 Neptune & Triton Encounter',
      agency: 'NASA / JPL (August 1989)',
      vehicles: 'Voyager 2 Deep-Space Probe & HST / JWST Follow-up',
      results: 'Flew 4,950 km above Neptune\'s north pole; discovered the Great Dark Spot, white methane-ice "Scooter" clouds driven by 2,100 km/h supersonic winds (fastest in the Solar System), 6 new moons, and complete Adams/Le Verrier ring arcs.',
      probeLabel: '🛰️ Voyager 2 (4,950 km)',
      targetObjectId: 'Voyager 2 Interstellar Grand Tour Probe (143 AU — Pavo)'
    }
  ],
  triton: [
    {
      mission: 'Voyager 2 Triton Close Flyby (39,790 km)',
      agency: 'NASA / JPL (August 25, 1989)',
      vehicles: 'Voyager 2 Imaging Science Subsystem',
      results: 'Revealed a geologically young cantaloupe-terrain nitrogen/methane ice crust (38 K) with active cryovolcanic geysers erupting dark plumes 8 km high into a thin nitrogen atmosphere—confirming Triton is a captured Kuiper Belt dwarf planet.',
      probeLabel: '🛰️ Voyager 2 Triton Pass',
      targetObjectId: 'Voyager 2 Interstellar Grand Tour Probe (143 AU — Pavo)'
    }
  ],
  pluto: [
    {
      mission: 'NASA New Horizons Kuiper Belt Flyby Mission',
      agency: 'NASA / JHUAPL / SwRI (2006–Present, Pluto Flyby July 14, 2015)',
      vehicles: 'New Horizons RTG Spacecraft (LORRI, Ralph, Alice, REX, SWAP)',
      results: 'Flew 12,500 km above Pluto after a 9.5-year journey; revealed the vast convecting nitrogen-ice glacier Sputnik Planitia ("Pluto\'s Heart"), 3.5 km water-ice mountains (Tenzing & Hillary Montes), blue atmospheric haze layers, and later visited Arrokoth (2014 MU69).',
      probeLabel: '🛰️ New Horizons (12,500 km)',
      targetObjectId: 'New Horizons Kuiper Belt Probe (61 AU — Pluto & Arrokoth)'
    }
  ],
  adrian_tau_ceti: [
    {
      mission: 'Project Hail Mary Interstellar Expedition (Canon Sci-Fi)',
      agency: 'Project Hail Mary International Taskforce & Erid Space Agency',
      vehicles: 'Hail Mary (Astrophage Spin-Drive Ship), Blip-A (Xenonite Vessel) & 4 Beetle Return Probes (John, Paul, George, Ringo)',
      results: 'Ryland Grace and Eridanian engineer Rocky rendezvoused at Tau Ceti; discovered that planet "Adrian" (Tau Ceti e) harbors a natural predator of Astrophage (Taumoeba), selectively bred nitrogen-resistant Taumoeba-82.5, and launched the 4 Beetle probes back to save Sol and 40 Eridani!',
      probeLabel: '🛰️ Hail Mary & Blip-A'
    },
    {
      mission: 'Project Ozma (First Modern SETI Experiment) & HARPS / ALMA Surveys',
      agency: 'NRAO Green Bank (Frank Drake, 1960) / Keck HIRES / ESO HARPS / ALMA',
      vehicles: '85-ft Tatel Radio Telescope (1.420 GHz Hydrogen Line), HARPS Spectrograph, ALMA Array',
      results: 'Tau Ceti was one of the first two stars ever searched for extraterrestrial radio signals in Frank Drake\'s 1960 Project Ozma; radial velocity and ALMA surveys detected 4 super-Earth candidates and a broad Kuiper-like debris belt.',
      probeLabel: '📡 SETI Project Ozma & ALMA',
      targetObjectId: 'SETI: The "Wow! Signal" Locus & Breakthrough Listen (Sagittarius)'
    }
  ],
  erid_40_eridani: [
    {
      mission: 'Dharma Planet Survey & HD 26965 b Discovery (Real Astronomy)',
      agency: 'University of Florida / Dharma Endowment / Keck & HARPS (2018)',
      vehicles: '50-inch Dharma Automated Spectroscopic Telescope (Mt. Lemmon), Keck HIRES, ESO HARPS',
      results: 'Detected the 42.38-day radial velocity signal of super-Earth HD 26965 b (~8.47 M⊕) around the primary K1V orange dwarf 40 Eridani A at 16.34 light-years.',
      probeLabel: '🛰️ Dharma / HARPS Survey'
    },
    {
      mission: 'Hail Mary Rescue & Erid Planetary Defense (Project Hail Mary Canon)',
      agency: 'Erid Science Council & Ryland Grace / Rocky Crew',
      vehicles: 'Hail Mary Spin-Drive Ship, Blip-A & Erid Xenonite Space Elevator',
      results: 'Ryland Grace piloted the Hail Mary to 40 Eridani A ("Erid") to deliver nitrogen-resistant Taumoeba to Rocky\'s homeworld, seeding Venus-analog world "Threeworld" and saving 40 Eridani\'s sun from dimming.',
      probeLabel: '🛰️ Hail Mary at Erid'
    }
  ],
  vulcan: [
    {
      mission: 'Dharma Planet Survey & Roddenberry–Baliunas 40 Eridani Confirmation',
      agency: 'Harvard-Smithsonian CfA & Dharma Survey (1991 & 2018)',
      vehicles: 'Mt. Wilson HK Project, Dharma Spectroscopic Telescope, NASA TESS',
      results: 'In 1991, Gene Roddenberry and astronomers Sallie Baliunas, Robert Donahue, and George Gatewood officially identified 40 Eridani A as Vulcan\'s host star; in 2018, the Dharma Planet Survey detected a real super-Earth signature at 42.4 days.',
      probeLabel: '🛰️ USS Enterprise & TESS',
      targetObjectId: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)'
    }
  ],
  pandora: [
    {
      mission: 'VLT NEAR (New Earths in the Alpha Centauri Region) & JWST',
      agency: 'ESO Very Large Telescope / Breakthrough Watch / NASA JWST (2021–Present)',
      vehicles: 'VLT VISIR Thermal Coronagraph (100-hour exposure) & JWST MIRI Coronagraph',
      results: 'Direct mid-infrared thermal imaging at 10–12.5 microns probed the habitable zone of Alpha Centauri A, identifying candidate C1 (~1.1 AU) while JWST searches for giant planets and exomoons.',
      probeLabel: '🛰️ JWST & VLT NEAR',
      targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
    }
  ],
  gargantua: [
    {
      mission: 'Lazarus & Endurance Wormhole Expeditions (Interstellar Canon + LIGO/EHT Physics)',
      agency: 'NASA / Caltech Kip Thorne Relativistic Astrophysics Team',
      vehicles: 'Endurance Ring Station, Ranger 1 & 2, Lander 1, TARS & CASE Quantum Probes',
      results: 'Using Kip Thorne\'s Double Negative relativistic ray-tracing code, produced the first scientifically accurate visualization of a spinning Kerr black hole\'s warped accretion disk; TARS transmitted quantum gravity data from inside the singularity.',
      probeLabel: '🛰️ Endurance & Ranger'
    }
  ],
  iss: [
    {
      mission: 'ISS Assembly & Expeditions 1–72 Continuous Human Presence',
      agency: 'NASA / Roscosmos / ESA / JAXA / CSA (1998–Present)',
      vehicles: '16 Pressurized Modules, 109m Integrated Truss, SpaceX Crew Dragon, Boeing Starliner, Soyuz, Space Shuttle, Canadarm2',
      results: 'Over 280 astronauts from 23 countries have lived aboard the ISS; hosted the Alpha Magnetic Spectrometer (AMS-02 recording 200+ billion cosmic rays), NICER X-ray pulsar telescope, Cold Atom Lab (Bose-Einstein condensates at 100 picokelvin), and vascular/bone countermeasures for deep-space missions.',
      probeLabel: '🌍 View Earth (408 km Below)',
      targetObjectId: 'Earth (Sol System)'
    }
  ],
  jwst: [
    {
      mission: 'James Webb Space Telescope Science Operations at Sun-Earth L2',
      agency: 'NASA / ESA / CSA / STScI (Launched Dec 25, 2021 — Operational at L2)',
      vehicles: 'Ariane 5 ECA, 6.5m 18-Segment Gold-Beryllium Primary Mirror, 5-Layer Kapton Sunshield, NIRCam, NIRSpec, MIRI, FGS/NIRISS',
      results: 'Operating in a 1.5-million-km halo orbit around L2: discovered cosmic-dawn galaxies <300 Myr after the Big Bang (JADES-GS-z14-0), detected photochemical SO₂ and CO₂ on WASP-39b, detected CH₄ & CO₂ on habitable-zone Hycean world K2-18b, and measured thermal emission across the 7 rocky planets of TRAPPIST-1.',
      probeLabel: '🪐 Inspect WASP-39b (JWST Target)',
      targetObjectId: 'WASP-39b — JWST Photochemical SO₂ & CO₂ Discovery (700 ly)'
    },
    {
      mission: 'JWST Habitable-Zone Sub-Neptune & Biosignature Campaign',
      agency: 'STScI / Cambridge / NASA JWST GO Programs',
      vehicles: 'JWST NIRISS SOSS, NIRSpec G395H & MIRI LRS Spectrographs',
      results: 'Probed K2-18b (124 ly in Leo), revealing ~1% methane (CH₄) and carbon dioxide (CO₂) with depleted ammonia—matching predictions for a hydrogen envelope over a global water ocean ("Hycean" world).',
      probeLabel: '🌊 Inspect K2-18b (Hycean World)',
      targetObjectId: 'K2-18b — JWST Hycean Ocean World Candidate (124 ly)'
    }
  ],
  hubble: [
    {
      mission: 'Hubble Space Telescope 35-Year Cosmic Discovery Legacy & 5 Shuttle Servicing Missions',
      agency: 'NASA / ESA / STScI (1990–Present)',
      vehicles: '2.4m Ritchey-Chrétien Reflector, WFC3, ACS, STIS, COS & Space Shuttles Discovery, Endeavour, Columbia, Atlantis',
      results: '1.6+ million observations and 21,000+ peer-reviewed papers: imaged the Hubble Ultra Deep Field back to z~11, pinned down the Hubble Constant (H₀) and helped discover Dark Energy, imaged shoemaker-Levy 9 impacting Jupiter, and pioneered exoplanet transmission spectroscopy.',
      probeLabel: '🌍 View Earth (535 km Below)',
      targetObjectId: 'Earth (Sol System)'
    }
  ],
  tiangong: [
    {
      mission: 'Tiangong China Space Station Modular Operations',
      agency: 'CNSA / CMSA (2021–Present)',
      vehicles: 'Tianhe Core Module, Wentian & Mengtian Lab Modules, Shenzhou Crewed Spacecraft, Tianzhou Cargo Ships',
      results: 'Completed T-shaped orbital assembly in 2022; conducts microgravity combustion, closed-loop aquatic ecosystems, atomic clock relativity tests, and gamma-ray burst polarimetry (POLAR-2).',
      probeLabel: '🌍 View Earth (390 km Below)',
      targetObjectId: 'Earth (Sol System)'
    }
  ],
  voyager1: [
    {
      mission: 'Voyager 1 Planetary Grand Tour & Interstellar Medium Exploration',
      agency: 'NASA / JPL Deep Space Network (Launched Sept 5, 1977 — 172+ AU)',
      vehicles: 'Voyager 1 Spacecraft (3.7m High-Gain Dish, 3 Pu-238 RTGs, Magnetometer, Plasma Wave Subsystem & Golden Record)',
      results: 'Discovered active volcanism on Io (1979) and Titan\'s thick nitrogen-methane atmosphere (1980), captured the "Pale Blue Dot" Family Portrait of the Solar System (Feb 14, 1990 at 40.5 AU), crossed the heliopause on Aug 25, 2012 at 121.6 AU, and directly samples interstellar magnetic fields and plasma waves at 172+ AU.',
      probeLabel: '🪐 View Saturn (Visited 1980)',
      targetObjectId: 'Saturn (Sol System)'
    }
  ],
  voyager2: [
    {
      mission: 'Voyager 2 Four-Giant-Planet Grand Tour & Interstellar Mission',
      agency: 'NASA / JPL Deep Space Network (Launched Aug 20, 1977 — 143+ AU)',
      vehicles: 'Voyager 2 Spacecraft (3.7m High-Gain Dish, 3 RTGs, Cosmic Ray & Low-Energy Charged Particle Instruments)',
      results: 'Executed the only 4-planet Grand Tour in history (Jupiter 1979, Saturn 1981, Uranus 1986, Neptune & Triton 1989), discovering 16 moons, Neptune\'s Great Dark Spot, and Triton\'s nitrogen geysers before crossing into interstellar space on Nov 5, 2018 at 119.7 AU.',
      probeLabel: '🪐 View Neptune (Visited 1989)',
      targetObjectId: 'Neptune (Sol System)'
    }
  ],
  parker: [
    {
      mission: 'Parker Solar Probe Perihelion 22 — Touching the Sun at 6.1M km',
      agency: 'NASA / Johns Hopkins APL (2018–Present)',
      vehicles: 'Parker Solar Probe (11.4 cm Carbon-Composite TPS Heat Shield, WISPR Imager, FIELDS, SWEAP Faraday Cup, ISOIS)',
      results: 'On Dec 24, 2024, flew within 6.1 million km (9.86 R☉) of the Sun\'s surface at 692,000 km/h (192 km/s); crossed inside the Alfvén critical surface into the magnetically dominated solar corona and traced the origin of magnetic "switchbacks" to photospheric supergranulation funnels.',
      probeLabel: '🌍 View Earth (1 AU Outward)',
      targetObjectId: 'Earth (Sol System)'
    }
  ],
  newhorizons: [
    {
      mission: 'New Horizons Pluto–Charon & Kuiper Belt Extended Mission (KEM)',
      agency: 'NASA / JHUAPL / SwRI (2006–Present — 61+ AU)',
      vehicles: 'New Horizons RTG Spacecraft (LORRI, Ralph/MVIC/LEISA, Alice UV, REX, SWAP, PEPSSI, SDC)',
      results: 'Transformed Pluto & Charon from fuzzy pixels into dynamic geological worlds (Sputnik Planitia glacier, cryovolcano Wright Mons), imaged pristine contact-binary planetesimal Arrokoth (2014 MU69) at 43.4 AU, and measures outer heliospheric pickup ions and cosmic optical background at 61+ AU.',
      probeLabel: '🪐 View Pluto (Visited 2015)',
      targetObjectId: 'Pluto (Dwarf Planet)'
    }
  ],
  cassini: [
    {
      mission: 'Cassini–Huygens 13-Year Saturn System Orbiter & Titan Landing',
      agency: 'NASA / ESA / ASI (1997–2017)',
      vehicles: 'Cassini Orbiter (12 Instruments, 3 RTGs) & ESA Huygens Titan Atmospheric Entry Lander',
      results: 'Completed 294 Saturn orbits, 162 targeted moon flybys, landed Huygens on Titan, sampled Enceladus\'s hydrothermal plumes (H₂, silica, organics), and plunged into Saturn\'s atmosphere on Sept 15, 2017 to protect Enceladus and Titan from biological contamination.',
      probeLabel: '🪐 View Saturn & Rings',
      targetObjectId: 'Saturn (Sol System)'
    }
  ],
  apollo_lm: [
    {
      mission: 'Apollo 11 Tranquility Base EVA & Lunar Laser Ranging Experiment',
      agency: 'NASA Manned Spacecraft Center (July 16–24, 1969)',
      vehicles: 'Saturn V SA-506, CSM-107 "Columbia" & LM-5 "Eagle"',
      results: 'First human footsteps on another celestial body; returned 21.55 kg of Mare Tranquillitatis ilmenite-rich basalt (dated to 3.7 billion years old) and deployed the Lunar Laser Ranging Retroreflector array that proves the Moon spirals away from Earth at 3.8 cm/year.',
      probeLabel: '🌕 View Moon (Luna)',
      targetObjectId: 'Moon / Luna (Earth Moon)'
    }
  ],
  perseverance: [
    {
      mission: 'Mars 2020 Perseverance Sample Caching & Ingenuity Aerial Scouting',
      agency: 'NASA / JPL (Landed Feb 18, 2021 — Jezero Crater)',
      vehicles: 'Perseverance Rover (PIXL, SHERLOC, SuperCam, MOXIE, RIMFAX) & Ingenuity 1.8-kg Coaxial Helicopter',
      results: 'Traversed the Jezero crater floor, sedimentary delta fan, and crater rim; discovered "leopard spot" iron-phosphate reduction rims in Cheyava Falls mudstone, generated breathable oxygen from Mars\'s CO₂ atmosphere via MOXIE, and flew Ingenuity 72 times over 17.0 km.',
      probeLabel: '🪐 View Mars Globe',
      targetObjectId: 'Mars (Sol System)'
    }
  ],
  gaia_kepler: [
    {
      mission: 'ESA Gaia DR3/DR4 Astrometric Census & NASA Kepler / TESS Exoplanet Surveys',
      agency: 'ESA (2013–2025) & NASA (Kepler 2009–2018, TESS 2018–Present)',
      vehicles: 'ESA Gaia (1-Gigapixel Focal Plane at L2), NASA Kepler (0.95m Photometer), NASA TESS (4 Wide-Field Cameras)',
      results: 'Gaia mapped 1.8+ billion stars in 3D phase space, uncovering ancient galactic mergers (Gaia-Enceladus) and dormant black holes; Kepler & TESS discovered 5,700+ transiting exoplanets, proving that small rocky worlds outnumber stars in the Milky Way.',
      probeLabel: '🛰️ Inspect JWST at L2',
      targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
    }
  ],
  seti_arecibo: [
    {
      mission: '1974 Arecibo Interstellar Radio Broadcast to Messier 13',
      agency: 'Cornell University / NAIC Arecibo Observatory (Frank Drake, Carl Sagan & Richard Isaacman — Nov 16, 1974)',
      vehicles: 'Arecibo 305-Meter Spherical Reflector Dish & 450 kW S-Band Radar Transmitter (2,380 MHz, 10 Hz FM Shift)',
      results: 'Transmitted 1,679 binary bits (73 × 23 semiprime grid) over 167.9 seconds at an effective isotropic radiated power of 20 terawatts—20 million times brighter than the Sun at 2,380 MHz—toward the 300,000 stars of Globular Cluster M13 in Hercules.',
      probeLabel: '📡 View Wow! Signal Locus',
      targetObjectId: 'SETI: The "Wow! Signal" Locus & Breakthrough Listen (Sagittarius)'
    }
  ],
  seti_wow: [
    {
      mission: '1977 OSU Big Ear "Wow! Signal" Detection & Breakthrough Listen Technosignature Survey',
      agency: 'Ohio State University Big Ear Observatory (Jerry Ehman, Aug 15, 1977) & Breakthrough Listen / SETI Institute',
      vehicles: 'OSU Big Ear Kraus-Type Radio Telescope (50-Channel Receiver), Green Bank 100m, Parkes 64m, MeerKAT & Allen Telescope Array',
      results: 'Recorded the 72-second narrowband signal "6EQUJ5" (30x background noise) at 1420.4556 MHz (within 50 kHz of the 21-cm neutral hydrogen hyperfine transition line); Breakthrough Listen and the Allen Telescope Array continue multi-petabyte wideband searches across 1,000,000 target stars.',
      probeLabel: '📡 View Arecibo M13 Target',
      targetObjectId: 'SETI: Arecibo Message & Globular Cluster M13 (Hercules — 22,200 ly)'
    }
  ],
  wasp39b: [
    {
      mission: 'JWST Transiting Exoplanet Community Early Release Science (JTEC ERS) Program',
      agency: 'NASA / ESA / CSA JWST ERS Team (300+ Astronomers — 2022–2024)',
      vehicles: 'James Webb Space Telescope (NIRSpec PRISM/G395H, NIRISS SOSS, NIRCam F322W2)',
      results: 'Obtained 0.5–5.5 micron transmission spectra across four JWST instruments: delivered the first unambiguous exoplanet detection of CO₂ (26σ significance) and photochemical SO₂ (produced by UV photodissociation of H₂S and H₂O), plus morning-vs-evening limb temperature asymmetry (200°C difference!).',
      probeLabel: '🛰️ Inspect JWST at L2',
      targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
    }
  ],
  k2_18b: [
    {
      mission: 'JWST Cycle 1 & 2 Habitable-Zone Sub-Neptune Spectroscopy (GO 2722 & 2372)',
      agency: 'NASA / ESA / CSA / University of Cambridge (Madhusudhan et al. 2023–2024) & Hubble / Kepler K2',
      vehicles: 'James Webb Space Telescope (NIRISS SOSS, NIRSpec G395H, MIRI LRS) & Hubble WFC3',
      results: 'Detected strong absorption features of methane (CH₄) and carbon dioxide (CO₂) at ~1% abundance with non-detection of ammonia (NH₃) and carbon monoxide (CO)—supporting a hydrogen-rich atmosphere above a habitable-zone ocean ("Hycean" world) and motivating deep follow-up of candidate dimethyl sulfide (DMS) features at 3.3 and 7–10 microns.',
      probeLabel: '🛰️ Inspect JWST at L2',
      targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
    }
  ]
};

// Retrieve structured Scientific Expeditions, Vehicles Sent, and Results for any selected world
export function getExpeditionsForWorld(planet) {
  if (!planet) return [];
  if (planet.isEarth) return SCIENTIFIC_EXPEDITIONS.earth;
  if (planet.stationPreset && SCIENTIFIC_EXPEDITIONS[planet.stationPreset]) {
    return SCIENTIFIC_EXPEDITIONS[planet.stationPreset];
  }
  if (planet.solarPreset && SCIENTIFIC_EXPEDITIONS[planet.solarPreset]) {
    return SCIENTIFIC_EXPEDITIONS[planet.solarPreset];
  }
  if (planet.mediaPreset && SCIENTIFIC_EXPEDITIONS[planet.mediaPreset]) {
    return SCIENTIFIC_EXPEDITIONS[planet.mediaPreset];
  }

  // Deep-Sky Objects
  if (planet.isDeepSky) {
    const dType = planet.deepSkyType || planet.bodyType;
    if (dType === 'black_hole') {
      if (planet.id.includes('Sagittarius A*') || planet.id.includes('M87*')) {
        return [
          {
            mission: 'Event Horizon Telescope (EHT) Global VLBI Interferometer',
            agency: 'EHT Collaboration (ALMA, SPT, IRAM, JCMT, SMA, SMT — 2017–2024)',
            vehicles: 'Earth-Sized Virtual Radio Telescope Array (1.3 mm wavelength) + Chandra X-Ray & GRAVITY/VLT',
            results: `Captured the first direct horizon-scale image of ${planet.id.split(' (')[0]}'s glowing photon ring and shadow, confirming Einstein's General Relativity in the strong-field regime and mapping polarized magnetic field spirals.`,
            probeLabel: '🛰️ Event Horizon Telescope',
            targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
          }
        ];
      }
      return [
        {
          mission: 'Chandra X-Ray, Uhuru, Gaia & VLBA Relativistic Jet Surveys',
          agency: 'NASA Chandra / ESA Gaia / NRAO VLBA',
          vehicles: 'Chandra X-Ray Space Observatory, ESA Gaia Astrometric Spacecraft, IXPE Polarimeter',
          results: `Measured relativistic X-ray accretion disk spectra, orbital dynamics, and black hole mass (${Number(planet.st_mass || 10).toLocaleString('en-US')} M☉) for ${planet.id}.`,
          probeLabel: '🛰️ Chandra & Gaia',
          targetObjectId: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)'
        }
      ];
    }
    if (dType === 'galaxy') {
      return [
        {
          mission: 'Hubble (HST), James Webb (JWST) & Gaia Extragalactic Surveys',
          agency: 'NASA / ESA / CSA (1990–Present)',
          vehicles: 'Hubble Space Telescope (ACS/WFC3), James Webb Space Telescope (NIRCam/MIRI), Spitzer & GALEX',
          results: `Resolved individual Cepheid variable stars, H-II star-forming knots, dust lanes, and 3D proper-motion kinematics across ${planet.id}, calibrating the cosmic distance scale (${Number(planet.distance).toLocaleString('en-US')} ly).`,
          probeLabel: '🛰️ JWST & Hubble',
          targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
        }
      ];
    }
    return [
      {
        mission: 'James Webb (JWST), Hubble & Chandra Deep-Sky Observatory Campaign',
        agency: 'NASA / ESA / CSA',
        vehicles: 'JWST (NIRCam / MIRI), Hubble Space Telescope, Chandra X-Ray Observatory',
        results: `Mapped ionized hydrogen/oxygen filaments, protoplanetary proplyds, and high-energy stellar winds inside ${planet.id} (${Number(planet.distance).toLocaleString('en-US')} ly).`,
        probeLabel: '🛰️ JWST & Hubble',
        targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
      }
    ];
  }

  // Famous multi-planet systems like TRAPPIST-1
  if ((planet.hostname || '').includes('TRAPPIST-1')) {
    return [
      {
        mission: 'JWST TRAPPIST-1 Atmospheric Reconnaissance & Spitzer Campaign',
        agency: 'NASA / ESA / CSA / ESO TRAPPIST (2016–Present)',
        vehicles: 'James Webb Space Telescope (MIRI & NIRSpec), Spitzer Space Telescope, TRAPPIST-South & VLT',
        results: 'Discovered 7 Earth-sized rocky worlds in a resonant chain (3 in the habitable zone); JWST MIRI thermal emission measurements constrained day-side temperatures (503 K on TRAPPIST-1b, 380 K on 1c) and probed for secondary CO2/water atmospheres.',
        probeLabel: '🛰️ JWST & Spitzer',
        targetObjectId: 'James Webb Space Telescope (JWST — Sun-Earth L2, 1.5M km)'
      }
    ];
  }

  // Popular Media systems fallback
  if (planet.isPopularMedia) {
    return [
      {
        mission: `Astronomical & Sci-Fi Reconnaissance of ${planet.hostname}`,
        agency: `Hipparcos / Gaia / JWST & ${planet.mediaFranchise || 'Popular Media Canon'}`,
        vehicles: 'ESA Hipparcos & Gaia Astrometric Satellites, Ground-Based Radial Velocity Spectrographs & Canon Starships',
        results: `${planet.description}`,
        probeLabel: '🛰️ Gaia & JWST Survey',
        targetObjectId: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)'
      }
    ];
  }

  // Standard NASA Exoplanet Archive worlds (Kepler, TESS, RV, Direct Imaging)
  const method = planet.discoverymethod || 'Transit / Radial Velocity';
  const year = planet.disc_year || 'Recent';
  const isKepler = (planet.id || '').startsWith('Kepler') || (planet.id || '').startsWith('K2');
  const isTess = (planet.id || '').startsWith('TOI') || (planet.id || '').startsWith('LHS');
  const vehicleName = isKepler
    ? 'NASA Kepler / K2 Space Telescope (0.95m Schmidt Photometer) & Keck Follow-up'
    : isTess
    ? 'NASA TESS Space Telescope (4 Wide-Field CCD Cameras) & JWST / ESPRESSO'
    : 'ESO HARPS / ESPRESSO, Keck HIRES, NASA TESS & ESA Gaia Space Observatory';

  return [
    {
      mission: `NASA Exoplanet Archive Discovery & Characterization (${year})`,
      agency: 'NASA / ESA / Ground-Based Observatory Network',
      vehicles: vehicleName,
      results: `Discovered in ${year} via ${method}. Measured an orbital period of ${planet.pl_orbper ?? '?'} days (${planet.pl_orbsmax ?? '?'} AU) around ${planet.hostname} (${planet.st_spectype || 'G/K/M Star'}, ${planet.distance} ly from Earth) with radius ${planet.pl_rade ?? '?'} R⊕ and equilibrium temperature ${planet.pl_eqt ?? '?'} K.`,
      probeLabel: isKepler ? '🛰️ Kepler Telescope' : isTess ? '🛰️ TESS Telescope' : '🛰️ Gaia / JWST Survey',
      targetObjectId: 'Gaia, Kepler & TESS Exoplanet Space Observatories (L2)'
    }
  ];
}

// Compute One-Way Radio Light-Time, Propulsion Travel Times & SETI / Observatory Telemetry
export function computeTelemetryAndTravelGuide(planet) {
  if (!planet || planet.isEarth) {
    const homeNote = 'Protected 1420–1720 MHz "Water Hole" radio band monitored by Green Bank, Allen Telescope Array (ATA), MeerKAT & FAST; space observatories in LEO (ISS 408 km, Hubble 535 km, Tiangong 390 km) and Sun-Earth L2 (JWST, Gaia, Euclid at 1.5M km).';
    return {
      lightDelayText: '0.00 sec (Home Ground Station — DSN Goldstone / Madrid / Canberra)',
      chemTimeText: '0 sec (Already on Earth)',
      voyagerTimeText: '0 sec (Already on Earth)',
      parkerTimeText: '0 sec (Already on Earth)',
      starshotTimeText: '0 sec (Already on Earth)',
      setiAndObsNote: homeNote,
      lightTime: '0.00 sec (Home Ground Station — DSN)',
      apolloTime: '0 sec (Home)',
      voyagerTime: '0 sec (Home)',
      parkerTime: '0 sec (Home)',
      starshotTime: '0 sec (Home)',
      setiStatus: homeNote
    };
  }

  const C_KM_S = 299792.458;
  const KM_PER_LY = 9.4607304725808e12;
  const distKm = (planet.isSolarSystem || planet.isSpaceMission) && planet.dist_km_from_earth
    ? Number(planet.dist_km_from_earth)
    : Number(planet.distance || 0) * KM_PER_LY;

  const formatDurationSec = sec => {
    if (!Number.isFinite(sec) || sec <= 0) return '< 1 ms';
    if (sec < 1.0) return `${(sec * 1000).toFixed(2)} ms`;
    if (sec < 60) return `${sec.toFixed(2)} sec`;
    if (sec < 3600) {
      const m = Math.floor(sec / 60);
      const s = Math.round(sec % 60);
      return `${m}m ${s}s`;
    }
    if (sec < 86400) {
      const h = Math.floor(sec / 3600);
      const m = Math.round((sec % 3600) / 60);
      return `${h}h ${m}m`;
    }
    const days = sec / 86400;
    if (days < 365.25) return `${days.toFixed(1)} days`;
    const years = days / 365.25;
    if (years < 1000) return `${years.toFixed(1)} yrs`;
    if (years < 1e6) return `${Math.round(years).toLocaleString('en-US')} yrs`;
    if (years < 1e9) return `${(years / 1e6).toFixed(2)}M yrs`;
    return `${(years / 1e9).toFixed(2)}B yrs`;
  };

  const lightSec = distKm / C_KM_S;
  const chemSec = distKm / 11.11;      // Apollo 10/11 translunar speed (~40,000 km/h = 11.11 km/s)
  const voyagerSec = distKm / 17.0;    // Voyager 1 interstellar cruise (17.0 km/s)
  const parkerSec = distKm / 192.2;    // Parker Solar Probe record perihelion (692,000 km/h = 192.2 km/s)
  const starshotSec = distKm / (0.20 * C_KM_S); // Breakthrough Starshot laser-sail (0.20c)

  let setiAndObsNote = 'Observed by ESA Gaia astrometry and NASA/ESA infrared & optical sky surveys.';
  if (planet.stationPreset === 'jwst' || planet.stationPreset === 'wasp39b' || planet.stationPreset === 'k2_18b') {
    setiAndObsNote = 'JWST 0.6–28 µm infrared transmission & thermal emission spectroscopy (NIRCam, NIRSpec, NIRISS, MIRI) detecting H₂O, CO₂, CH₄, and photochemical SO₂.';
  } else if (planet.stationPreset === 'seti_arecibo' || planet.stationPreset === 'seti_wow') {
    setiAndObsNote = 'Active & Passive SETI benchmark: 2,380 MHz S-band (1974 Arecibo 1,679-bit broadcast) & 1420.4556 MHz 21-cm Neutral Hydrogen Line (1977 "6EQUJ5" Wow! Signal & Breakthrough Listen).';
  } else if (planet.isSpaceMission) {
    setiAndObsNote = 'Tracked in real time by NASA\'s Deep Space Network (70m antennas at Goldstone, Madrid & Canberra) and Space Network TDRS satellites on S/X/Ka-band telemetry.';
  } else if (planet.isSolarSystem) {
    setiAndObsNote = 'Direct radar ranging, in-situ orbital/lander telemetry via NASA Deep Space Network (DSN), and high-resolution imaging by Hubble & JWST.';
  } else if (Number(planet.distance) <= 60) {
    setiAndObsNote = 'Priority nearby target (<60 ly) scanned by Breakthrough Listen (1–12 GHz radio & optical laser technosignatures), TESS, Gaia, and JWST atmospheric reconnaissance.';
  }

  const lightDelayText = formatDurationSec(lightSec);
  const chemTimeText = formatDurationSec(chemSec);
  const voyagerTimeText = formatDurationSec(voyagerSec);
  const parkerTimeText = formatDurationSec(parkerSec);
  const starshotTimeText = formatDurationSec(starshotSec);

  return {
    lightDelayText,
    chemTimeText,
    voyagerTimeText,
    parkerTimeText,
    starshotTimeText,
    setiAndObsNote,
    lightTime: lightDelayText,
    apolloTime: chemTimeText,
    voyagerTime: voyagerTimeText,
    parkerTime: parkerTimeText,
    starshotTime: starshotTimeText,
    setiStatus: setiAndObsNote
  };
}



