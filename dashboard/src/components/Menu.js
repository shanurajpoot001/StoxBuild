import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handle = (e) => setIsMobile(e.matches);
    handle(mql);
    mql.addEventListener('change', handle);
    return () => mql.removeEventListener('change', handle);
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Read logged-in user from localStorage
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
    window.location.href = "http://localhost:3000/";
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
           >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          {/* Mobile: show a Portfolio dropdown containing Holdings/Positions/Funds (and Orders/Apps); Desktop: render them as separate items */}
          {isMobile ? (
            <li style={{ position: 'relative' }}>
              <button
                onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <p className={selectedMenu === 2 || selectedMenu === 3 || selectedMenu === 4 || selectedMenu === 1 || selectedMenu === 6 ? activeMenuClass : menuClass}>
                  Portfolio ▾
                </p>
              </button>
              {isPortfolioOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#ffffff',
                    border: '1px solid #eee',
                    borderRadius: 6,
                    padding: 8,
                    minWidth: 160,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: '4px 6px' }}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/holdings"
                      onClick={() => { setIsPortfolioOpen(false); handleMenuClick(2); }}
                    >
                      <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p>
                    </Link>
                  </div>
                  <div style={{ padding: '4px 6px' }}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/positions"
                      onClick={() => { setIsPortfolioOpen(false); handleMenuClick(3); }}
                    >
                      <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p>
                    </Link>
                  </div>
                  <div style={{ padding: '4px 6px' }}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="funds"
                      onClick={() => { setIsPortfolioOpen(false); handleMenuClick(4); }}
                    >
                      <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>Funds</p>
                    </Link>
                  </div>

                  <hr />
                  <div style={{ padding: '4px 6px' }}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/orders"
                      onClick={() => { setIsPortfolioOpen(false); handleMenuClick(1); }}
                    >
                      <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Orders</p>
                    </Link>
                  </div>
                  <div style={{ padding: '4px 6px' }}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/apps"
                      onClick={() => { setIsPortfolioOpen(false); handleMenuClick(6); }}
                    >
                      <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>Apps</p>
                    </Link>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  to="/orders"
                  onClick={() => handleMenuClick(1)}
                >
                  <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                    Orders
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  to="/holdings"
                  onClick={() => handleMenuClick(2)}
                >
                  <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                    Holdings
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  to="/positions"
                  onClick={() => handleMenuClick(3)}
                >
                  <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                    Positions
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  to="funds"
                  onClick={() => handleMenuClick(4)}
                >
                  <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                    Funds
                  </p>
                </Link>
              </li>
              <li>
                <Link
                  style={{ textDecoration: "none" }}
                  to="/apps"
                  onClick={() => handleMenuClick(6)}
                >
                  <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                    Apps
                  </p>
                </Link>
              </li>
            </>
          )}
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
                zIndex: 1000
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  width: '100%'
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
