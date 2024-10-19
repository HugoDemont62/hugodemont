let stamina = 100;
const maxStamina = 100;
const staminaRegenRate = 10;
const staminaDrainRate = 20;
const staminaBar = document.getElementById('stamina-bar');

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

  if (isJumping && stamina > 0) {
    stamina -= 30;
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