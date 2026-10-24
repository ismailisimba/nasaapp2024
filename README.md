---
title: Nasa24
emoji: 🏆
colorFrom: blue
colorTo: gray
sdk: docker
pinned: false
---

# 🌌 ExoSky — 8-Quadrant 3D Star Chart, Entire Star Systems & Deep-Sky Explorer

Interactive 3D celestial observatory and exoplanet star chart built with **Three.js**, **WebGL GLSL Shaders**, and **Node.js / Express**.

## Key Features
- **🧭 8-Quadrant Planetary Sky Division (`Q1`–`Q8`)**: Divide Earth, every Solar System planet/moon, and 5,740+ NASA Exoplanets into 8 geographic octants (`N-W1`, `N-W2`, `N-E1`, `N-E2`, `S-W1`, `S-W2`, `S-E1`, `S-E2`) with local horizon, compass bearings (`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`), and 23 IAU constellation stick figures.
- **🔭 Sky Observatory Optical Zoom (`FOV 90°` to `8°` — up to `8.1×` Magnification)**: Smooth mouse-wheel zoom, two-finger touch pinch-to-zoom, and on-screen `#skyZoomHud` controls with dynamic label scaling and progressive magnitude-based star label reveal.
- **☀️ 3 Interactive View Modes**:
  1. **🌌 Sky Observatory**: First-person local horizon dome with Earth Horizon Beacon (`🌍 EARTH: <Distance>`), Solar System sky markers, and Deep-Sky cosmic markers.
  2. **🪐 Up-Close 3D Inspector**: Procedural GLSL planetary shaders, accurate Earth continents (`EARTH_CONTINENT_POLYGONS`), animated 3D moons, ring systems, and interactive 3D orbiting spacecraft probes (`🛰️`).
  3. **☀️ Entire Star System**: Full multi-planet 3D Keplerian Orrery (`Sol`, `TRAPPIST-1`, `Tau Ceti`, `40 Eridani A`, `Alpha Centauri`, `Kepler-90`, `55 Cancri`, etc.) with Habitable Zone ring.
- **🎬 20 Popular Media & Iconic Star Systems**: Explore worlds from *Project Hail Mary* (`Tau Ceti e — "Adrian"`, `40 Eridani A b — "Erid"`), *Star Trek* (`Vulcan`, `Andoria`, `Qo'noS`, `Risa`, `Wolf 359c`), *Avatar* (`Pandora`), *The Three-Body Problem* (`Trisolaris`), *Dune* (`Arrakis`, `Caladan`), *Interstellar* (`Gargantua & Miller's Planet`), *The Expanse* (`Ceres Station`, `Ilus`), *Alien* (`LV-426`), *Halo* (`Reach`), *Star Wars* (`Kepler-16b — "Tatooine"`), `Alpha Centauri A & B`, `Proxima Centauri b`, and `Sirius A & B`.
- **🕳️ 22 Deep-Sky & Exotic Cosmic Objects**: Black holes (`Sagittarius A*`, `M87*`, `Cygnus X-1`, `Gaia BH1`, `TON 618`, `Gargantua`), galaxies (`Andromeda M31`, `Triangulum M33`, `Whirlpool M51`, `Sombrero M104`, `Centaurus A`), nebulae, pulsars, and star clusters.
- **🚀 Scientific Expeditions, Vehicles & Results**: Detailed mission history, vehicles sent, and scientific discoveries for every world (`Apollo`, `Voyager 1 & 2`, `Cassini–Huygens`, `Juno`, `Perseverance & Ingenuity`, `Curiosity`, `Dawn`, `New Horizons`, `Event Horizon Telescope`, `JWST`, `Kepler`, `TESS`, `HARPS`, `Gaia`).

## Running Locally
```bash
npm install
npm start
# Open http://localhost:7860
```
