import * as THREE from 'three';

function createGround(scene) {
  const textureLoader = new THREE.TextureLoader();
  const heightMap = textureLoader.load('./public/heightmap.png');
  const groundTexture = textureLoader.load('./public/th.jfif');
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(10, 10);

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
      vertices[j + 2] = data[i] / 255;
    }

    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();
  };

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
}

export { createGround };