// src/components/Ground.jsx
import React from 'react';
import { usePlane } from '@react-three/cannon';

function Ground() {
  const [ref] = usePlane(() => ({
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    material: { friction: 1 },
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100, 10, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

export default Ground;
