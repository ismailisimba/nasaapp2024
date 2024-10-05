import * as THREE from './threen.js';
import { OrbitControls } from './OrbitControls.js';

let exoplanets = [];
let stars = [];
let starsPoints;
let geometry;
let material;
let selectedStars = [];
let constellationLines = [];

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.z = 1; // Adjust as needed

scene.background = new THREE.Color(0x000000); // Black background


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('starChartContainer').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Enable damping (inertia)
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Adjust zoom speed
controls.zoomSpeed = 0.5;

// Enable pan and rotate
controls.enablePan = true;
controls.enableRotate = true;

// Enable touch gestures
controls.touchPan = true;
controls.touchRotate = true;

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load exoplanet and star data
const promises = []
promises.push(fetch('planet_batch_1.json').then(response => response.json()))
promises.push(fetch('stars.json').then(response => response.json()))

const res = await Promise.all(promises)

exoplanets = res[0];
stars = res[1];

//console.log(exoplanets,'Exoplanets');
//console.log(stars,'Stars');
//console.log(res,'All');
console.log('Exoplanet and Star data loaded');
populateExoplanetSelect();




function populateExoplanetSelect() {
  const select = document.getElementById('exoplanetSelect');
  exoplanets.forEach(exoplanet => {
    const option = document.createElement('option');
    option.value = exoplanet.id;
    option.textContent = exoplanet.id;
    select.appendChild(option);
  });

  // Select the first exoplanet and update the star chart
  if (exoplanets.length > 0) {
    const firstExoplanet = exoplanets[0];
    select.value = firstExoplanet.id;
    updateStarChart(firstExoplanet);
  }
}

document.getElementById('exoplanetSelect').addEventListener('change', event => {
  const selectedExoplanetName = event.target.value;
  const selectedExoplanet = exoplanets.find(exo => exo.id === selectedExoplanetName);
  updateStarChart(selectedExoplanet);
});

function updateStarChart(selectedExoplanet) {
  // Clear previous stars and lines from the scene
  if (starsPoints) {
    scene.remove(starsPoints);
  }
  constellationLines.forEach(line => scene.remove(line));
  constellationLines = [];
  selectedStars = [];

  // Get the relative star positions
  console.log(selectedExoplanet,"selected")
  const relativeStars = getRelativeStarPositions(selectedExoplanet);

  // Project star positions onto a unit sphere
  const unitPositions = relativeStars.map(star => {
    const unitVector = star.position.clone().normalize();
    return {
      id: star.id,
      position: unitVector,
      vmag: star.vmag
    };
  });

  // Create the star points
  const positions = [];
  const sizes = [];
  const colors = [];

  unitPositions.forEach(star => {
    positions.push(star.position.x, star.position.y, star.position.z);
    // Set sizes based on magnitude
    const magnitudeScale = (6 - star.vmag) / 6; // Scale from 0 to 1
    sizes.push(magnitudeScale * 2); // Adjust size multiplier as needed
  
    // Set color based on magnitude (optional)
    const colorIntensity = magnitudeScale;
    colors.push(colorIntensity, colorIntensity, colorIntensity); // RGB values
  });
  
  
  

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  material = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    transparent: true,
    depthTest: false,
    size: 0.05
  });

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  material.vertexColors = true;

  starsPoints = new THREE.Points(geometry, material);
  scene.add(starsPoints);

  // Adjust camera
  camera.position.set(0, 0, 5);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

// Coordinate transformation functions
function sphericalToCartesian(raDeg, decDeg, distance) {
  const raRad = THREE.MathUtils.degToRad(raDeg);
  const decRad = THREE.MathUtils.degToRad(decDeg);
  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.cos(decRad) * Math.sin(raRad);
  const z = distance * Math.sin(decRad);
  return new THREE.Vector3(x, y, z);
}

