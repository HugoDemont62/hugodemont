import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);

// Position the camera further back and at an angle
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up PointerLockControls
const pointerControls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
  pointerControls.lock();
}, false);

scene.add(pointerControls.getObject());

// Set up OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.25;
orbitControls.screenSpacePanning = false;
orbitControls.maxPolarAngle = Math.PI / 2;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xeeffbe, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load the ground texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./public/th.jfif');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

// Create the ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const loader = new GLTFLoader();
let building, model, mixer;
const gui = new dat.GUI();
const options = {
  showBuilding: true,
  showModel: true
};

loader.load('./public/psx_building.glb', (gltf) => {
  building = gltf.scene;
  scene.add(building);
  building.position.set(0, 0, -3);

  const buildingBox = new THREE.BoxHelper(building, 0xff0000);
  scene.add(buildingBox);
}, undefined, (error) => {
  console.error('An error occurred while loading the building model:', error);
});

loader.load('./public/xander_model_character_man_rigged_realisitc.glb', (gltf) => {
  model = gltf.scene;
  scene.add(model);

  // Add collision box for the character model
  const modelBox = new THREE.BoxHelper(model, 0x00ff00);
  modelBox.update();
  scene.add(modelBox);

  // Center the collision box around the model
  const box = new THREE.Box3().setFromObject(model);
  const boxCenter = box.getCenter(new THREE.Vector3());
  modelBox.position.copy(boxCenter);

  // Remove animation setup
}, undefined, (error) => {
  console.error('An error occurred while loading the character model:', error);
});

// Add GUI controls
gui.add(options, 'showBuilding').name('Show Building').onChange((value) => {
  if (building) building.visible = value;
});
gui.add(options, 'showModel').name('Show Model').onChange((value) => {
  if (model) model.visible = value;
});

// Movement controls
const moveSpeed = 0.1;
const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyZ':
      move.forward = true;
      break;
    case 'KeyS':
      move.backward = true;
      break;
    case 'KeyQ':
      move.left = true;
      break;
    case 'KeyD':
      move.right = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyZ':
      move.forward = false;
      break;
    case 'KeyS':
      move.backward = false;
      break;
    case 'KeyQ':
      move.left = false;
      break;
    case 'KeyD':
      move.right = false;
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);

  if (move.forward) pointerControls.moveForward(moveSpeed);
  if (move.backward) pointerControls.moveForward(-moveSpeed);
  if (move.left) pointerControls.moveRight(-moveSpeed);
  if (move.right) pointerControls.moveRight(moveSpeed);

  orbitControls.update();
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}

animate();