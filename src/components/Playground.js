import { Canvas } from '@react-three/fiber';
import React, { useRef, useCallback, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useControls, useCreateStore, LevaPanel } from 'leva';
import useStore from '../store/useStore';

function Playground() {
  const [wireframe, setWireframe] = React.useState(false);
  const [panelPosition, setPanelPosition] = React.useState({ x: 0, y: 0 });
  const levaStore = useCreateStore();
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const { setSelectedObject, addInteraction } = useStore();

  // Leva settings
  const {
   ambientIntensity,
   directionalIntensity,
  //  dirLightColor,
  //  dirLightX,
  //  dirLightY,
  //  dirLightZ,
  //  knotX,
  //  knotY,
  //  knotZ,
   knotColor,
   radius,
   tube,
   tubularSegments,
   radialSegments,
   p,
   q
 } = useControls({
   ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.01, label: "Ambient Light Intensity" },
   directionalIntensity: { value: 1, min: 0, max: 5, step: 0.01, label: "Directional Light Intensity" },
  //  dirLightColor: { value: "#ffffff", label: "Directional Light Color" },
  //  dirLightX: { value: 1, min: -10, max: 10, step: 0.01, label: "Directional Light X" },
  //  dirLightY: { value: 1, min: -10, max: 10, step: 0.01, label: "Directional Light Y" },
  //  dirLightZ: { value: 1, min: -10, max: 10, step: 0.01, label: "Directional Light Z" },
  //  knotX: { value: 0, min: -5, max: 5, step: 0.01, label: "Knot X" },
  //  knotY: { value: 0, min: -5, max: 5, step: 0.01, label: "Knot Y" },
  //  knotZ: { value: 0, min: -5, max: 5, step: 0.01, label: "Knot Z" },
   knotColor: { value: "#ff0000", label: "Knot Color" },
   radius: { value: 1, min: 0.1, max: 3, step: 0.01, label: "Radius" },
   tube: { value: 0.3, min: 0.1, max: 1, step: 0.01, label: "Tube" },
   tubularSegments: { value: 64, min: 8, max: 256, step: 1, label: "Tubular Segments" },
   radialSegments: { value: 9, min: 3, max: 32, step: 1, label: "Radial Segments" },
   p: { value: 2, min: 1, max: 10, step: 1, label: "P" },
   q: { value: 3, min: 1, max: 10, step: 1, label: "Q" },
 }, { store: levaStore });

  const clampPanelPosition = useCallback(() => {
    if (!containerRef.current || !panelRef.current) return;
    
    const container = containerRef.current;
    const panel = panelRef.current;
    const containerRect = container.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    
    const panelWidth = 200;
    const panelHeight = panelRect.height || 400;
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const levaRoot = panel.querySelector('[class*="leva__"]') || panel.firstElementChild || panel;
    if (!levaRoot) return;
    
    const computedStyle = window.getComputedStyle(levaRoot);
    const transform = computedStyle.transform || levaRoot.style.transform;
    
    if (!transform || transform === 'none') return;
    
    let currentX = 0;
    let currentY = 0;
    
    const translateMatch = transform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
    if (translateMatch) {
      currentX = parseFloat(translateMatch[1]) || 0;
      currentY = parseFloat(translateMatch[2]) || 0;
    } else {
      const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',').map(v => parseFloat(v.trim()));
        currentX = values[4] || 0;
        currentY = values[5] || 0;
      }
    }
    
    const maxLeftX = -(containerWidth - panelWidth - 10);
    const clampedX = Math.max(maxLeftX, Math.min(0, currentX));
    
    const maxDownY = Math.max(0, containerHeight - panelHeight - 10);
    const clampedY = Math.max(0, Math.min(maxDownY, currentY));
    
    if (Math.abs(clampedX - currentX) > 0.1 || Math.abs(clampedY - currentY) > 0.1) {
      levaRoot.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      setPanelPosition({ x: clampedX, y: clampedY });
    }
  }, []);

  const handleDrag = useCallback((position) => {
    setPanelPosition(position);
    requestAnimationFrame(() => {
      clampPanelPosition();
    });
  }, [clampPanelPosition]);

  useEffect(() => {
    const handleResize = () => {
      clampPanelPosition();
    };
    
    const handleReset = () => {
      setWireframe(false);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('store-reset', handleReset);
    const timeout = setTimeout(clampPanelPosition, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('store-reset', handleReset);
      clearTimeout(timeout);
    };
  }, [clampPanelPosition]);

  return (
  <div id="playground" ref={containerRef} className="playground-container">
  <h2 className='playground-title'>PLAYGROUND</h2>
   <div ref={panelRef} className="leva">
     <LevaPanel
       store={levaStore}
       fill
       titleBar={{ drag: true, onDrag: handleDrag, position: panelPosition }}
       theme={{
         sizes: {
           rootWidth: '200px',
           controlWidth: '120px',
           rowHeight: '20px',
           folderTitleHeight: '18px',
           titleBarHeight: '32px',
           numberInputMinWidth: '32px',
         },
         fontSizes: { root: '10px' },
         space: { xs: '2px', sm: '4px', md: '6px', rowGap: '5px', colGap: '5px' },
       }}
     />
   </div>
   <Canvas className='playground' shadows>
   <ambientLight intensity={ambientIntensity} />
   <directionalLight 
     position={[5, 10, 7]}
     intensity={directionalIntensity} 
     color={"#ffffff"}
     castShadow
     shadow-mapSize-width={1024}
     shadow-mapSize-height={1024}
   />
   <OrbitControls speed={2.0} enableZoom={false} autoRotate={true} autoRotateSpeed={2} />
   <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
     <planeGeometry args={[20, 20]} />
     <shadowMaterial opacity={0.4} />
   </mesh>
   <mesh 
     position={[0, -1.3, 0]} 
     onPointerDown={(e) => {
      e.stopPropagation();
      setWireframe(w => !w);
      setSelectedObject('TorusKnot');
      addInteraction({ type: 'click', object: 'TorusKnot', timestamp: Date.now() });
      window.dispatchEvent(new CustomEvent('geometry-clicked', { detail: { geometry: 'TorusKnot' } }));
     }}
     onPointerOver={(e) => { 
      e.stopPropagation(); 
      document.body.style.cursor = 'pointer';
      setSelectedObject('TorusKnot');
      addInteraction({ type: 'hover', object: 'TorusKnot', timestamp: Date.now() });
     }}
     onPointerOut={() => { 
      document.body.style.cursor = 'default';
     }}
     castShadow
     receiveShadow
   >
    <torusKnotGeometry args={[radius, tube, tubularSegments, radialSegments, p, q]} />
    <meshStandardMaterial color={knotColor} wireframe={wireframe} />
   </mesh>
  </Canvas>
  </div>
 )
}

export default Playground;