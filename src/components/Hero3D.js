import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import useStore from '../store/useStore';

const toggleTime = 80;

const ground_y = -1;

function HoverBox({ x, z, wireframe, onToggleWireframe, id }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedObject, addInteraction } = useStore();

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const targetY = hovered ? 0.3 : 0.01;
    mesh.scale.y += (targetY - mesh.scale.y) * Math.min(1, delta * 8);

    mesh.position.set(x, ground_y + 0.5 * mesh.scale.y, z);
  });

  const handlePointerOver = () => {
    setHovered(true);
    setSelectedObject('Cube');
    addInteraction({ type: 'hover', object: 'Cube', timestamp: Date.now() });
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedObject('Cube');
    addInteraction({ type: 'click', object: 'Cube', timestamp: Date.now() });
    window.dispatchEvent(new CustomEvent('geometry-clicked', { detail: { geometry: 'Cube' } }));
    onToggleWireframe();
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1.2, 1, 1.2]} />
      <meshStandardMaterial
        attach="material-0"
        color={wireframe ? '#fff' : '#1f6fff'}
        wireframe={wireframe}
      />
      <meshStandardMaterial
        attach="material-1"
        color={wireframe ? '#fff' : '#1f6fff'}
        wireframe={wireframe}
      />
      <meshStandardMaterial
        attach="material-2"
        color={wireframe ? '#fff' : '#000'}
        wireframe={wireframe}
      />
      <meshStandardMaterial
        attach="material-3"
        color={wireframe ? '#fff' : '#1f6fff'}
        wireframe={wireframe}
      />
      <meshStandardMaterial
        attach="material-4"
        color={wireframe ? '#fff' : '#1f6fff'}
        wireframe={wireframe}
      />
      <meshStandardMaterial
        attach="material-5"
        color={wireframe ? '#fff' : '#1f6fff'}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const columns = 40;
  const rows = 50;
  const spacing = 0.8;
  const [wireframeAll, setWireframeAll] = useState(false);
  const lastToggleRef = useRef(0);
  // const { reset } = useStore();

  const handleToggleWireframe = () => {
    const now = Date.now();
    if (now - lastToggleRef.current < toggleTime) return;
    lastToggleRef.current = now;
    setWireframeAll((v) => !v);
  };

  // Listen for reset events
  useEffect(() => {
    const handleReset = () => {
      setWireframeAll(false);
    };
    window.addEventListener('store-reset', handleReset);
    return () => window.removeEventListener('store-reset', handleReset);
  }, []);

  const boxes = [];
  const offsetX = ((columns - 1) * spacing) / 2;
  const offsetZ = ((rows - 1) * spacing) / 2;

  for (let i = 0; i < columns; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const x = i * spacing - offsetX;
      const z = j * spacing - offsetZ;
      boxes.push({ x, z, key: `${i}-${j}` });
    }
  }
  
  return (
    <Canvas
      shadows
      camera={{ position: [0, 4, 7], fov: 30 }}
      gl={{ antialias: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.6} />

      {/* shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ground_y, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <shadowMaterial opacity={0.25} />
      </mesh>

      {/* Rotation */}
      <group rotation={[0, Math.PI / 2, 0]}>
        {boxes.map(({ x, z, key }) => (
          <HoverBox
            key={key}
            id={key}
            x={x}
            z={z}
            wireframe={wireframeAll}
            onToggleWireframe={handleToggleWireframe}
          />
        ))}
      </group>
    </Canvas>
  );
}
