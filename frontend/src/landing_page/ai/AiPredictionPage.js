import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './AiPredictionPage.css';

const API_BASE = (process.env.REACT_APP_API_BASE || 'https://stoxbuild-backend.onrender.com').replace(/\/$/, '');
const symbols = ['INFY', 'TCS', 'RELIANCE', 'HDFCBANK', 'SBIN', 'WIPRO', 'M&M', 'HINDUNILVR'];

const money = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

const SparkChart = ({ candles = [], forecast = [] }) => {
  const points = useMemo(() => {
    const history = candles.slice(-40).map((item) => ({
      label: item.time?.slice(5, 10),
      value: Number(item.close),
      type: 'history',
    }));
    const future = forecast.map((item) => ({
      label: item.date?.slice(5, 10),
      value: Number(item.price),
      type: 'forecast',
    }));
    return [...history, ...future].filter((item) => Number.isFinite(item.value));
  }, [candles, forecast]);

  if (points.length < 2) {
    return <div className="public-chart-empty">Waiting for market data...</div>;
  }

  const width = 760;
  const height = 280;
  const pad = 28;
  const values = points.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const toX = (index) => pad + (index / (points.length - 1)) * (width - pad * 2);
  const toY = (value) => height - pad - ((value - min) / spread) * (height - pad * 2);

  const historyPath = points
    .map((point, index) => (point.type === 'history' ? `${index === 0 ? 'M' : 'L'} ${toX(index)} ${toY(point.value)}` : null))
    .filter(Boolean)
    .join(' ');
  const firstForecast = points.findIndex((point) => point.type === 'forecast');
  const forecastPath =
    firstForecast > -1
      ? points
          .slice(Math.max(firstForecast - 1, 0))
          .map((point, offset) => `${offset === 0 ? 'M' : 'L'} ${toX(Math.max(firstForecast - 1, 0) + offset)} ${toY(point.value)}`)
          .join(' ')
      : '';

  return (
    <svg className="public-ai-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Stock prediction chart">
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
      <line x1={pad} y1={pad} x2={pad} y2={height - pad} />
      <path d={historyPath} className="history-line" />
      {forecastPath && <path d={forecastPath} className="forecast-line" />}
      {points.map((point, index) => (
        <circle key={`${point.label}-${index}`} cx={toX(index)} cy={toY(point.value)} r={point.type === 'forecast' ? 3 : 2} />
      ))}
      <text x={pad} y={22}>{money(max)}</text>
      <text x={pad} y={height - 8}>{money(min)}</text>
    </svg>
  );
};

function AiPredictionPage() {
  const [symbol, setSymbol] = useState('INFY');
  const [days, setDays] = useState(10);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE}/api/ai/predict`, {
          params: { symbol, days },
          timeout: 30000,
        });
        if (!ignore) setData(response.data);
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.error || 'AI prediction is not available right now.');
          setData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [symbol, days]);

  const forecast = data?.forecast;
  const advice = data?.advice;

  return (
    <main className="public-ai-page">
      <section className="public-ai-hero">
        <div className="container">
          <div className="public-ai-hero-branding">
            <div className="public-ai-bot-logo" aria-hidden="true">
              <div className="public-ai-bot-head">
                <div className="public-ai-bot-eye left" />
                <div className="public-ai-bot-eye right" />
                <div className="public-ai-bot-mouth" />
              </div>
            </div>
            <div>
              <p className="eyebrow">AI market lab</p>
              <h1>Stock prediction before you login</h1>
            </div>
          </div>
          <p>
            Select a stock, choose a forecast window, and review an AI-assisted trend estimate with practical risk notes.
          </p>
          <div className="public-ai-controls">
            <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
              {symbols.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(event) => setDays(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="container public-ai-workspace">
        {error && <div className="public-alert">{error}</div>}
        <div className="public-chart-panel">
          <div className="public-panel-head">
            <div>
              <span>{symbol}</span>
              <h2>{loading ? 'Training on latest candles...' : 'Prediction chart'}</h2>
            </div>
            {forecast && <strong className={`signal signal-${forecast.action?.toLowerCase()}`}>{forecast.action}</strong>}
          </div>
          <SparkChart candles={data?.candles} forecast={forecast?.prediction} />
        </div>

        {forecast && (
          <div className="public-ai-grid">
            <div><span>Current</span><strong>{money(forecast.currentPrice)}</strong></div>
            <div><span>Target</span><strong>{money(forecast.predictedPrice)}</strong></div>
            <div><span>Expected return</span><strong>{forecast.expectedReturn}%</strong></div>
            <div><span>Confidence</span><strong>{Math.round(forecast.confidence * 100)}%</strong></div>
          </div>
        )}

        {advice && (
          <div className="public-ai-advice">
            <span>{advice.provider === 'gemini-rag' ? 'Gemini RAG analysis' : 'Local AI analysis'}</span>
            <p>{advice.summary}</p>
          </div>
        )}
        <p className="public-ai-note">Educational estimate only. Markets are risky, and predictions are never guaranteed.</p>
      </section>
    </main>
  );
}

export default AiPredictionPage;
