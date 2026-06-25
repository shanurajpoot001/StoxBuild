import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_BASE || "https://stoxbuild-backend.onrender.com";

export const watchSymbols = [
  "INFY",
  "ONGC",
  "TCS",
  "KPITTECH",
  "QUICKHEAL",
  "WIPRO",
  "M&M",
  "RELIANCE",
  "HINDUNILVR",
];

const numberOrZero = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatMoney = (value) =>
  numberOrZero(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

export const formatCompact = (value) =>
  numberOrZero(value).toLocaleString("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

export const formatPercent = (value) => {
  const number = numberOrZero(value);
  const sign = number > 0 ? "+" : "";
  return `${sign}${number.toFixed(2)}%`;
};

export const apiGet = async (path, fallback = []) => {
  try {
    const response = await axios.get(`${API_BASE}${path}`);
    return response.data || fallback;
  } catch (_error) {
    return fallback;
  }
};

export const apiPost = async (path, payload = {}) => {
  const response = await axios.post(`${API_BASE}${path}`, payload);
  return response.data;
};

export const fetchQuotes = async (symbols) => {
  const uniqueSymbols = [...new Set(symbols.filter(Boolean))];
  if (!uniqueSymbols.length) return { quotes: [], asOf: null, error: null };

  try {
    const response = await axios.get(`${API_BASE}/api/market/quotes`, {
      params: { symbols: uniqueSymbols.join(",") },
    });
    return {
      quotes: response.data?.quotes || [],
      asOf: response.data?.asOf || null,
      error: null,
    };
  } catch (error) {
    return {
      quotes: [],
      asOf: null,
      error: error?.response?.data?.error || "Live quotes unavailable",
    };
  }
};

export const fetchAiPrediction = async (symbol, days = 10) => {
  const response = await axios.get(`${API_BASE}/api/ai/predict`, {
    params: { symbol, days },
  });
  return response.data;
};

export const quoteMapFrom = (quotes) =>
  quotes.reduce((map, quote) => {
    map[quote.symbol] = quote;
    return map;
  }, {});

export const enrichInstrument = (instrument, quotesBySymbol) => {
  const quote = quotesBySymbol[instrument.name] || {};
  const livePrice = numberOrZero(quote.price || instrument.price);
  const avg = numberOrZero(instrument.avg);
  const qty = numberOrZero(instrument.qty);
  const investment = avg * qty;
  const currentValue = livePrice * qty;
  const pnl = currentValue - investment;
  const netPercent = investment ? (pnl / investment) * 100 : 0;
  const dayPercent = numberOrZero(quote.percent);

  return {
    ...instrument,
    price: livePrice,
    currentValue,
    investment,
    pnl,
    net: formatPercent(netPercent),
    day: formatPercent(dayPercent),
    isLoss: dayPercent < 0,
    quote,
  };
};

export const portfolioTotals = (items) => {
  const investment = items.reduce((sum, item) => sum + numberOrZero(item.investment), 0);
  const currentValue = items.reduce((sum, item) => sum + numberOrZero(item.currentValue), 0);
  const pnl = currentValue - investment;
  const pnlPercent = investment ? (pnl / investment) * 100 : 0;

  return { investment, currentValue, pnl, pnlPercent };
};
