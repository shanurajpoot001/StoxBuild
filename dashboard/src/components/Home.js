import React, { useEffect } from "react";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  useEffect(() => {
    // If URL has username+token (coming from login on port 3000), store locally.
    const search = new URLSearchParams(window.location.search);
    const urlUsername = search.get('username');
    const urlToken = search.get('token');
    if (urlUsername && urlToken) {
      localStorage.setItem('user', JSON.stringify({ username: urlUsername, token: urlToken }));
      // clean URL
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
    }

    const raw = localStorage.getItem("user");
    if (!raw) {
      window.location.href = "http://localhost:3000/login";
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (!user || !user.token) {
        localStorage.removeItem("user");
        window.location.href = "http://localhost:3000/login";
      }
    } catch (_e) {
      localStorage.removeItem("user");
      window.location.href = "http://localhost:3000/login";
    }
  }, []);

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