function computeStarPosition(star) {
  // Extract RA and Dec in degrees
  const raDeg = star['RAJ2000'] || star['RAICRS'] || star['_RA_icrs'];
  const decDeg = star['DEJ2000'] || star['DEICRS'] || star['_DE_icrs'];

  // Convert RA and Dec to radians
  const raRad = THREE.MathUtils.degToRad(raDeg);
  const decRad = THREE.MathUtils.degToRad(decDeg);

  // Compute distance from parallax (Plx)
  const parallaxMas = star['Plx']; // in milliarcseconds
  if (parallaxMas > 0) {
    const parallaxArcsec = parallaxMas / 1000; // Convert to arcseconds
    const distanceParsec = 1 / parallaxArcsec; // Distance in parsecs

    // Convert distance to desired units (e.g., light-years)
    const distance = distanceParsec * 3.26156; // 1 parsec ≈ 3.26156 light-years

    // Compute Cartesian coordinates
    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);

    return new THREE.Vector3(x, y, z);
  } else {
    // Handle stars with invalid or missing parallax
    return null;
  }
}



function getRelativeStarPositions(exoplanet) {
  const exoPosition = sphericalToCartesian(exoplanet.ra, exoplanet.dec, exoplanet.distance);

  const relativeStars = stars
    .map(star => {
      const starPosition = computeStarPosition(star);
      if (!starPosition) {
        // If starPosition is null, skip this star
        return null;
      }
      const relativePosition = starPosition.clone().sub(exoPosition);
      return {
        id: star.id,
        position: relativePosition,
        vmag: star.vmag
      };
    })
    .filter(star => star !== null); // Remove null entries from the array
    console.log(relativeStars,"relativeStars")
  return relativeStars;
}


function cartesianToSpherical(vector) {
  const distance = vector.length();
  const raRad = Math.atan2(vector.y, vector.x);
  const decRad = Math.asin(vector.z / distance);
  return {
    ra: THREE.MathUtils.radToDeg(raRad),
    dec: THREE.MathUtils.radToDeg(decRad),
    distance: distance
  };
}

// User interaction for drawing constellations
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObject(starsPoints);

  if (intersects.length > 0) {
    const starIndex = intersects[0].index;
    // Handle star selection
    handleStarSelection(starIndex);
  }
}

function handleStarSelection(index) {
  selectedStars.push(index);

  if (selectedStars.length >= 2) {
    drawLineBetweenStars(selectedStars[selectedStars.length - 2], selectedStars[selectedStars.length - 1]);
  }
}

function drawLineBetweenStars(index1, index2) {
  const positionsArray = geometry.attributes.position.array;
  const start = new THREE.Vector3(
    positionsArray[index1 * 3],
    positionsArray[index1 * 3 + 1],
    positionsArray[index1 * 3 + 2]
  );
  const end = new THREE.Vector3(
    positionsArray[index2 * 3],
    positionsArray[index2 * 3 + 1],
    positionsArray[index2 * 3 + 2]
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  // Store the line for future reference
  constellationLines.push(line);
}

// Undo last line
document.getElementById('undoButton').addEventListener('click', () => {
  undoLastLine();
});

function undoLastLine() {
  if (constellationLines.length > 0) {
    const lastLine = constellationLines.pop();
    scene.remove(lastLine);
    // Remove the last two stars from selectedStars
    selectedStars.pop();
  }
}

// Save constellations
document.getElementById('saveButton').addEventListener('click', () => {
  saveConstellations();
});

function saveConstellations() {
  const data = {
    exoplanet: document.getElementById('exoplanetSelect').value,
    constellations: selectedStars
  };

  const dataStr = JSON.stringify(data);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'constellations.json';
  link.href = url;
  link.click();
}

// Export star chart as image
document.getElementById('exportButton').addEventListener('click', () => {
  exportStarChart();
});

function exportStarChart() {
  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'star_chart.png';
  link.href = dataURL;
  link.click();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
