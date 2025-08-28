import React from "react";
import Menu from "./Menu";

const TopBar = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (_e) {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("user");
    const LANDING_URL = (process.env.REACT_APP_LANDING_URL || 'https://stoxbuild-frontend.onrender.com').replace(/\/$/, '');
    window.location.href = `${LANDING_URL}/login`;
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user?.username && (
          <span className="text-success">Welcome, {user.username}</span>
        )}
        <button
          onClick={handleLogout}
          style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
