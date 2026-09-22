# BEAN THEORY

A premium, experimental, and cinematic digital brand experience.

## Tech Stack
* React 19, Vite
* Tailwind CSS v4
* Three.js, React Three Fiber, @react-three/drei
* GSAP, Lenis Smooth Scrolling

## Folder Architecture

The project is structured to keep UI, 3D logic, state, and animations clearly separated while remaining highly maintainable.

### `src/components/`
Contains all standard HTML/React DOM UI components. Organized by sections (e.g., `Hero`, `BrandStatement`, `CoffeeCollection`).
- **Rule**: UI components should only contain UI and DOM elements. Avoid placing complex 3D logic here.

### `src/components3D/`
Contains all Three.js/React Three Fiber components (`CoffeeScene`, `CoffeeCup`, `CoffeeParticles`, etc.).
- **Rule**: 3D components should only contain 3D logic, materials, meshes, and WebGL rendering components.

### `src/animations/`
Dedicated folder for GSAP animations and scroll logic.
- Separating animations (e.g., `heroAnimations.js`, `scrollAnimations.js`) keeps the React components clean and focuses on timeline orchestration.
- Includes `lenis.js` for scroll setup.

### `src/data/`
Contains all static content and copy (e.g., `products.js`, `origins.js`).
- **Rule**: Keeps UI components pure and avoids hardcoded text walls in the render methods.

### `src/hooks/`
Custom React hooks (`useMediaQuery`, `useLenis`, etc.) for abstracting reusable logic.

### `src/pages/`
High-level page assemblies.
- `Home.jsx` acts as the primary orchestrator that brings together the `components/` and `components3D/` logic for the single-page experience.

### `src/utils/`
Helper functions, constants, and formatting utilities (`constants.js`).

### `src/assets/`
Static assets, models, and textures.
- `images/`: Standard imagery, UI assets.
- `models/`: GLTF/GLB files (if any are introduced later).
- `textures/`: Displacement maps, environment maps, noise textures for custom shaders.
