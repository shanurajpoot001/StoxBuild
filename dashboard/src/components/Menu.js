import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 992) setIsNavOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
    setIsNavOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (_e) {
      return null;
    }
  })();

  const username = user?.username || "USER";
  const initials = username
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    const LANDING_URL = (process.env.REACT_APP_LANDING_URL || 'https://stoxbuild-frontend.onrender.com').replace(/\/$/, '');
    window.location.href = `${LANDING_URL}/login`;
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const navLinks = [
    { to: "/", label: "Dashboard", index: 0 },
    { to: "/orders", label: "Orders", index: 1 },
    { to: "/holdings", label: "Holdings", index: 2 },
    { to: "/positions", label: "Positions", index: 3 },
    { to: "/funds", label: "Funds", index: 4 },
    { to: "/ai", label: "AI", index: 5 },
    { to: "/apps", label: "Apps", index: 6 },
  ];

  return (
    <div className="menu-container">
      <div className="menu-brand">
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Dashboard</span>
        <img src="logo.png" alt="Logo" />
      </div>

      <button
        type="button"
        className="mobile-menu-btn"
        aria-label="Toggle menu"
        aria-expanded={isNavOpen}
        onClick={() => setIsNavOpen((open) => !open)}
      >
        {isNavOpen ? "✕" : "☰"}
      </button>

      <div className={`menus ${isNavOpen ? "is-open" : ""}`}>
        <ul>
          {navLinks.map(({ to, label, index }) => (
            <li key={to}>
              <Link
                style={{ textDecoration: "none" }}
                to={to}
                onClick={() => handleMenuClick(index)}
              >
                <p className={selectedMenu === index ? activeMenuClass : menuClass}>
                  {label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick} style={{ position: 'relative', cursor: 'pointer' }}>
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
          {isProfileDropdownOpen && (
            <div
              className="profile-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: 6,
                padding: 8,
                marginTop: 6,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: 120,
              }}
            >
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
