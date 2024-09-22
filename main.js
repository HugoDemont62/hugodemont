import './style.css';
import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth damping
controls.dampingFactor = 0.25; // Damping factor
controls.screenSpacePanning = false; // Do not allow panning in screen space
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

// Set up dat.GUI
const gui = new GUI();

// Load the 3D model
const loader = new OBJLoader();
loader.load('./public/2016 ork.obj', (object) => {
  let meshIndex = 0;
  object.traverse((child) => {
    if (child.isMesh) {
      // Assign a random RGB color to each mesh
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      child.material = new THREE.MeshBasicMaterial({color});

      // Add the mesh to the GUI
      const folder = gui.addFolder(`Mesh ${meshIndex}`);
      folder.addColor({ color: `#${color.getHexString()}` }, 'color').onChange((value) => {
        child.material.color.set(value);
      });
      folder.open();
      meshIndex++;
    }
  });

  scene.add(object);
  object.position.set(0, 0, 0);
  camera.position.z = 5;
}, undefined, (error) => {
  console.error(error);
});

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

animate();