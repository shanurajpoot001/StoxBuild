import React, { useState, useEffect } from "react";
import ScrollReveal from "./ui/ScrollReveal";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCompact, formatMoney, formatPercent } from "../services/marketData";

const Summary = () => {
  const [username, setUsername] = useState("USER");
  const { holdings, positions, orders, totals, asOf, quoteError } = useDashboardData();
  const openingBalance = 75000;
  const usedMargin = positions.reduce((sum, item) => sum + item.currentValue * 0.2, 0);
  const availableMargin = Math.max(openingBalance + totals.pnl - usedMargin, 0);

  useEffect(() => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user")) || null;
      } catch (_e) {
        return null;
      }
    })();
    setUsername(user?.username || "USER");
  }, []);

  return (
    <div className="content-enter">
      <ScrollReveal>
        <div className="username">
          <p className="username">Welcome : {username.toUpperCase()}</p>
          <hr className="divider" />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="section">
          <span><p>Equity</p></span>
          <p className="live-status">
            {quoteError
              ? "Live quotes temporarily unavailable; showing portfolio database values."
              : `Live prices updated ${asOf ? new Date(asOf).toLocaleTimeString() : "now"}`}
          </p>
          <div className="data">
            <div className="first">
              <h3>{formatCompact(availableMargin)}</h3>
              <p>Margin available</p>
            </div>
            <hr />
            <div className="second">
              <p>Margins used <span>{formatMoney(usedMargin)}</span></p>
              <p>Opening balance <span>{formatMoney(openingBalance)}</span></p>
              <p>Orders today <span>{orders.length}</span></p>
            </div>
          </div>
          <hr className="divider" />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="section">
          <span><p>Holdings ({holdings.length})</p></span>
          <div className="data">
            <div className="first">
              <h3 className={totals.pnl >= 0 ? "profit" : "loss"}>
                {formatCompact(totals.pnl)} <small>{formatPercent(totals.pnlPercent)}</small>
              </h3>
              <p>P&L</p>
            </div>
            <hr />
            <div className="second">
              <p>Current Value <span>{formatMoney(totals.currentValue)}</span></p>
              <p>Investment <span>{formatMoney(totals.investment)}</span></p>
            </div>
          </div>
          <hr className="divider" />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Summary;
