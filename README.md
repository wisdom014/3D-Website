# 3D Portfolio Application

A modern React portfolio application with interactive 3D graphics built with React Three Fiber, Three.js, leva and Zustand.

## Performance Optimizations

I stored the values of everything in the canva in a const to make it  easier to understand and change easily

### 1. **Animation**

- I used `useFrame` fo the animation with some `Math` objects to implement the animation
- I made use of some of the constructors.

### 2. **Click & Hover**

- The hover states (`isHovered`, `hovered`) are managed with local `useState` within the individual 3D components
- This isolates state changes to the specific component, preventing parent and sibling re-renders

### 3. **Zustand for Global State Management**

- I used zustand to manage the state throughout the website unlike `useState` that I used within only thr individual 3D component

### 5. **Leva**

- I imported leva as a library to create an overlay that allows you to edit a mesh in browser

### 6. **Toggling**

- I implemented Wireframe toggle in `Hero3D.js` using `useRef` to track last toggle time

## Key Features

- **Interactive 3D Hero Section**: 2000+ interactive boxes with hover animations
- **Rotating Sphere**: Clickable sphere with rotation toggle
- **3D Playground**: Interactive TorusKnot with real-time parameter controls
- **State Management**: Global state tracking for interactions and selected objects
- **Responsive Design**: Optimized for various screen sizes
