import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GravityObject from './gravityObject.js';

function loadCharacter(scene, gravityObjects) {
  const loader = new GLTFLoader();
  loader.load('./public/xander_model_character_man_rigged_realisitc.glb', (gltf) => {
    const model = gltf.scene;
    model.castShadow = true;
    model.receiveShadow = true;
    scene.add(model);
    const gravityObject = new GravityObject(model);
    gravityObjects.push(gravityObject);
  }, undefined, (error) => {
    console.error('An error occurred while loading the character model:', error);
  });
}

export { loadCharacter };