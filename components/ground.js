import * as THREE from 'three';

function createGround(scene) {
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('./public/th.jfif');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(10, 10);

  const groundGeometry = new THREE.PlaneGeometry(100000, 100000);
  const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
}

export { createGround };