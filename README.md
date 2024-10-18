# Hugo Demont Portfolio

## 🚀 Introduction

Ce projet est un portfolio interactif en 3D où les utilisateurs explorent un environnement brumeux et mystérieux, inspiré des anciens jeux PSX (PlayStation 1). Ils doivent se déplacer dans cet univers pour découvrir mes informations, telles que mes compétences, mes projets, et mon parcours.

Ce guide a pour objectif de t’expliquer comment tu peux, toi aussi, créer un portfolio immersif similaire, en utilisant **Blender** pour modéliser des objets 3D, **Three.js** pour gérer la scène et **Vite** pour optimiser les performances du site.

---

## 🎨 Pourquoi ce concept ?

1. **Originalité et immersion** : Un portfolio en 3D avec une expérience d'exploration engage les visiteurs de manière unique, tout en offrant une façon ludique de découvrir des informations sur ton parcours professionnel.
   
2. **Esthétique rétro PSX** : L'utilisation de modèles low-poly et d’effets visuels simples rappelle les graphismes des anciens jeux vidéo PlayStation 1, ce qui apporte une touche artistique nostalgique et unique.

3. **Technologies Web modernes** : Utiliser **Three.js** permet de gérer la complexité des graphiques 3D directement dans le navigateur, et **Vite** assure une performance maximale avec un développement rapide.

---

## 🛠️ Technologies utilisées

