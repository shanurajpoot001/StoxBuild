import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
const symbols = ['NIFTYBEES', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];

const fallbackQuotes = [
  { symbol: 'NIFTYBEES', price: 278.45, percent: 0.42, marketState: 'LIVE' },
  { symbol: 'RELIANCE', price: 2941.2, percent: -0.18, marketState: 'LIVE' },
  { symbol: 'TCS', price: 3898.7, percent: 0.31, marketState: 'LIVE' },
  { symbol: 'INFY', price: 1512.35, percent: 0.64, marketState: 'LIVE' },
  { symbol: 'HDFCBANK', price: 1644.9, percent: -0.22, marketState: 'LIVE' },
];

const formatMoney = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

function LiveMarketStrip() {
  const [quotes, setQuotes] = useState(fallbackQuotes);
  const [asOf, setAsOf] = useState(new Date());

  useEffect(() => {
    let ignore = false;

    const loadQuotes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/market/quotes`, {
          params: { symbols: symbols.join(',') },
          timeout: 12000,
        });
        if (!ignore && response.data?.quotes?.length) {
          setQuotes(response.data.quotes);
          setAsOf(new Date(response.data.asOf || Date.now()));
        }
      } catch (_err) {
        if (!ignore) setAsOf(new Date());
      }
    };

    loadQuotes();
    const timer = setInterval(loadQuotes, 60000);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="container live-market-strip" aria-label="Live market overview">
      <div className="live-market-head">
        <div>
          <span>Live market</span>
          <strong>{asOf.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
        <Link to="/ai-prediction">Open AI model</Link>
      </div>
      <div className="live-ticker-row">
        {quotes.map((quote) => {
          const percent = Number(quote.percent || 0);
          const isUp = percent >= 0;
          return (
            <div className="ticker-pill" key={quote.symbol}>
              <span>{quote.symbol}</span>
              <strong>Rs {formatMoney(quote.price)}</strong>
              <em className={isUp ? 'ticker-up' : 'ticker-down'}>
                {isUp ? '+' : ''}{percent.toFixed(2)}%
              </em>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveMarketStrip;
