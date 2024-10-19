import * as THREE from 'three';

class GravityObject {
  constructor(model, gravity = -9.81) {
    this.model = model;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.gravity = gravity;
    this.isJumping = false;
  }

  applyGravity(delta) {
    this.velocity.y += this.gravity * delta;
    this.model.position.add(this.velocity.clone().multiplyScalar(delta));

    if (this.model.position.y < 0) {
      this.model.position.y = 0;
      this.velocity.y = 0;
      this.isJumping = false;
    }
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = 5;
      this.isJumping = true;
    }
  }
}

export default GravityObject;