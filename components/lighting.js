import * as THREE from 'three';

function setupLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xeeffbe, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
}

export { setupLighting };