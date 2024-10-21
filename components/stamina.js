let stamina = 100;
const maxStamina = 100;
const staminaRegenRate = 30;
const staminaDrainRate = 10;
const staminaBar = document.getElementById('stamina-bar');
let hasJumped = false;

function updateStaminaBar() {
  staminaBar.style.width = `${(stamina / maxStamina) * 100}%`;
}

function updateStamina(delta, isRunning, isJumping) {
  if (isRunning && stamina > 0) {
    stamina -= staminaDrainRate * delta;
    if (stamina < 0) stamina = 0;
  } else {
    stamina += staminaRegenRate * delta;
    if (stamina > maxStamina) stamina = maxStamina;
  }

  if (isJumping && !hasJumped && stamina > 0) {
    stamina -= 20;
    hasJumped = true;
  }

  if (!isJumping) {
    hasJumped = false;
  }

  updateStaminaBar();
}

function canRun() {
  return stamina > 0;
}

function canJump() {
  return stamina > 0;
}

export { updateStamina, canRun, canJump };