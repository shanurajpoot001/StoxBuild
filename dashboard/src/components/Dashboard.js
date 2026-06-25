import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import AiPredictions from "./AiPredictions";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <GeneralContextProvider>
        <div className="dashboard-main">
          <button
            type="button"
            className="watchlist-toggle-bar"
            onClick={() => setWatchlistOpen((open) => !open)}
            aria-expanded={watchlistOpen}
          >
            <span>{watchlistOpen ? "Hide Watchlist" : "Show Watchlist"}</span>
            <span>{watchlistOpen ? "▲" : "▼"}</span>
          </button>
          <WatchList isOpen={watchlistOpen} />
        </div>
      </GeneralContextProvider>
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/ai" element={<AiPredictions />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
