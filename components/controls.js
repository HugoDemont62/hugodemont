const move = { forward: false, backward: false, left: false, right: false, jump: false, run: false, toggleCamera: false };
let cameraTogglePressed = false;

function setupControls() {
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        move.forward = true;
        break;
      case 'KeyS':
        move.backward = true;
        break;
      case 'KeyA':
        move.right = true;
        break;
      case 'KeyD':
        move.left = true;
        break;
      case 'Space':
        move.jump = true;
        break;
      case 'ShiftLeft':
        move.run = true;
        break;
      case 'KeyR':
        if (!cameraTogglePressed) {
          move.toggleCamera = true;
          cameraTogglePressed = true;
        }
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
        move.right = false;
        break;
      case 'KeyD':
        move.left = false;
        break;
      case 'Space':
        move.jump = false;
        break;
      case 'ShiftLeft':
        move.run = false;
        break;
      case 'KeyR':
        cameraTogglePressed = false;
        break;
    }
  });
}

export { move, setupControls };