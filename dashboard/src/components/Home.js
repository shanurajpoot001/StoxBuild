import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import PageLoader from "./ui/PageLoader";

const Home = () => {
  useEffect(() => {
    const LANDING_URL = (process.env.REACT_APP_LANDING_URL || 'https://stoxbuild-frontend.onrender.com').replace(/\/$/, '');

    const search = new URLSearchParams(window.location.search);
    const urlUsername = search.get('username');
    const urlToken = search.get('token');
    if (urlUsername && urlToken) {
      localStorage.setItem('user', JSON.stringify({ username: urlUsername, token: urlToken }));
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
    }

    const raw = localStorage.getItem("user");
    if (!raw) {
      window.location.href = `${LANDING_URL}/signup`;
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (!user || !user.token) {
        localStorage.removeItem("user");
        window.location.href = `${LANDING_URL}/signup`;
      }
    } catch (_e) {
      localStorage.removeItem("user");
      window.location.href = `${LANDING_URL}/signup`;
    }
  }, []);

  return (
    <div className="dashboard-enter">
      <PageLoader />
      <TopBar />
      <Dashboard />
    </div>
  );
};

export default Home;
