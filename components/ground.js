import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function createGround(scene) {
  const textureLoader = new THREE.TextureLoader();
  const heightMap = textureLoader.load('./public/heightmap.png');
  const groundTexture = textureLoader.load('./public/th.jfif');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(100, 100);

  const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 256, 256);
  const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

  heightMap.anisotropy = 16;
  heightMap.wrapS = THREE.RepeatWrapping;
  heightMap.wrapT = THREE.RepeatWrapping;

  heightMap.onLoad = () => {
    const vertices = groundGeometry.attributes.position.array;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    context.drawImage(heightMap.image, 0, 0, size, size);
    const data = context.getImageData(0, 0, size, size).data;

    for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
      vertices[j + 2] = (data[i] / 255) * 50;
    }

    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();
  };

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const treeLoader = new GLTFLoader();
  let trees = [];
  let treeBoxes = [];

  treeLoader.load('public/TREE_PURPLEFLOWERS_PSX.glb', (gltf) => {
    const groundSize = 1000;
    const spacing = 20;
    const exclusionRadius = 80;

    for (let x = -groundSize / 2; x <= groundSize / 2; x += spacing) {
      for (let z = -groundSize / 2; z <= groundSize / 2; z += spacing) {

        if (Math.sqrt(x * x + z * z) < exclusionRadius) continue;

        const tree = gltf.scene.clone();
        tree.position.set(x, 0, z);
        tree.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        trees.push(tree);
        scene.add(tree);

        // Create a bounding box for the tree and scale it down
        const box = new THREE.Box3().setFromObject(tree);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scaledSize = size.multiplyScalar(0.5);
        const center = new THREE.Vector3();
        box.getCenter(center);
        box.setFromCenterAndSize(center, scaledSize);
        treeBoxes.push(box);
      }
    }
  });

  function updateTreesVisibility(camera) {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);

    trees.forEach((tree, index) => {
      const distance = cameraPosition.distanceTo(tree.position);
      const fogDensity = scene.fog.density;
      const fogFactor = Math.exp(-distance * distance * fogDensity * fogDensity);

      tree.traverse((node) => {
        if (node.isMesh) {
          node.material.transparent = true;
          node.material.opacity = 1 - fogFactor;
        }
      });

      treeBoxes[index].setFromObject(tree);
    });
  }

  return { updateTreesVisibility, treeBoxes };
}

export { createGround };