import React from 'react';
import Hero3D from './Hero3D';

function Hero() {
 return (
  <div id="hero" className='hero-container'>
   {/* 3D Background */}
   <div className='hero-3d-background'>
    <Hero3D />
   </div>

   {/* Hero Content */}
   <div className='hero-content'>
    <div className='hero'>Welcome to my website!</div>
    <button className='hero-button'>Get Started</button>
   </div>
  </div>
 );
}

export default Hero;
