import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import '../App.css';
import useStore from '../store/useStore';

function RotatingSphere() {
  const meshRef = useRef();
  const [isRotating, setIsRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedObject, addInteraction } = useStore();
  const radius = Math.max(window.innerWidth, window.innerHeight) * 0.009;

  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    const handleReset = () => {
      setIsRotating(true);
    };
    window.addEventListener('store-reset', handleReset);
    return () => window.removeEventListener('store-reset', handleReset);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsRotating(prev => !prev);
    setSelectedObject('Sphere');
    addInteraction({ type: 'click', object: 'Sphere', timestamp: Date.now() });
    window.dispatchEvent(new CustomEvent('geometry-clicked', { detail: { geometry: 'Sphere' } }));
  };

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    setIsHovered(true);
    setSelectedObject('Sphere');
    addInteraction({ type: 'hover', object: 'Sphere', timestamp: Date.now() });
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  return (
    <mesh 
      ref={meshRef} 
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      rotation={[Math.PI, 0, 0]}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[radius, 64, 32, 6.3, 6.3, 0]} />
      <meshStandardMaterial 
        color={isHovered ? "#1f6fff" : "orange"} 
        wireframe 
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function About3D() {
  return (
    <div className="about3d-container">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75 }}
        className="about3d-canvas"
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <RotatingSphere />
      </Canvas>
    </div>
  );
}

export default About3D;
