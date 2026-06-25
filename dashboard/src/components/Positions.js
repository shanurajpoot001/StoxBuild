import React from "react";
import ScrollReveal from "./ui/ScrollReveal";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatMoney } from "../services/marketData";

const Positions = () => {
  const { positions, loading, asOf, quoteError } = useDashboardData();

  return (
    <div className="content-enter">
      <ScrollReveal>
      <h3 className="title">Positions ({positions.length})</h3>
      <p className="live-status">
        {quoteError
          ? "Live quotes temporarily unavailable; showing last position prices."
          : `Live prices updated ${asOf ? new Date(asOf).toLocaleTimeString() : "now"}`}
      </p>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
          {loading && (
            <tr>
              <td colSpan="7">Loading live positions...</td>
            </tr>
          )}

          {!loading && positions.length === 0 && (
            <tr>
              <td colSpan="7">No open positions right now.</td>
            </tr>
          )}

          {!loading && positions.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{formatMoney(stock.avg)}</td>
                <td>{formatMoney(stock.price)}</td>
                <td className={profClass}>{formatMoney(stock.pnl)}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default Positions;
