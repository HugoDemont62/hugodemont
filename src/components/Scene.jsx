import React, { useEffect, useRef } from 'react';

const Scene = () => {
  const animationRef = useRef();
  const myObject = { step: 0 }; // Exemple d'objet avec une propriété step

  const animate = () => {
    // Vérifie si myObject est défini et a une propriété step
    if (myObject && myObject.step !== undefined) {
      console.log("Animating step:", myObject.step);
      // Logique d'animation ici, par exemple :
      myObject.step += 1; // Incrémente la valeur de step pour la démonstration

      // Ici, tu pourrais faire des mises à jour d'état ou d'autres animations
      // updateState(myObject.step); // Exemple de mise à jour d'état
    } else {
      console.error("myObject is undefined or does not have a step property");
      return; // Sort de la fonction pour éviter l'appel supplémentaire
    }

    // Demande le prochain frame d'animation
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Démarre l'animation
    animationRef.current = requestAnimationFrame(animate);

    // Nettoie l'animation lors du démontage du composant
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div>
      <h1>Animation avec React</h1>
      <p>Current Step: {myObject.step}</p>
    </div>
  );
};

export default Scene;
