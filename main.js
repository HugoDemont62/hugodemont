import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import GravityObject from './components/gravityObject.js';
import { move, setupControls } from './components/controls.js';
import { setupLighting } from './components/lighting.js';
import { createGround } from './components/ground.js';
import { setupStats } from './components/stats.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

let cameraOffset = new THREE.Vector3(1.5, 3, -5);
let targetCameraRotation = new THREE.Vector2();
let distanceFromPlayer = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

setupLighting(scene);
createGround(scene);

const loader = new GLTFLoader();
let gravityObjects = [];
loader.load('./public/xander_model_character_man_rigged_realisitc.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  const gravityObject = new GravityObject(model);
  gravityObjects.push(gravityObject);
}, undefined, (error) => {
  console.error('Une erreur s\'est produite lors du chargement du modèle de personnage :', error);
});

const gui = new dat.GUI();
const options = {
  showModel: true,
};

gui.add(options, 'showModel').name('Afficher Modèle').onChange((value) => {
  gravityObjects.forEach(obj => obj.model.visible = value);
});

setupControls();

const clock = new THREE.Clock();

function updateModelPosition() {
  gravityObjects.forEach(obj => {
    const model = obj.model;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    if (move.forward) model.position.addScaledVector(direction, 0.1);
    if (move.backward) model.position.addScaledVector(direction, -0.1);
    if (move.left) model.position.addScaledVector(right, -0.1);
    if (move.right) model.position.addScaledVector(right, 0.1);

    if (move.forward || move.backward || move.left || move.right) {
      model.lookAt(model.position.clone().add(direction));
    }
  });
}

function updateCameraPosition() {
  if (gravityObjects.length > 0) {
    const model = gravityObjects[0].model;
    const modelPosition = new THREE.Vector3();
    model.getWorldPosition(modelPosition);

    const sphericalOffset = new THREE.Spherical(distanceFromPlayer, Math.PI / 2 - targetCameraRotation.y, targetCameraRotation.x);

    const offset = new THREE.Vector3();
    offset.setFromSpherical(sphericalOffset);

    const cameraHeightOffset = new THREE.Vector3(0, 3, 0);

    camera.position.copy(modelPosition).add(offset).add(cameraHeightOffset);

    camera.lookAt(modelPosition);
  }
}

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement) {
    targetCameraRotation.x -= event.movementX * 0.001;
    targetCameraRotation.y -= event.movementY * 0.001;

    targetCameraRotation.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetCameraRotation.y));
  }
});

document.addEventListener('click', () => {
  document.body.requestPointerLock();
});

setupStats();

function animate() {
  const delta = clock.getDelta();
  gravityObjects.forEach(obj => obj.applyGravity(delta));
  updateModelPosition();
  updateCameraPosition();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();