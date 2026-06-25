import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiGet,
  enrichInstrument,
  fetchQuotes,
  portfolioTotals,
  quoteMapFrom,
  watchSymbols,
} from "../services/marketData";

const REFRESH_MS = 30000;

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const defaultFunds = {
  openingBalance: 75000,
  totalAdded: 0,
  totalWithdrawn: 0,
  cashBalance: 75000,
  transactions: [],
  commodityEnabled: false,
  commodityOpenedAt: null,
  upiId: "",
};

export const useDashboardData = () => {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [funds, setFunds] = useState(defaultFunds);
  const [quotes, setQuotes] = useState([]);
  const [asOf, setAsOf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(null);

  const load = useCallback(async (mounted = true) => {
    const [holdingRows, positionRows, orderRows, fundsSummary] = await Promise.all([
      apiGet("/allHoldings"),
      apiGet("/allPositions"),
      apiGet("/allOrders"),
      apiGet("/api/funds", defaultFunds),
    ]);

    const portfolioSymbols = [
      ...normalizeArray(holdingRows).map((item) => item.name),
      ...normalizeArray(positionRows).map((item) => item.name),
    ];
    const quoteResponse = await fetchQuotes([...watchSymbols, ...portfolioSymbols]);

    if (!mounted) return;
    setHoldings(normalizeArray(holdingRows));
    setPositions(normalizeArray(positionRows));
    setOrders(normalizeArray(orderRows));
    setFunds({ ...defaultFunds, ...(fundsSummary || {}) });
    setQuotes(quoteResponse.quotes);
    setAsOf(quoteResponse.asOf);
    setQuoteError(quoteResponse.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const intervalId = window.setInterval(load, REFRESH_MS);
    const refreshAfterOrder = () => load(true);
    window.addEventListener("stoxflow:order-executed", refreshAfterOrder);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("stoxflow:order-executed", refreshAfterOrder);
    };
  }, [load]);

  return useMemo(() => {
    const quotesBySymbol = quoteMapFrom(quotes);
    const liveHoldings = holdings.map((item) => enrichInstrument(item, quotesBySymbol));
    const livePositions = positions.map((item) => enrichInstrument(item, quotesBySymbol));
    const liveWatchlist = watchSymbols.map((symbol) => {
      const quote = quotesBySymbol[symbol] || {};
      const percent = Number(quote.percent || 0);
      return {
        name: symbol,
        price: Number(quote.price || 0),
        percent,
        percentLabel: `${percent > 0 ? "+" : ""}${percent.toFixed(2)}%`,
        isDown: percent < 0,
        exchange: quote.exchange || "NSE",
        marketState: quote.marketState || "UNKNOWN",
      };
    });

    return {
      holdings: liveHoldings,
      positions: livePositions,
      orders,
      funds,
      watchlist: liveWatchlist,
      totals: portfolioTotals(liveHoldings),
      loading,
      asOf,
      quoteError,
      refresh: () => load(true),
    };
  }, [holdings, positions, orders, funds, quotes, loading, asOf, quoteError, load]);
};
