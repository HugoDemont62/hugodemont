import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GravityObject from './gravityObject.js';

function loadCharacter(scene, gravityObjects) {
  const loader = new GLTFLoader();
  loader.load('./public/xander_model_character_man_rigged_realisitc.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    const gravityObject = new GravityObject(model);
    gravityObjects.push(gravityObject);
  }, undefined, (error) => {
    console.error('Une erreur s\'est produite lors du chargement du modèle de personnage :', error);
  });
}

export { loadCharacter };