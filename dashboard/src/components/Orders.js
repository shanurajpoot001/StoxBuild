import React from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ui/ScrollReveal";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatMoney } from "../services/marketData";

const Orders = () => {
  const { orders, loading } = useDashboardData();

  return (
    <div className="orders content-enter">
      <ScrollReveal>
        <h3 className="title">Orders ({orders.length})</h3>
        {loading ? (
          <div className="no-orders">
            <p>Loading live orders...</p>
          </div>
        ) : orders.length ? (
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. price</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const qty = Number(order.qty || 0);
                  const price = Number(order.price || 0);
                  const mode = String(order.mode || "BUY").toUpperCase();

                  return (
                    <tr key={order._id || `${order.name}-${order.price}`}>
                      <td><p>{mode}</p></td>
                      <td>{order.name}</td>
                      <td>{qty}</td>
                      <td>{formatMoney(price)}</td>
                      <td>{formatMoney(qty * price)}</td>
                      <td>{order.status || "EXECUTED"}</td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders">
            <p>You have not placed any live orders yet.</p>
            <Link to={"/"} className="btn">
              Open watchlist
            </Link>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

export default Orders;
