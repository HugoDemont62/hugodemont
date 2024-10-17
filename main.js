import './style.css';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'dat.gui';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30,
  window.innerWidth / window.innerHeight, 0.1, 50);
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xeeffbe, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const gui = new GUI();

// Load the ground texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./public/th.jfif');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

// Create the ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({map: groundTexture});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const loader = new GLTFLoader();
loader.load('./public/psx_building.glb', (gltf) => {
  const building = gltf.scene;
  scene.add(building);
  building.position.set(0, 0, -3);

  const buildingBox = new THREE.BoxHelper(building, 0xff0000);
  scene.add(buildingBox);
}, undefined, (error) => {
  console.error('An error occurred while loading the building model:', error);
});

loader.load('./public/xander_model_character_man_rigged_realisitc.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Add collision box for the character model
    const modelBox = new THREE.BoxHelper(model, 0x00ff00);
    modelBox.update();
    scene.add(modelBox);

    // Center the collision box around the model
    const box = new THREE.Box3().setFromObject(model);
    const boxCenter = box.getCenter(new THREE.Vector3());
    modelBox.position.copy(boxCenter);

    const bones = model.children[0].skeleton.bones;
    bones.forEach((bone, index) => {
      const folder = gui.addFolder(`Bone ${index}`);
      folder.add(bone.position, 'x', -10, 10);
      folder.add(bone.position, 'y', -10, 10);
      folder.add(bone.position, 'z', -10, 10);
      folder.add(bone.rotation, 'x', -Math.PI, Math.PI);
      folder.add(bone.rotation, 'y', -Math.PI, Math.PI);
      folder.add(bone.rotation, 'z', -Math.PI, Math.PI);
      folder.open();
    });
  }, undefined, (error) => {
    console.error('An error occurred while loading the character model:',
      error);
  });

function animate() {
  camera.position.set(1, 5, 10);
  camera.lookAt(5, 5, 0);
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();