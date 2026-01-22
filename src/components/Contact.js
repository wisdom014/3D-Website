import React from "react";
import '../App.css'

export default function Contact() {
 return (
  <footer className="footer" id="contact">
   <div className="back-to-top mobile">
    <a href="/" to="/back-to-top">BACK TO TOP</a>
   </div>
   <hr className="back-line mobile" />
   <div className="container tablet">
    <div className="tablet-container">
     <div className="newsletter">
      <h4>NEW TO 3D ?</h4>
      <p>Subscribe to our newsletter to get updates on our latest offers!</p>
      <input type="email" placeholder="Enter your email" />
      <button>Subscribe</button>
     </div>
    </div>
   </div>
    <hr className="footer-line tablet" />
   <div className="left">
    <div className="footer-links">
     <a href="#hero">HOME</a>
     <a href="#about">ABOUT</a>
     <a href="#playground">PLAYGROUND</a>
     <a href="#contact">CONTACT US</a>
    </div>
   </div>
   <hr className="footer-line" />
   <div className="footer-bottom">
    <span>&copy; {new Date().getFullYear()} 3D website. All Rights Reserved.</span>
   </div>

  </footer>
 );
}