const fs = require('fs');
const path = require('path');

const PARSEC_TO_LY = 3.26156;
const AU_PER_PARSEC = 206264.806;

// Set of all HIP IDs used in IAU constellation stick figures & named stars
// so they are always retained regardless of magnitude cutoffs
const CONSTELLATION_HIP_IDS = new Set([
  "32349","30438","71683","71681","70890","69673","91262","24608","24436","37279",
  "7588","27989","68702","97649","60718","21421","80763","65474","37826","113368",
  "102098","62434","49669","33579","36850","61084","85927","25336","25428","45238",
  "26311","26727","25930","27366","109268","62956","54061","53910","58001","59774",
  "65378","67301","11767","72607","75097","3179","746","4427","6686","8886",
  "15863","14576","9884","677","5447","9640","113963","113881","1067","107315",
  "95947","100453","97278","102488","87833","3419","90185","92855","76267","86032",
  "57632","50583","41037","45556","34444","30324","35904","85822","82080","77055",
  "79822","91971","92791","93194","92420","98036","95501","93747","99473","20889",
  "20205","20455","26451","32246","30343","35550","31681","28360","28380","23015",
  "49583","50335","47908","54872","61941","63608","60129","57757","66249","69701",
  "72105","74666","71075","69713","78820","78401","78265","81266","82396","82514",
  "84143","86228","86670","89931","88635","90496","93506","59747","66657","68933",
  "71352","61932","50099","36188","112158","2912","13268","17358","18532"
]);

class utilities {
  constructor() {
    this.fetchAndConvertCSV = fetchAndConvertCSV;
    this.fetchAndConvertTSV = fetchAndConvertTSV;
  }
}

function parseNum(val) {
  if (val === undefined || val === null) return null;
  const trimmed = String(val).trim();
  if (!trimmed || trimmed === 'null' || trimmed.startsWith('--')) return null;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : null;
}

function estimateRadiusFromMass(massEarth) {
  if (!massEarth || massEarth <= 0) return 1.5;
  if (massEarth < 2.0) return Math.pow(massEarth, 0.28);
  if (massEarth < 130.0) return 1.21 * Math.pow(massEarth / 2.0, 0.59);
  return 11.2 * Math.pow(massEarth / 317.8, -0.04);
}

function estimateTeffFromSpecType(specType) {
  if (!specType) return 5500;
  const s = specType.trim().toUpperCase();
  if (s.startsWith('O')) return 32000;
  if (s.startsWith('B')) return 16000;
  if (s.startsWith('A')) return 8500;
  if (s.startsWith('F')) return 6500;
  if (s.startsWith('G')) return 5600;
  if (s.startsWith('K')) return 4400;
  if (s.startsWith('M')) return 3200;
  if (s.startsWith('L') || s.startsWith('T') || s.startsWith('Y')) return 1800;
  return 5500;
}

