// src/components/FPSPlayer.jsx
import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';

function FPSPlayer() {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 5, 0],
  }));

  // Utiliser une référence pour conserver l'état de la direction
  const velocity = useRef([0, 0, 0]);

  // Définir la vitesse de mouvement
  const moveSpeed = 5;

  // Mettre à jour la vitesse de mouvement basée sur les touches pressées
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        velocity.current[2] = -moveSpeed; // Avancer
        break;
      case 'ArrowDown':
        velocity.current[2] = moveSpeed; // Reculer
        break;
      case 'ArrowLeft':
        velocity.current[0] = -moveSpeed; // Aller à gauche
        break;
      case 'ArrowRight':
        velocity.current[0] = moveSpeed; // Aller à droite
        break;
      default:
        break;
    }
    api.velocity.set(...velocity.current);
  };

  // Remettre la vitesse à zéro lorsque la touche est relâchée
  const handleKeyUp = (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        velocity.current[2] = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        velocity.current[0] = 0;
        break;
      default:
        break;
    }
    api.velocity.set(...velocity.current);
  };

  // Écouter les événements de clavier
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [api]);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export default FPSPlayer;
