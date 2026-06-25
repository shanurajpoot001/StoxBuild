import React from "react";
import { VerticalGraph } from "./VerticalGraph";
import ScrollReveal from "./ui/ScrollReveal";
import { SkeletonRow, SkeletonTitle } from "./ui/Skeleton";
import { formatCompact, formatMoney, formatPercent } from "../services/marketData";
import { useDashboardData } from "../hooks/useDashboardData";

const Holdings = () => {
  const { holdings: allHoldings, totals, loading, asOf, quoteError } = useDashboardData();
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Live current value",
        data: allHoldings.map((stock) => stock.currentValue),
        backgroundColor: "rgba(65, 132, 243, 0.55)",
      },
    ],
  };

  return (
    <div className="content-enter">
      {loading ? (
        <>
          <SkeletonTitle />
          <SkeletonRow count={8} />
        </>
      ) : (
        <ScrollReveal>
          <h3 className="title">Holdings ({allHoldings.length})</h3>
          <p className="live-status">
            {quoteError
              ? "Live quotes temporarily unavailable; showing last portfolio prices."
              : `Live prices updated ${asOf ? new Date(asOf).toLocaleTimeString() : "now"}`}
          </p>

          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const curValue = stock.price * stock.qty;
                  const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                  const profClass = isProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={index}>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{formatMoney(stock.avg)}</td>
                      <td>{formatMoney(stock.price)}</td>
                      <td>{formatMoney(curValue)}</td>
                      <td className={profClass}>{formatMoney(stock.pnl)}</td>
                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <h5>{formatMoney(totals.investment)}</h5>
              <p>Total investment</p>
            </div>
            <div className="col">
              <h5>{formatMoney(totals.currentValue)}</h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5>
                {formatCompact(totals.pnl)} ({formatPercent(totals.pnlPercent)})
              </h5>
              <p>P&L</p>
            </div>
          </div>
          <VerticalGraph data={data} />
        </ScrollReveal>
      )}
    </div>
  );
};

export default Holdings;
