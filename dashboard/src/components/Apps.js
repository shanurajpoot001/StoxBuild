import React from "react";
import ScrollReveal from "./ui/ScrollReveal";
import { useDashboardData } from "../hooks/useDashboardData";

const Apps = () => {
  const { watchlist, holdings, orders, asOf, quoteError } = useDashboardData();

  return (
    <div className="content-enter">
      <ScrollReveal>
        <h3 className="title">Connected Apps</h3>
        <div className="app-grid">
          <div className="app-card">
            <span>Market Data</span>
            <h4>{quoteError ? "Retrying" : "Live"}</h4>
            <p>
              {quoteError ||
                `Tracking ${watchlist.length} symbols. Last refresh ${
                  asOf ? new Date(asOf).toLocaleTimeString() : "in progress"
                }.`}
            </p>
          </div>
          <div className="app-card">
            <span>Portfolio Sync</span>
            <h4>{holdings.length} holdings</h4>
            <p>Holdings, positions, and chart values are recomputed from live prices.</p>
          </div>
          <div className="app-card">
            <span>Order Book</span>
            <h4>{orders.length} orders</h4>
            <p>Buy window orders are pulled from the backend and update dashboard totals.</p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Apps;
