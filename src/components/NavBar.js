import React, { useMemo, useState, useEffect } from "react";
import useStore from '../store/useStore';

export default function NavBar() {

 const [showMenu, setShowMenu] = useState(false);
 const [showHistory, setShowHistory] = useState(false);
 const { selectedObject, interactionLog, reset } = useStore();

 useEffect(() => {
  console.log(interactionLog);
 }, [interactionLog]);

 const toggleMenu = () => {
  setShowMenu(prevShowMenu => !prevShowMenu);
 };

 const handleLinkClick = () => {
  setShowMenu(false);
 };

 const links = useMemo(() => ([
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#playground" },
 ]), []);

 const scrollToHash = (hash) => {
  const el = document.querySelector(hash);
  if (!el) return;
  const NAV_OFFSET = 60; // account for fixed navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
 };

 const onNavItemClick = (e, item) => {
  e.preventDefault();
  handleLinkClick();
  setShowHistory(false);

  scrollToHash(item.href);
 };

 const resetHistory = () => {
  reset();
 };

 return (
  <header className="Navbar">
   <h3 className="Navbar-brand">
    3D-website
   </h3>
   <div className="menu-btn" onClick={toggleMenu}>
    <span className={`menu-btn_burger ${showMenu ? 'open' : ''}`}></span>
   </div>

   <nav className={`nav ${showMenu ? 'open' : ''}`}>
    <ul className={`menu-nav ${showMenu ? 'open' : ''}`}>
     {links.map((item) => (
      <li key={item.href} className={`menu-nav_item ${item.href === "#hero" ? "home" : ""} ${showMenu ? 'open' : ''}`}>
       <a
        href={item.href}
        onClick={(e) => onNavItemClick(e, item)}
        className="menu-nav_link"
       >
        {item.label}
       </a>
      </li>
     ))}

     <li className={`menu-nav_item ${showMenu ? 'open' : ''}`}>
      <p
       type="button"
       className="menu-nav_link history-btn"
       onClick={() => setShowHistory((v) => !v)}
      >
       History
      </p>

      {showHistory && (
       <div className="history-dropdown">
        <p className="history-info">
         Selected Object: <strong>{selectedObject || "None"}</strong>
        </p>

        <p className="history-info">
         Total Interactions: <strong>{interactionLog.length}</strong>
        </p>

        {interactionLog.length === 0 ? (
         <p className="history-empty">No interactions yet.</p>
        ) : (
         <div className="history-interactions">
          <p className="history-interactions-label">Last 5 Interactions:</p>
          <ul className="history-interactions-list">
           {interactionLog.map((interaction, index) => (
            <li key={`${interaction.object}-${interaction.timestamp}-${index}`} className="history-interaction-item">
             <span className="history-interaction-text">
              {interaction.type === 'click' ? '🖱️' : '👆'} {interaction.object} ({interaction.type})
             </span>
            </li>
           ))}
          </ul>
         </div>
        )}

        <button
         type="button"
         onClick={resetHistory}
         className="history-reset-btn"
        >
         Reset
        </button>
       </div>
      )}
     </li>
    </ul>
   </nav>
  </header>
 );
}