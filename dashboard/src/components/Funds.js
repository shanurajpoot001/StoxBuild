import React, { useEffect, useState } from "react";
import ScrollReveal from "./ui/ScrollReveal";
import { useDashboardData } from "../hooks/useDashboardData";
import { apiPost, formatMoney } from "../services/marketData";
import { DepositFunds, PaymentHistory } from "./StripePaymentForm";

const Funds = () => {
  const { positions, totals, funds, refresh } = useDashboardData();
  const [activeAction, setActiveAction] = useState("ADD");
  const [paymentMode, setPaymentMode] = useState("UPI"); // "UPI" or "STRIPE"
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [upiId, setUpiId] = useState(funds.upiId || "");
  const [message, setMessage] = useState("");
  const [upiMessage, setUpiMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const openingBalance = Number(funds.openingBalance || 75000);
  const usedMargin = positions.reduce((sum, item) => sum + item.currentValue * 0.2, 0);
  const cashBalance = Number(funds.cashBalance || openingBalance);
  const availableMargin = Math.max(cashBalance + totals.pnl - usedMargin, 0);

  useEffect(() => {
    setUpiId(funds.upiId || "");
  }, [funds.upiId]);

  const handleFundSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (method === "UPI" && !upiId.trim()) {
      setMessage("Please save your UPI ID before sending a UPI payment.");
      setSubmitting(false);
      return;
    }

    try {
      const path = activeAction === "ADD" ? "/api/funds/add" : "/api/funds/withdraw";
      await apiPost(path, {
        amount: Number(amount),
        method,
        upiId: method === "UPI" ? upiId.trim() : "",
        note: activeAction === "ADD" ? "Added from dashboard" : "Withdrawn from dashboard",
      });
      setAmount("");
      setMessage(
        activeAction === "ADD"
          ? "Funds added successfully. Balance updated live."
          : "Withdraw request completed. Balance updated live."
      );
      await refresh();
    } catch (error) {
      setMessage(error?.response?.data?.error || "Transaction failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpiSave = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setUpiMessage("");

    try {
      await apiPost("/api/accounts/upi", { upiId });
      setUpiMessage("UPI ID saved. Payments will use this ID for recharges.");
      await refresh();
    } catch (error) {
      setUpiMessage(error?.response?.data?.error || "Unable to save UPI ID.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCommodity = async () => {
    setSubmitting(true);
    setMessage("");

    try {
      await apiPost("/api/accounts/commodity");
      setMessage("Commodity account opened successfully.");
      await refresh();
    } catch (_error) {
      setMessage("Unable to open commodity account right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-enter">
      <ScrollReveal>
        <div className="funds">
          <div className="funds-header">
            <div>
              <p>Instant fund transfers with UPI or Credit Card</p>
              <strong>Cash balance updates in real time.</strong>
            </div>
            <div className="funds-actions">
              <button
                type="button"
                className={`btn ${paymentMode === "UPI" ? "btn-green" : "btn-outline"}`}
                onClick={() => setPaymentMode("UPI")}
              >
                UPI Payment
              </button>
              <button
                type="button"
                className={`btn ${paymentMode === "STRIPE" ? "btn-green" : "btn-outline"}`}
                onClick={() => setPaymentMode("STRIPE")}
              >
                💳 Card Payment
              </button>
            </div>
          </div>

          <div className="row">
            {paymentMode === "UPI" ? (
              <>
            <div className="col">
              <span>
                <p>Equity</p>
              </span>

              <div className="table">
                <div className="data">
                  <p>Available margin</p>
                  <p className="imp colored">{formatMoney(availableMargin)}</p>
                </div>
                <div className="data">
                  <p>Used margin</p>
                  <p className="imp">{formatMoney(usedMargin)}</p>
                </div>
                <div className="data">
                  <p>Available cash</p>
                  <p className="imp">{formatMoney(cashBalance)}</p>
                </div>
                <hr />
                <div className="data">
                  <p>Opening Balance</p>
                  <p>{formatMoney(openingBalance)}</p>
                </div>
                <div className="data">
                  <p>Payin</p>
                  <p>{formatMoney(funds.totalAdded)}</p>
                </div>
                <div className="data">
                  <p>Withdrawals</p>
                  <p>{formatMoney(funds.totalWithdrawn)}</p>
                </div>
                <div className="data">
                  <p>SPAN</p>
                  <p>{formatMoney(usedMargin * 0.4)}</p>
                </div>
                <div className="data">
                  <p>Delivery margin</p>
                  <p>{formatMoney(totals.currentValue * 0.5)}</p>
                </div>
                <div className="data">
                  <p>Exposure</p>
                  <p>{formatMoney(usedMargin * 0.6)}</p>
                </div>
                <div className="data">
                  <p>Options premium</p>
                  <p>{formatMoney(0)}</p>
                </div>
                <hr />
                <div className="data">
                  <p>Collateral (Liquid funds)</p>
                  <p>{formatMoney(0)}</p>
                </div>
                <div className="data">
                  <p>Collateral (Equity)</p>
                  <p>{formatMoney(totals.currentValue)}</p>
                </div>
                <div className="data">
                  <p>Total Collateral</p>
                  <p>{formatMoney(totals.currentValue)}</p>
                </div>
              </div>

              <form className="fund-action-panel" onSubmit={handleFundSubmit}>
                <div>
                  <span>{activeAction === "ADD" ? "Add funds" : "Withdraw funds"}</span>
                  <p>
                    {activeAction === "ADD"
                      ? "UPI transfers reflect in available cash instantly."
                      : "Withdrawals are processed from your available cash balance."}
                  </p>
                </div>
                <div className="fund-action-controls">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Amount"
                    required
                  />
                  <select value={method} onChange={(event) => setMethod(event.target.value)}>
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank</option>
                    <option value="Netbanking">Netbanking</option>
                  </select>
                  <button type="submit" className="btn btn-green" disabled={submitting}>
                    {submitting ? "Processing" : "Submit"}
                  </button>
                </div>
                <div className="fund-action-setup">
                  <label>
                    <span>Saved UPI ID</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                      placeholder="example@upi"
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-blue"
                    onClick={handleUpiSave}
                    disabled={submitting}
                  >
                    Save UPI ID
                  </button>
                </div>
                {upiMessage && <p className="fund-message">{upiMessage}</p>}
                {message && <p className="fund-message">{message}</p>}
              </form>
            </div>

            <div className="col">
              <div className="commodity">
                <p>
                  {funds.commodityEnabled
                    ? `Commodity account active${
                        funds.commodityOpenedAt
                          ? ` since ${new Date(funds.commodityOpenedAt).toLocaleDateString()}`
                          : ""
                      }`
                    : "You don't have a commodity account"}
                </p>
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={handleOpenCommodity}
                  disabled={submitting || funds.commodityEnabled}
                >
                  {funds.commodityEnabled ? "Account Active" : "Open Account"}
                </button>
              </div>
            </div>
              </>
            ) : (
              <>
                <div style={{ width: "100%", padding: "20px" }}>
                  <DepositFunds onSuccess={() => refresh()} onError={(err) => console.error(err)} />
                  <div style={{ marginTop: "40px" }}>
                    <PaymentHistory />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Funds;
