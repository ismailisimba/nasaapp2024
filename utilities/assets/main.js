import * as THREE from './threen.js';
import { OrbitControls } from './OrbitControls.js';

let exoplanets = [];
let stars = [];
let starsGroup;
let exoplanetMesh;
let selectedStars = [];
let constellationLines = [];
let starOriginalColors = new Map(); // To store original colors
let starMeshes = []; // To keep track of star meshes

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

const initialCameraPosition = new THREE.Vector3(0, 0, 1);
const initialCameraTarget = new THREE.Vector3(0, 0, 0);


// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / (window.innerHeight-169), // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight-169);
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
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN
};

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load exoplanet and star data
const promises = [];
promises.push(fetch('planet_batch_1.json').then(response => response.json()));
//promises.push(fetch('http://localhost:3000/api/planets').then(response => response.json()))
promises.push(fetch('stars.json').then(response => response.json()));

Promise.all(promises).then(res => {
  exoplanets = res[0];
  stars = res[1];
  console.log('Exoplanet and Star data loaded');
  populateExoplanetSelect();
});

// Initialize camera position
//camera.position.set(0, 0, 1);
camera.position.copy(initialCameraPosition);
controls.target.copy(initialCameraTarget);
controls.update();

//camera.lookAt(new THREE.Vector3(0, 0, 0));

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
  // Clear previous stars, labels, and lines from the scene
  if (starsGroup) {
    scene.remove(starsGroup);
  }
  if (exoplanetMesh) {
    scene.remove(exoplanetMesh);
  }
  constellationLines.forEach(line => scene.remove(line));
  constellationLines = [];
  selectedStars = [];
  starOriginalColors.clear();
  starMeshes = [];

  // Get the relative star positions
  console.log(selectedExoplanet, "selected");
  const relativeStars = getRelativeStarPositions(selectedExoplanet);

  // Project star positions onto a unit sphere
  const unitPositions = relativeStars.map(star => {
    const unitVector = star.position.clone().normalize();
    return {
      id: star.id,
      position: unitVector,
      vmag: star.vmag,
      data: star.data
    };
  });

  // Compute min and max vmag for normalization
  let minVmag = Infinity;
  let maxVmag = -Infinity;
  unitPositions.forEach(star => {
    if (star.vmag !== undefined && !isNaN(star.vmag)) {
      if (star.vmag < minVmag) minVmag = star.vmag;
      if (star.vmag > maxVmag) maxVmag = star.vmag;
    }
  });

  // Define color stops for the gradient
  const colorStops = [
    { position: 0.0, color: new THREE.Color(0xffffff) }, // White
    { position: 0.33, color: new THREE.Color(0xffff00) }, // Yellow
    { position: 0.66, color: new THREE.Color(0xffa500) }, // Orange
    { position: 1.0, color: new THREE.Color(0x0000ff) }  // Blue
  ];

  // Function to interpolate colors
  function interpolateColor(t, colorStops) {
    for (let i = 0; i < colorStops.length - 1; i++) {
      const start = colorStops[i];
      const end = colorStops[i + 1];
      if (t >= start.position && t <= end.position) {
        const localT = (t - start.position) / (end.position - start.position);
        const color = start.color.clone().lerp(end.color, localT);
        return color;
      }
    }
    return colorStops[colorStops.length - 1].color.clone();
  }

  // Create the star spheres
  starsGroup = new THREE.Group();
  const starGeometry = new THREE.SphereGeometry(1, 8, 8); // Base geometry for stars

  unitPositions.forEach(star => {
    // Compute normalized vmag
    const normalizedVmag = (star.vmag - minVmag) / (maxVmag - minVmag);
    const t = 1 - normalizedVmag; // Invert to get from coldest/smallest to hottest/largest

    // Interpolate color
    const colorValue = interpolateColor(t, colorStops);

    // Set size based on magnitude
    const size = 0.005 + t * 0.05; // Adjust size multiplier as needed

    const starMaterial = new THREE.MeshPhongMaterial({
      color: colorValue,
      emissive: colorValue,
      emissiveIntensity: 1.0,
      shininess: 100,
      transparent: false,
      opacity: 1.0,
    });

    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.scale.set(size, size, size);
    starMesh.position.copy(star.position);
    starMesh.userData = {
      id: star.id,     // Store the star ID
      data: star.data, // Store the full star data
      originalColor: colorValue.clone() // Store the original color
    };

    // Store the original color in the map
    starOriginalColors.set(starMesh, colorValue.clone());

    starsGroup.add(starMesh);
    starMeshes.push(starMesh);
  });
  scene.add(starsGroup);

  // Add exoplanet at the center
  const exoplanetGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const exoplanetMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00, // Green color for the exoplanet
    emissive: new THREE.Color(0x00ff00),
    emissiveIntensity: 0.5,
    shininess: 50,
    transparent: false, // Opaque
    opacity: 1.0,
  });
  exoplanetMesh = new THREE.Mesh(exoplanetGeometry, exoplanetMaterial);
  exoplanetMesh.position.set(0, 0, 0);
  exoplanetMesh.userData = {
    id: selectedExoplanet.id,
    data: selectedExoplanet
  };
  scene.add(exoplanetMesh);

  // Adjust camera
  camera.position.set(0, 0, 1);
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

  // Ensure RA and Dec are numbers
  if (raDeg === undefined || decDeg === undefined) {
    return null;
  }

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
        vmag: star.vmag,
        data: star // Include full star data
      };
    })
    .filter(star => star !== null); // Remove null entries from the array

  console.log(`Total stars processed: ${relativeStars.length}`);
  return relativeStars;
}

