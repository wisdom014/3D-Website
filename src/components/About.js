import React, { useRef, useState, useEffect } from 'react';
import About3D from './About3D';

function About() {
  const sectionRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const updateOpacity = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const overlap = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const ratio = rect.height > 0
        ? Math.min(1, overlap / Math.min(rect.height, windowHeight))
        : 0;
      setOpacity(ratio);
    };

    updateOpacity();
    window.addEventListener('scroll', updateOpacity, { passive: true });
    window.addEventListener('resize', updateOpacity);
    return () => {
      window.removeEventListener('scroll', updateOpacity);
      window.removeEventListener('resize', updateOpacity);
    };
  }, []);

  return (
    <div className='about-container'>
      <div id="about" ref={sectionRef} className='about'>
        <About3D />
        <div className='about-content'>
          <h2 className='about-title opacity' style={{ opacity }}>About Us</h2>
          <p className='about-description opacity' style={{ opacity }}>We are a team of software engineers with a passion for building web applications.</p>
        </div>
      </div>
    </div>
  )
}

export default About;