async function fetchAndConvertCSV() {
  try {
    const filePath = path.resolve(__dirname, './assets/planet_batch_1.csv');
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.split(/\r?\n/);

    let headerIndex = 0;
    while (headerIndex < lines.length && (lines[headerIndex].startsWith('#') || lines[headerIndex].trim() === '')) {
      headerIndex++;
    }

    const headers = lines[headerIndex].split('\t')[0].split(',').map(h => h.trim());
    const dataLines = lines.slice(headerIndex + 1);
    const idx = {};
    headers.forEach((h, i) => { idx[h] = i; });

    // Load Solar System planets, major moons, Popular Media systems & Deep-Sky Objects from constellations_data.js
    const constModUrl = 'file://' + path.resolve(__dirname, './assets/constellations_data.js').replace(/\\/g, '/');
    const { SOLAR_SYSTEM_BODIES, POPULAR_MEDIA_SYSTEMS, DEEP_SKY_OBJECTS } = await import(constModUrl);

    const planetMap = new Map();

    // 1. Prepend all Solar System Planets & Moons (Earth first, then Moon, Mercury..Neptune, Pluto, Io, Europa, Titan, etc.)
    const earthBody = SOLAR_SYSTEM_BODIES[0];
    for (const body of SOLAR_SYSTEM_BODIES) {
      const dxAu = body.x_au - earthBody.x_au;
      const dyAu = body.y_au - earthBody.y_au;
      const dzAu = body.z_au - earthBody.z_au;
      const distAuFromEarth = Math.hypot(dxAu, dyAu, dzAu);

      let raDeg = 0;
      let decDeg = 0;
      if (distAuFromEarth > 0) {
        raDeg = ((Math.atan2(dyAu, dxAu) * 180) / Math.PI + 360) % 360;
        decDeg = (Math.asin(Math.max(-1, Math.min(1, dzAu / distAuFromEarth))) * 180) / Math.PI;
      }

      const distPc = distAuFromEarth / AU_PER_PARSEC;
      const distLy = distPc * PARSEC_TO_LY;

      planetMap.set(body.id, {
        ...body,
        ra: Number(raDeg.toFixed(5)),
        dec: Number(decDeg.toFixed(5)),
        dist_pc: Number(distPc.toExponential(4)),
        distance: Number(distLy.toExponential(4)),
        dist_au_from_earth: Number(distAuFromEarth.toFixed(5)),
        vmag: body.isEarth ? -26.74 : -2.0,
        sy_snum: 1,
        sy_pnum: 8
      });
    }

    // 1b. Prepend Popular Media & Iconic Systems (Project Hail Mary, Star Trek, Avatar, Three-Body Problem, Dune, Interstellar, The Expanse, etc.)
    for (const mediaSys of POPULAR_MEDIA_SYSTEMS) {
      planetMap.set(mediaSys.id, {
        ...mediaSys,
        sy_snum: 1,
        sy_pnum: mediaSys.moons ? Math.max(1, mediaSys.moons.length) : 1
      });
    }

    // 1c. Prepend Curated Deep-Sky Cosmic Objects (Black Holes, Galaxies, Nebulae, Pulsars, Star Clusters)
    for (const dso of DEEP_SKY_OBJECTS) {
      planetMap.set(dso.id, {
        ...dso,
        sy_snum: 1,
        sy_pnum: dso.moons ? dso.moons.length : 1
      });
    }

    // 2. Parse NASA Exoplanet Archive CSV rows
    for (const line of dataLines) {
      if (!line.trim()) continue;
      const values = line.split('\t')[0].split(',');
      const plName = (values[idx['pl_name']] || '').trim();
      const hostName = (values[idx['hostname']] || '').trim();
      if (!plName || !hostName) continue;

      const ra = parseNum(values[idx['ra']]);
      const dec = parseNum(values[idx['dec']]);
      const syDistPc = parseNum(values[idx['sy_dist']]);
      if (ra === null || dec === null || syDistPc === null || syDistPc <= 0) continue;

      const vmag = parseNum(values[idx['sy_vmag']]) ??
                   parseNum(values[idx['sy_gaiamag']]) ??
                   parseNum(values[idx['sy_kmag']]) ?? 12.0;

      const row = {
        id: plName,
        pl_name: plName,
        hostname: hostName,
        ra,
        dec,
        dist_pc: Number(syDistPc.toFixed(4)),
        distance: Number((syDistPc * PARSEC_TO_LY).toFixed(4)),
        vmag: Number(vmag.toFixed(3)),
        pl_rade: parseNum(values[idx['pl_rade']]),
        pl_radj: parseNum(values[idx['pl_radj']]),
        pl_bmasse: parseNum(values[idx['pl_bmasse']]),
        pl_bmassj: parseNum(values[idx['pl_bmassj']]),
        pl_orbper: parseNum(values[idx['pl_orbper']]),
        pl_orbsmax: parseNum(values[idx['pl_orbsmax']]),
        pl_orbeccen: parseNum(values[idx['pl_orbeccen']]),
        pl_eqt: parseNum(values[idx['pl_eqt']]),
        pl_insol: parseNum(values[idx['pl_insol']]),
        discoverymethod: (values[idx['discoverymethod']] || '').trim() || null,
        disc_year: parseNum(values[idx['disc_year']]),
        disc_facility: (values[idx['disc_facility']] || '').trim() || null,
        st_spectype: (values[idx['st_spectype']] || '').trim() || null,
        st_teff: parseNum(values[idx['st_teff']]),
        st_rad: parseNum(values[idx['st_rad']]),
        st_mass: parseNum(values[idx['st_mass']]),
        st_logg: parseNum(values[idx['st_logg']]),
        sy_snum: parseNum(values[idx['sy_snum']]) || 1,
        sy_pnum: parseNum(values[idx['sy_pnum']]) || 1
      };

      if (!planetMap.has(plName)) {
        planetMap.set(plName, row);
      } else {
        const existing = planetMap.get(plName);
        for (const key of Object.keys(row)) {
          if ((existing[key] === null || existing[key] === undefined) && row[key] !== null && row[key] !== undefined) {
            existing[key] = row[key];
          }
        }
      }
    }

    // Enrich missing derived physical quantities so every planet renders accurately
    const jsonData = [];
    for (const p of planetMap.values()) {
      if (!p.isSolarSystem && !p.isDeepSky) {
        if (p.pl_rade === null && p.pl_radj !== null) {
          p.pl_rade = Number((p.pl_radj * 11.209).toFixed(3));
        }
        if (p.pl_bmasse === null && p.pl_bmassj !== null) {
          p.pl_bmasse = Number((p.pl_bmassj * 317.828).toFixed(3));
        }
        if (p.pl_rade === null) {
          p.pl_rade = Number(estimateRadiusFromMass(p.pl_bmasse).toFixed(3));
        }
        if (p.pl_radj === null && p.pl_rade !== null) {
          p.pl_radj = Number((p.pl_rade / 11.209).toFixed(3));
        }
        if (p.st_teff === null) {
          p.st_teff = estimateTeffFromSpecType(p.st_spectype);
        }
        if (p.st_rad === null) {
          p.st_rad = 1.0;
        }
        if (p.st_mass === null) {
          p.st_mass = 1.0;
        }
        if (p.pl_orbsmax === null && p.pl_orbper !== null && p.pl_orbper > 0) {
          p.pl_orbsmax = Number(Math.pow(p.st_mass * Math.pow(p.pl_orbper / 365.25, 2), 1 / 3).toFixed(4));
        }
        if (p.pl_eqt === null) {
          const a = p.pl_orbsmax && p.pl_orbsmax > 0 ? p.pl_orbsmax : 0.5;
          const rStarAu = p.st_rad * 0.00465047;
          const eqt = p.st_teff * Math.sqrt(rStarAu / (2 * a)) * Math.pow(1 - 0.3, 0.25);
          p.pl_eqt = Math.round(Math.max(40, Math.min(4000, eqt)));
        }
      }
      jsonData.push(p);
    }

    const jsonFilePath = path.resolve(__dirname, './assets/planet_batch_1.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));
    console.log(`Saved ${jsonData.length} worlds (Solar System planets, moons + exoplanets) to ${jsonFilePath}`);
    return jsonData;
  } catch (error) {
    console.error('Error fetching and converting CSV:', error);
    throw error;
  }
}

async function fetchAndConvertTSV() {
  try {
    const filePath = path.resolve(__dirname, './assets/asu.tsv');
    const tsvData = fs.readFileSync(filePath, 'utf-8');
    const lines = tsvData.split(/\r?\n/);

    let headerIndex = 0;
    while (headerIndex < lines.length && (lines[headerIndex].startsWith('#') || lines[headerIndex].trim() === '')) {
      headerIndex++;
    }

    const headers = lines[headerIndex].split('\t').map(h => h.trim());
    let startRow = headerIndex + 1;
    while (startRow < lines.length && (lines[startRow].includes('---') || lines[startRow].startsWith('deg'))) {
      startRow++;
    }

    const dataLines = lines.slice(startRow);
    const idx = {};
    headers.forEach((h, i) => { idx[h] = i; });

    const jsonData = [];

    // 1. Add Sol (Our Sun) at (0,0,0) so it appears as a star from every exoplanet and Solar System body
    jsonData.push({
      id: 'SUN',
      vmag: -26.74,
      absMag: 4.83,
      Plx: 100000,
      B_V: 0.656,
      RAJ2000: 0,
      DEJ2000: 0,
      isSun: true
    });

    for (const line of dataLines) {
      if (!line.trim()) continue;
      const values = line.split('\t');

      const hipRaw = values[idx['HIP']];
      if (!hipRaw) continue;
      const id = hipRaw.trim();
      if (!id) continue;

      const vmag = parseNum(values[idx['Vmag']]);
      const ra = parseNum(values[idx['_RAJ2000']]) ?? parseNum(values[idx['RAICRS']]) ?? parseNum(values[idx['_RA.icrs']]);
      const dec = parseNum(values[idx['_DEJ2000']]) ?? parseNum(values[idx['DEICRS']]) ?? parseNum(values[idx['_DE.icrs']]);
      let plx = parseNum(values[idx['Plx']]);
      const bv = parseNum(values[idx['B-V']]) ?? 0.65;

      if (vmag === null || ra === null || dec === null) continue;

      const isConstellationStar = CONSTELLATION_HIP_IDS.has(id);

      if (plx === null || plx <= 0.25) {
        if (vmag <= 6.5 || isConstellationStar) {
          plx = 0.5;
        } else {
          continue;
        }
      }

      const distPc = 1000.0 / plx;
      const absMag = vmag - 5 * Math.log10(distPc) + 5;

      if (vmag <= 6.5 || isConstellationStar || (absMag <= 0.0 && vmag <= 8.2)) {
        jsonData.push({
          id,
          vmag: Number(vmag.toFixed(2)),
          absMag: Number(absMag.toFixed(2)),
          Plx: Number(plx.toFixed(2)),
          B_V: Number(bv.toFixed(3)),
          RAJ2000: Number(ra.toFixed(6)),
          DEJ2000: Number(dec.toFixed(6))
        });
      }
    }

    const jsonFilePath = path.resolve(__dirname, './assets/stars.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));
    console.log(`Saved ${jsonData.length} stars to ${jsonFilePath}`);
    return jsonData;
  } catch (error) {
    console.error('Error fetching and converting TSV:', error);
    throw error;
  }
}

module.exports = utilities;
