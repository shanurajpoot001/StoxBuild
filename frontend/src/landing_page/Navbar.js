import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsMenuOpen(false);

  return ( 
    <nav
      className={`navbar navbar-expand-lg border-bottom navbar-light bg-light fixed-top navbar-glass${scrolled ? ' navbar-scrolled' : ''}`}
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img
            src="media/images/stoxflow-logo.svg"
            alt="StoxFlow Logo"
          />
        </Link>
        <button
          className={`navbar-toggler${isMenuOpen ? '' : ' collapsed'}`}
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${isMenuOpen ? ' show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${isActive('/signup') ? ' fw-semibold' : ''}`} to="/signup" onClick={closeMenu}>
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/ai-prediction') ? ' fw-semibold' : ''}`} to="/ai-prediction" onClick={closeMenu}>
                AI Model
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/about') ? ' fw-semibold' : ''}`} to="/about" onClick={closeMenu}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/product') ? ' fw-semibold' : ''}`} to="/product" onClick={closeMenu}>
                Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/pricing') ? ' fw-semibold' : ''}`} to="/pricing" onClick={closeMenu}>
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/support') ? ' fw-semibold' : ''}`} to="/support" onClick={closeMenu}>
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isActive('/documentation') ? ' fw-semibold' : ''}`} to="/documentation" onClick={closeMenu}>
                Documentation
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