| Technologie | Description |
|-------------|-------------|
| ![Three.js](https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/three.js.svg) **[Three.js](https://threejs.org/)** | Une bibliothèque JavaScript qui permet de créer des graphiques 3D dans le navigateur. Elle offre des outils pour gérer les objets 3D, les caméras, les lumières, et bien plus encore. |
| ![Vite](https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/vite.svg) **[Vite](https://vitejs.dev/)** | Un bundler ultra rapide qui optimise le développement et la performance des applications JavaScript modernes. |
| ![Blender](https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/blender.svg) **[Blender](https://www.blender.org/)** | Un logiciel de création 3D gratuit et open-source utilisé pour modéliser les objets 3D que tu intègreras dans Three.js. |
| ![GLSL](https://cdn.jsdelivr.net/npm/simple-icons@v7/icons/opengl.svg) **GLSL** | Un langage de shading pour écrire des shaders personnalisés qui permettent de créer des effets visuels comme la brume ou les ombrages dans Three.js. |

---

## 🎮 Fonctionnalités principales du portfolio

- **Exploration en 3D** : L'utilisateur doit se déplacer à travers une scène interactive pour découvrir les informations sur le portfolio.
- **Effet de brume mystérieuse** : Utilisation de shaders pour ajouter une atmosphère brumeuse, créant une ambiance immersive.
- **Objets low-poly inspirés de l’esthétique PSX** : Les objets du portfolio (comme des bâtiments, des arbres, etc.) sont modélisés dans un style simple, rappelant les graphismes des jeux PlayStation 1.
- **Performance optimisée** : Grâce à Vite, le chargement des assets est rapide, et les interactions 3D restent fluides même sur des machines moins performantes.

---

## 🔨 Comment recréer un portfolio 3D similaire ?

### 1. **Modélisation des objets 3D avec Blender**

**Blender** est l'outil principal pour créer des objets 3D que tu vas intégrer dans ton portfolio. Voici les étapes générales pour réaliser cela :

- **Modélisation low-poly** : Choisis un style graphique simple avec des formes géométriques basiques et peu de polygones. Cela permettra de conserver une esthétique rétro tout en assurant de bonnes performances.
- **Texture pixelisée** : Crée des textures à basse résolution pour évoquer l'aspect pixelisé des anciens jeux vidéo. Tu peux les créer directement dans Blender ou avec un logiciel comme **GIMP** ou **Photoshop**.
- **Optimisation** : Réduis le nombre de polygones et optimise les UV maps pour minimiser le poids des fichiers, ce qui est crucial pour des performances fluides dans un environnement Web.
- **Exportation** : Une fois ton modèle prêt, exporte-le en **format glTF** ou **OBJ**, car ces formats sont largement supportés par **Three.js** et sont faciles à manipuler.

### 2. **Création de la scène 3D avec Three.js**

Après avoir créé et exporté tes modèles 3D avec Blender, tu devras les intégrer dans une scène 3D avec **Three.js**.

- **Ajout des objets 3D** : Utilise **Three.js** pour importer et afficher tes modèles dans la scène. Tu pourras les positionner, les animer, et ajouter des interactions pour que l'utilisateur puisse explorer ton portfolio.
- **Brume et lumières** : Crée une atmosphère brumeuse pour ajouter une touche mystérieuse à ton environnement. Utilise les fonctionnalités intégrées de Three.js pour gérer la lumière de la scène et jouer avec les ombrages et la brume pour obtenir un effet PSX authentique.
- **Contrôles utilisateur** : Permets à l'utilisateur de se déplacer dans la scène à l'aide de contrôles interactifs (par exemple, navigation à la première personne ou à la troisième personne, en fonction de l'expérience souhaitée).

### 3. **Utilisation de shaders pour les effets visuels**

Pour rendre ton portfolio encore plus immersif, tu peux ajouter des **shaders** personnalisés avec **GLSL**. Les shaders te permettront de créer des effets visuels avancés comme :

- **Brume dynamique** : Pour ajouter de la profondeur à la scène et rendre l’exploration plus intrigante, la brume peut être gérée avec un shader qui modifie son intensité en fonction de la distance.
- **Effets de lumière rétro** : Utilise des shaders pour imiter des effets de lumière simples et anguleux typiques des premiers jeux en 3D.

### 4. **Optimiser le développement et les performances avec Vite**

**Vite** est un outil essentiel pour garantir que ton projet est rapide, à la fois en développement et en production. Voici quelques raisons d'utiliser Vite :

- **Hot-reload ultra rapide** : Chaque modification de ton code est instantanément reflétée dans le navigateur, ce qui accélère le développement.
- **Optimisation des assets** : Vite optimise automatiquement les fichiers JavaScript et les fichiers 3D pour réduire le temps de chargement de la page.
- **Facilité d'intégration avec Three.js** : Vite se configure très facilement avec Three.js, ce qui te permet de te concentrer sur la création de contenu sans avoir à t’inquiéter de la configuration complexe.

---

## 🔧 Quelques conseils pratiques

- **Test de performances** : Avant de publier ton portfolio, teste-le sur plusieurs appareils (PC, mobiles, tablettes) pour t'assurer que la scène reste fluide. La 3D peut rapidement devenir lourde à charger si les modèles ne sont pas optimisés.
- **Expérience utilisateur (UX)** : Pense à la manière dont l’utilisateur navigue dans ton portfolio. Assure-toi que les contrôles de déplacement soient simples et intuitifs pour éviter toute frustration.
- **Minimalisme** : N’ajoute pas trop d’objets ou de détails inutiles dans la scène. Reste fidèle à l'esthétique minimaliste pour garantir des performances optimales et ne pas surcharger l’utilisateur.

---

## 🎯 Conclusion

En créant un portfolio 3D avec **Blender** pour la modélisation, **Three.js** pour l'intégration des objets 3D, et **Vite** pour l'optimisation des performances, tu offres une expérience unique qui engage les visiteurs tout en démontrant tes compétences techniques. Un projet comme celui-ci montre non seulement ta créativité, mais aussi ta maîtrise des outils modernes de développement Web.

---

## 📜 À propos de moi

Je suis un développeur passionné par la création d'expériences interactives sur le web. J'aime repousser les limites de ce qu'il est possible de faire avec des technologies comme **Three.js** et j’explore toujours de nouvelles manières de rendre les sites plus immersifs et captivants.