// User interaction for selecting stars and exoplanet
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onMouseClick, false);
renderer.domElement.addEventListener('dblclick', onMouseDoubleClick, false);

function onMouseClick(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Set raycaster precision (adjust as needed)
  raycaster.params.Mesh.threshold = 0.1; // For small meshes

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(starsGroup.children.concat([exoplanetMesh]), true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    if (intersectedObject === exoplanetMesh) {
      // Exoplanet clicked
      showObjectDetails(intersectedObject.userData.data);
    } else {
      // Star clicked
      handleStarSelection(intersectedObject);
      showObjectDetails(intersectedObject.userData.data);

      // Highlight the clicked star
      highlightStar(intersectedObject);
    }
  }
}

function onMouseDoubleClick(event) {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(starsGroup.children);

  if (intersects.length > 0) {
    const starMesh = intersects[0].object;
    toggleStarDimming(starMesh);
  }
}

function highlightStar(starMesh) {
  // Change the material color to highlight color
  starMesh.material.color.set(0x00ffff); // Bright cyan color
  starMesh.material.emissive.set(0x00ffff);
}

function handleStarSelection(starMesh) {
  selectedStars.push(starMesh);

  if (selectedStars.length >= 2) {
    drawLineBetweenStars(selectedStars[selectedStars.length - 2], selectedStars[selectedStars.length - 1]);
  }
}

function drawLineBetweenStars(starMesh1, starMesh2) {
  const start = starMesh1.position;
  const end = starMesh2.position;

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([start.clone(), end.clone()]);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  // Store the line for future reference
  constellationLines.push(line);
}

function toggleStarDimming(starMesh) {
  if (!starMesh.userData.isDimmed) {
    // Dim the star to dark grey
    starMesh.material.color.set(0x555555);
    starMesh.material.emissive.set(0x555555);
    starMesh.userData.isDimmed = true;
  } else {
    // Restore original color
    const originalColor = starOriginalColors.get(starMesh);
    starMesh.material.color.copy(originalColor);
    starMesh.material.emissive.copy(originalColor);
    starMesh.userData.isDimmed = false;
  }
}

// Function to dim or undim all stars
function toggleAllStarsDimming() {
  starMeshes.forEach(starMesh => {
    toggleStarDimming(starMesh);
  });
}

// Function to display object details in a popup
function showObjectDetails(data) {
  // Create a popup div
  let popup = document.getElementById('popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'absolute';
    popup.style.top = '10px';
    popup.style.right = '10px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.maxWidth = '300px';
    popup.style.zIndex = '100';
    document.body.appendChild(popup);
  }

  // Populate popup with data
  popup.innerHTML = '<h3>Object Details</h3>';
  for (const key in data) {
    popup.innerHTML += `<strong>${key}:</strong> ${data[key]}<br/>`;
  }

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.onclick = () => {
    popup.style.display = 'none';
  };
  popup.appendChild(closeButton);

  // Show the popup
  popup.style.display = 'block';
}

// Add button to download all data
const downloadDataButton = document.getElementById('downloadDataButton');
downloadDataButton.addEventListener('click', () => {
  downloadData();
});

function downloadData() {
  const data = {
    exoplanets: exoplanets,
    stars: stars
  };

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'star_and_exoplanet_data.json';
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

// Undo last line
document.getElementById('undoButton').addEventListener('click', () => {
  undoLastLine();
});

function undoLastLine() {
  if (constellationLines.length > 0) {
    const lastLine = constellationLines.pop();
    scene.remove(lastLine);
    // Remove the last selected star
    selectedStars.pop();
    selectedStars.pop(); // Remove the previous star to reset constellation feature
  }
}

// Save constellations
document.getElementById('saveConstellationsButton').addEventListener('click', () => {
  saveConstellations();
});

function saveConstellations() {
  const constellationData = selectedStars.map(starMesh => starMesh.userData.id);
  const data = {
    exoplanet: document.getElementById('exoplanetSelect').value,
    constellations: constellationData
  };

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'constellations.json';
  link.href = url;
  link.click();
}

// Dim or undim all stars
document.getElementById('toggleAllStarsButton').addEventListener('click', () => {
  toggleAllStarsDimming();
});

document.getElementById('resetCameraButton').addEventListener('click', () => {
  resetCamera();
});

function resetCamera() {
  // Reset camera position and target
  camera.position.copy(initialCameraPosition);
  controls.target.copy(initialCameraTarget);
  controls.update(); // Update controls to reflect the changes
}


// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}
animate();
