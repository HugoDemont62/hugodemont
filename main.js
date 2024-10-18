import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

let cameraOffset = new THREE.Vector3(1.5, 3, -5);
let targetCameraRotation = new THREE.Vector2();
let distanceFromPlayer = 4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xeeffbe, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Chargement de la texture du sol
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./public/th.jfif');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

// Création du sol
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Chargement des modèles 3D
const loader = new GLTFLoader();
let model, mixer;
const gui = new dat.GUI();
const options = {
  showModel: true
};

loader.load('./public/xander_model_character_man_rigged_realisitc.glb', (gltf) => {
  model = gltf.scene;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
}, undefined, (error) => {
  console.error('Une erreur s\'est produite lors du chargement du modèle de personnage :', error);
});

gui.add(options, 'showModel').name('Afficher Modèle').onChange((value) => {
  if (model) model.visible = value;
});

const moveSpeed = 0.1;
const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      move.forward = true;
      break;
    case 'KeyS':
      move.backward = true;
      break;
    case 'KeyA':
      move.left = true;
      break;
    case 'KeyD':
      move.right = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      move.forward = false;
      break;
    case 'KeyS':
      move.backward = false;
      break;
    case 'KeyA':
      move.left = false;
      break;
    case 'KeyD':
      move.right = false;
      break;
  }
});

const clock = new THREE.Clock();

function updateModelPosition() {
  if (model) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // Déplacement en fonction des touches appuyées
    if (move.forward) model.position.addScaledVector(direction, moveSpeed);
    if (move.backward) model.position.addScaledVector(direction, -moveSpeed);
    if (move.left) model.position.addScaledVector(right, -moveSpeed);
    if (move.right) model.position.addScaledVector(right, moveSpeed);

    if (move.forward || move.backward || move.left || move.right) {
      model.lookAt(model.position.clone().add(direction));
    }
  }
}


function updateCameraPosition() {
  if (model) {
    const modelPosition = new THREE.Vector3();
    model.getWorldPosition(modelPosition);

    const sphericalOffset = new THREE.Spherical(distanceFromPlayer, Math.PI / 2 - targetCameraRotation.y, targetCameraRotation.x);

    const offset = new THREE.Vector3();
    offset.setFromSpherical(sphericalOffset);

    const cameraHeightOffset = new THREE.Vector3(0, 1.5, 0);

    camera.position.copy(modelPosition).add(offset).add(cameraHeightOffset);

    camera.lookAt(modelPosition);
  }
}


document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement) {
    targetCameraRotation.x -= event.movementX * 0.005;
    targetCameraRotation.y -= event.movementY * 0.005;

    targetCameraRotation.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetCameraRotation.y));
  }
});


document.addEventListener('click', () => {
  document.body.requestPointerLock();
});

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  updateModelPosition();
  updateCameraPosition();
  renderer.render(scene, camera);
}

animate();
