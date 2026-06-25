import React, { useState, useContext } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, initialMode = "BUY" }) => {
  const { closeBuyWindow } = useContext(GeneralContext);
  const [orderMode, setOrderMode] = useState(initialMode);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [paymentMethod, setPaymentMethod] = useState("Funds");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOrderClick = async () => {
    const API_BASE = process.env.REACT_APP_API_BASE || "https://stoxbuild-backend.onrender.com";
    setSubmitting(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API_BASE}/newOrder`, {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: orderMode,
        paymentMethod,
      });
      window.dispatchEvent(new CustomEvent("stoxflow:order-executed", { detail: data }));
      closeBuyWindow();
    } catch (error) {
      setMessage(error?.response?.data?.error || "Order failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSell = orderMode === "SELL";

  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <div className="order-window-head">
          <div>
            <span>{uid}</span>
            <h3>{isSell ? "Sell stock" : "Buy stock"}</h3>
          </div>
          <div className="order-mode-tabs" role="tablist" aria-label="Order type">
            <button
              type="button"
              className={orderMode === "BUY" ? "active buy-tab" : ""}
              onClick={() => setOrderMode("BUY")}
            >
              Buy
            </button>
            <button
              type="button"
              className={orderMode === "SELL" ? "active sell-tab" : ""}
              onClick={() => setOrderMode("SELL")}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
        <label className="payment-method">
          <span>Payment method</span>
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="Funds">Available funds</option>
            <option value="UPI">UPI</option>
            <option value="Netbanking">Netbanking</option>
          </select>
        </label>
        {message && <p className="order-error">{message}</p>}
      </div>

      <div className="buttons">
        <span>{isSell ? "Sell credit adds to funds instantly" : "Buy amount debits available funds"}</span>
        <div>
          <button type="button" className={`btn ${isSell ? "btn-red" : "btn-blue"}`} onClick={handleOrderClick} disabled={submitting}>
            {submitting ? "Processing" : isSell ? "Sell" : "Buy"}
          </button>
          <button type="button" className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
