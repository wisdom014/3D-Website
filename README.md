# 3D Portfolio Application

A modern React portfolio application featuring interactive 3D graphics built with React Three Fiber, Three.js, and Zustand for state management.

## Performance Optimizations

This application implements several key performance optimizations to prevent unnecessary re-renders during 3D interactions and maintain smooth 60fps animations:

### 1. **React Three Fiber's `useFrame` Hook**
- All 3D animations use React Three Fiber's `useFrame` hook, which runs in the render loop outside of React's reconciliation cycle
- This prevents React re-renders during animations, as mesh transformations happen directly on Three.js objects via refs
- Example: In `Hero3D.js`, the hover animation updates `mesh.scale.y` and `mesh.position` directly without triggering React state updates

### 2. **Ref-Based Direct Manipulation**
- All 3D meshes use `useRef` to store references to Three.js objects
- Transformations (position, rotation, scale) are applied directly to the mesh objects, bypassing React's render cycle
- This approach is essential for smooth animations with hundreds of objects (e.g., 2000 boxes in Hero3D)

### 3. **Zustand for Global State Management**
- Replaced React Context API with Zustand for global state management
- Zustand provides fine-grained subscriptions, preventing unnecessary re-renders of components that don't use specific state slices
- Only components that subscribe to specific store values re-render when those values change
- The interaction log and selected object state are managed efficiently without cascading re-renders

### 4. **Local State for UI Interactions**
- Hover states (`isHovered`, `hovered`) are managed with local `useState` within individual 3D components
- This isolates state changes to the specific component, preventing parent and sibling re-renders
- Global state updates (via Zustand) only occur when necessary (e.g., tracking interactions for analytics)

### 5. **Memoization with `useCallback` and `useMemo`**
- Event handlers in `Playground.js` are wrapped with `useCallback` to maintain referential equality
- The `clampPanelPosition` function is memoized to prevent recreation on every render
- Navigation links in `NavBar.js` are memoized with `useMemo` to avoid unnecessary recalculations

### 6. **Throttling for Rapid Interactions**
- Wireframe toggle in `Hero3D.js` implements time-based throttling (80ms) using `useRef` to track last toggle time
- Prevents excessive state updates when users rapidly click multiple boxes
- Reduces unnecessary re-renders and state synchronization overhead

### 7. **Delta-Based Smooth Animations**
- Animations use delta time from `useFrame` for frame-rate independent movement
- Smooth interpolation with `Math.min(1, delta * 8)` ensures consistent animation speed regardless of frame rate
- Prevents janky animations during performance dips

### 8. **Event Propagation Control**
- All 3D interaction handlers use `e.stopPropagation()` to prevent event bubbling
- Reduces unnecessary event processing and potential parent component updates
- Isolates interactions to the specific 3D object being interacted with

### 9. **Conditional Rendering in Animation Loops**
- Early returns in `useFrame` hooks when refs are null or conditions aren't met
- Prevents unnecessary calculations and Three.js operations
- Example: `if (!mesh) return;` checks prevent errors and wasted computation

### 10. **Optimized Shadow Rendering**
- Shadow map sizes are set to reasonable values (1024x1024) to balance quality and performance
- Shadow materials use opacity values to reduce rendering overhead
- Shadows are only enabled where necessary (castShadow/receiveShadow flags)

## Technologies Used

- **React 19** - UI framework
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **Zustand** - Lightweight state management
- **Leva** - GUI controls for 3D playground
- **@react-three/drei** - Useful helpers for R3F

## Project Structure

```
src/
├── components/
│   ├── Hero3D.js      # Main 3D hero section with interactive boxes
│   ├── About3D.js     # Rotating sphere component
│   ├── Playground.js  # Interactive 3D playground with controls
│   ├── NavBar.js      # Navigation component
│   ├── Hero.js        # Hero section wrapper
│   ├── About.js       # About section wrapper
│   └── Contact.js     # Contact section
├── store/
│   └── useStore.js    # Zustand store for global state
├── App.js             # Main app component
└── App.css            # Global styles
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Build for production:
```bash
npm build
```

## Key Features

- **Interactive 3D Hero Section**: 2000+ interactive boxes with hover animations
- **Rotating Sphere**: Clickable sphere with rotation toggle
- **3D Playground**: Interactive TorusKnot with real-time parameter controls
- **State Management**: Global state tracking for interactions and selected objects
- **Responsive Design**: Optimized for various screen sizes
