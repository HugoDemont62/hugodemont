import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { move, setupControls } from './components/controls.js';
import { setupLighting } from './components/lighting.js';
import { loadCharacter } from './components/character.js';
import { createGround } from './components/ground.js';
import { updateStamina, canRun, canJump } from './components/stamina.js';
import { setupStats } from './components/stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const stats = setupStats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Add fog to the scene
scene.fog = new THREE.FogExp2(0xcccccc, 0.05);

const loader = new THREE.TextureLoader();
const texture = loader.load('public/sky.jpg', () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});

setupLighting(scene);
const { updateTreesVisibility, treeBoxes } = createGround(scene);

let gravityObjects = [];
loadCharacter(scene, gravityObjects);

const gui = new dat.GUI();
const options = {
  showModel: true,
};

gui.add(options, 'showModel').name('Afficher Modèle').onChange((value) => {
  gravityObjects.forEach(obj => obj.model.visible = value);
});

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

const gltfLoader = new GLTFLoader();
gltfLoader.load('public/SIMPLE NIPON CASTLE PS1.glb', (gltf) => {
  const castle = gltf.scene;
  castle.position.set(25, 0, 25);
  scene.add(castle);
});

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

    const newPosition = model.position.clone();

    if (move.forward) newPosition.addScaledVector(direction, speed);
    if (move.backward) newPosition.addScaledVector(direction, -speed);
    if (move.left) newPosition.addScaledVector(left, speed);
    if (move.right) newPosition.addScaledVector(right, speed);

    // Check for collisions with trees
    const modelBox = new THREE.Box3().setFromObject(model);
    let collision = false;
    let collisionNormal = new THREE.Vector3();

    treeBoxes.forEach(box => {
      if (box.intersectsBox(modelBox)) {
        collision = true;
        const treeCenter = new THREE.Vector3();
        box.getCenter(treeCenter);
        collisionNormal.copy(newPosition).sub(treeCenter).normalize();
      }
    });

    if (collision) {
      newPosition.add(collisionNormal.multiplyScalar(speed));
    }

    model.position.copy(newPosition);

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

    camera.position.copy(modelPosition).add(new THREE.Vector3(0, 1, 0));
    model.visible = false;

    // Add smooth camera tilt effect
    const tiltAmount = Math.PI / 16;
    const smoothFactor = 0.1;
    if (move.left) {
      camera.rotation.z += (-tiltAmount - camera.rotation.z) * smoothFactor; // Tilt left
    } else if (move.right) {
      camera.rotation.z += (tiltAmount - camera.rotation.z) * smoothFactor; // Tilt right
    } else {
      camera.rotation.z += (0 - camera.rotation.z) * smoothFactor; // Reset tilt
    }
  }
}

let targetCameraRotation = new THREE.Vector2();

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

function animate() {
  stats.begin();

  const delta = clock.getDelta();
  gravityObjects.forEach(obj => obj.applyGravity(delta));
  updateModelPosition(delta);
  updateCameraPosition();
  updateStamina(delta, move.run, move.jump);
  updateTreesVisibility(camera);

  // Smooth camera rotation
  camera.rotation.order = 'YXZ';
  camera.rotation.y += (targetCameraRotation.x - camera.rotation.y) * 0.1;
  camera.rotation.x += (targetCameraRotation.y - camera.rotation.x) * 0.1;

  renderer.render(scene, camera);

  if (gravityObjects.length > 0) {
    const modelPosition = gravityObjects[0].model.position;
    coordinates.X = modelPosition.x.toFixed(2);
    coordinates.Y = modelPosition.y.toFixed(2);
    coordinates.Z = modelPosition.z.toFixed(2);
  }
  stats.end();
  requestAnimationFrame(animate);
}

animate();