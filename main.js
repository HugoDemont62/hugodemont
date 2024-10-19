// main.js
import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { move, setupControls } from './components/controls.js';
import { setupLighting } from './components/lighting.js';
import { loadCharacter } from './components/character.js';
import { setupStats } from './components/stats.js';
import { createGround } from './components/ground.js';
import { updateStamina, canRun, canJump } from './components/stamina.js'; // Import the stamina functions

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

let cameraOffset = new THREE.Vector3(1.5, 3, -5);
let targetCameraRotation = new THREE.Vector2();
let distanceFromPlayer = 4;
let isFirstPerson = false; // Track camera mode

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add skybox
const loader = new THREE.TextureLoader();
const texture = loader.load('public/sky.jpg', () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});

setupLighting(scene);
createGround(scene);

let gravityObjects = [];
loadCharacter(scene, gravityObjects);

const gui = new dat.GUI();
const options = {
  showModel: true,
};

gui.add(options, 'showModel').name('Afficher Modèle').onChange((value) => {
  gravityObjects.forEach(obj => obj.model.visible = value);
});

// Add coordinates folder
const coordinatesFolder = gui.addFolder('Coordinates');
const coordinates = {
  X: 0,
  Y: 0,
  Z: 0,
};
coordinatesFolder.add(coordinates, 'X').listen();
coordinatesFolder.add(coordinates, 'Y').listen();
coordinatesFolder.add(coordinates, 'Z').listen();
coordinatesFolder.open();

setupControls();

const clock = new THREE.Clock();

function updateModelPosition(delta) {
  gravityObjects.forEach(obj => {
    const model = obj.model;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();
    const left = right.clone().negate();

    let speed = 0.1;
    if (move.run && canRun()) {
      speed = 0.2;
    } else if (move.run && !canRun()) {
      speed = 0;
    }

    if (move.forward) model.position.addScaledVector(direction, speed);
    if (move.backward) model.position.addScaledVector(direction, -speed);
    if (move.left) model.position.addScaledVector(left, -speed);
    if (move.right) model.position.addScaledVector(right, speed);

    if (!isFirstPerson && (move.forward || move.backward || move.left || move.right)) {
      const moveDirection = new THREE.Vector3();
      if (move.forward) moveDirection.add(direction);
      if (move.backward) moveDirection.addScaledVector(direction, -1);
      if (move.left) moveDirection.addScaledVector(left, 0);
      if (move.right) moveDirection.add(right, 0);
      model.lookAt(model.position.clone().add(moveDirection));
    }

    if (move.jump && canJump()) {
      obj.jump();
    }
  });
}

function updateCameraPosition() {
  if (gravityObjects.length > 0) {
    const model = gravityObjects[0].model;
    const modelPosition = new THREE.Vector3();
    model.getWorldPosition(modelPosition);

    if (isFirstPerson) {
      camera.position.copy(modelPosition).add(new THREE.Vector3(0, 1, 0));
      model.visible = false;
    } else {
      model.visible = true;

      const offset = new THREE.Vector3(0, 2.2, -3);
      offset.applyQuaternion(model.quaternion);
      const targetPosition = modelPosition.clone().add(offset);
      camera.position.lerp(targetPosition, 0.1);

      camera.lookAt(modelPosition);
    }
  }
}

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement) {
    targetCameraRotation.x -= event.movementX * 0.001;
    targetCameraRotation.y -= event.movementY * 0.001;

    targetCameraRotation.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetCameraRotation.y));

    camera.rotation.order = 'YXZ'; // Ensure correct rotation order
    camera.rotation.y = targetCameraRotation.x;
    camera.rotation.x = targetCameraRotation.y;
  }
});

document.addEventListener('click', () => {
  document.body.requestPointerLock();
});

setupStats();

function animate() {
  const delta = clock.getDelta();
  gravityObjects.forEach(obj => obj.applyGravity(delta));
  updateModelPosition(delta);
  updateCameraPosition();
  updateStamina(delta, move.run, move.jump);

  if (move.toggleCamera) {
    isFirstPerson = !isFirstPerson;
    move.toggleCamera = false;
  }

  renderer.render(scene, camera);

  if (gravityObjects.length > 0) {
    const modelPosition = gravityObjects[0].model.position;
    coordinates.X = modelPosition.x.toFixed(2);
    coordinates.Y = modelPosition.y.toFixed(2);
    coordinates.Z = modelPosition.z.toFixed(2);
  }

  requestAnimationFrame(animate);
}

animate();