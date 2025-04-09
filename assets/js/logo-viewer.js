// Logo Viewer Script using Three.js

// Ensure Three.js and OrbitControls are loaded before this script runs
if (typeof THREE === "undefined") {
  console.error(
    "THREE.js is not loaded. Make sure it is included before logo-viewer.js"
  );
}
if (typeof THREE.OrbitControls === "undefined") {
  console.error(
    "OrbitControls.js is not loaded. Make sure it is included before logo-viewer.js"
  );
}

const LogoViewer = (() => {
  // --- Configuration ---
  const CONTAINER_ID = "logo-viewer-container"; // ID of the container div in index.html
  const AUTO_ROTATE_SPEED = 0.005; // Speed of auto-rotation (radians per frame)
  const IDLE_TIMEOUT = 3000; // Time in ms before resuming auto-rotation after interaction

  // --- Three.js Variables ---
  let scene, camera, renderer, controls;
  let voxelMesh; // The group containing all voxels
  let container;
  let isInteracting = false;
  let idleTimer = null;
  let animationFrameId = null; // To store the requestAnimationFrame ID

  // --- Voxel Data (copied from voxel_logo_viewer.html) ---
  // This represents a 3D voxel structure where:
  // - True = filled voxel, False = empty space
  const voxelData = [
    [
      [false, false, false, false, false, false],
      [false, false, true, true, false, false],
      [true, false, true, true, false, true],
      [true, false, true, true, false, true],
      [true, false, true, true, false, true],
      [false, false, true, true, false, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, false, false, true, false],
      [true, true, false, false, true, true],
      [false, false, false, false, false, false],
      [true, true, false, false, true, true],
      [false, true, false, false, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, false, false, true, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [true, true, false, false, true, true],
      [false, true, false, false, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, false, false, true, false],
      [true, true, false, false, true, true],
      [true, true, false, false, true, true],
      [true, true, false, false, true, true],
      [false, true, false, false, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, true, true, true, false],
      [true, true, false, false, true, true],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, true, true, true, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, false, false, true, false],
      [true, true, false, false, true, true],
      [false, false, false, false, false, false],
      [true, false, false, false, false, true],
      [false, true, false, false, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, true, false, false, true, false],
      [true, true, false, false, true, true],
      [true, false, false, false, false, true],
      [true, true, false, false, true, true],
      [false, true, false, false, true, false],
    ],
    [
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
      [false, false, false, false, false, false],
    ],
  ];

  // --- Initialization ---
  function init() {
    container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.error(`Container element with ID "${CONTAINER_ID}" not found.`);
      return;
    }

    // Scene
    scene = new THREE.Scene();
    scene.background = null; // Make background transparent to show hero gradient

    // Camera
    camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 8); // Adjusted initial position for hero view
    camera.lookAt(0, 0, 0); // Look at the center of the model group

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high-DPI screens
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    const d = 10;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    scene.add(directionalLight);

    // Controls (OrbitControls for mouse drag)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false; // Disable panning
    controls.enableZoom = false; // Disable zooming
    controls.target.set(0, 0, 0); // Target the center of the model group
    controls.minPolarAngle = Math.PI / 4; // Limit vertical rotation slightly
    controls.maxPolarAngle = (3 * Math.PI) / 4; // Limit vertical rotation slightly
    controls.autoRotate = false; // We handle auto-rotation manually

    // Create Voxel Model
    createVoxelModel();

    // Event Listeners
    window.addEventListener("resize", onWindowResize);
    renderer.domElement.addEventListener("pointerdown", onInteractionStart);
    renderer.domElement.addEventListener("pointerup", onInteractionEnd);
    // Also listen for touch events for mobile
    renderer.domElement.addEventListener("touchstart", onInteractionStart, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchend", onInteractionEnd);

    // Start Animation Loop
    animate();
  }

  // --- Create Voxel Model ---
  function createVoxelModel() {
    const voxelGroup = new THREE.Group();
    scene.add(voxelGroup);

    const voxelMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0522d, // Brick red-brown color
      roughness: 0.7,
      metalness: 0.1,
      envMapIntensity: 0.5,
    });

    const voxelGeometry = new THREE.BoxGeometry(0.95, 0.95, 0.95); // Slightly smaller for spacing

    // Calculate bounding box center *before* creating meshes
    const tempGroup = new THREE.Group();
    for (let z = 0; z < voxelData.length; z++) {
      for (let y = 0; y < voxelData[z].length; y++) {
        for (let x = 0; x < voxelData[z][y].length; x++) {
          if (voxelData[z][y][x]) {
            // Use a temporary geometry/position to calculate bounds
            const tempPos = new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5);
            const tempMesh = new THREE.Mesh(voxelGeometry); // Use shared geometry for calc
            tempMesh.position.copy(tempPos);
            tempGroup.add(tempMesh);
          }
        }
      }
    }
    const box = new THREE.Box3().setFromObject(tempGroup);
    const center = box.getCenter(new THREE.Vector3());

    // Now create the actual voxels, offsetting by the calculated center
    for (let z = 0; z < voxelData.length; z++) {
      for (let y = 0; y < voxelData[z].length; y++) {
        for (let x = 0; x < voxelData[z][y].length; x++) {
          if (voxelData[z][y][x]) {
            const voxel = new THREE.Mesh(voxelGeometry, voxelMaterial.clone());
            // Offset position by center during creation
            voxel.position.set(
              x + 0.5 - center.x,
              y + 0.5 - center.y,
              z + 0.5 - center.z
            );
            voxel.castShadow = true;
            voxel.receiveShadow = true;
            voxelGroup.add(voxel); // Add centered voxel to the main group
          }
        }
      }
    }

    // Group's position remains at (0,0,0), geometry is now centered within it.
    voxelMesh = voxelGroup;
  }

  // --- Event Handlers ---
  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function onInteractionStart() {
    isInteracting = true;
    if (idleTimer) clearTimeout(idleTimer); // Clear existing timer
  }

  function onInteractionEnd() {
    // Use a timeout to delay setting isInteracting back to false
    // This prevents immediate resumption of auto-rotate if the user just finished dragging
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isInteracting = false;
      idleTimer = null;
    }, IDLE_TIMEOUT);
  }

  // --- Animation Loop ---
  function animate() {
    animationFrameId = requestAnimationFrame(animate); // Store the ID

    controls.update(); // Required if enableDamping is true

    // Auto-rotate if not interacting
    if (voxelMesh && !isInteracting) {
      voxelMesh.rotation.y += AUTO_ROTATE_SPEED;
    }

    renderer.render(scene, camera);
  }

  // --- Cleanup ---
  function dispose() {
    console.log("Disposing Logo Viewer...");
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener("resize", onWindowResize);
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener(
        "pointerdown",
        onInteractionStart
      );
      renderer.domElement.removeEventListener("pointerup", onInteractionEnd);
      renderer.domElement.removeEventListener("touchstart", onInteractionStart);
      renderer.domElement.removeEventListener("touchend", onInteractionEnd);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }
    if (controls) {
      controls.dispose();
    }
    if (renderer) {
      renderer.dispose();
    }
    if (scene) {
      // Dispose geometries, materials, textures
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    // Clear variables
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    voxelMesh = null;
    container = null;
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = null;
    isInteracting = false;
    animationFrameId = null;
  }

  // --- Public API ---
  return {
    init: init,
    dispose: dispose, // Expose dispose function for cleanup if needed
  };
})();

// --- Initialize on DOMContentLoaded ---
// Ensure the container element exists before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Check if the container exists before initializing
  if (document.getElementById("logo-viewer-container")) {
    LogoViewer.init();
  } else {
    console.warn(
      "Logo viewer container not found on DOMContentLoaded. Initialization skipped."
    );
    // Optionally, set up a MutationObserver to initialize if the container is added later
  }
});
