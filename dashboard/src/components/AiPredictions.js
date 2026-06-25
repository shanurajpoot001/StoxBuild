import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { fetchAiPrediction, formatMoney, watchSymbols } from "../services/marketData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${formatMoney(context.raw)}`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => formatMoney(value),
      },
    },
  },
};

const actionClass = (action = "") => {
  if (action === "BUY") return "profit";
  if (action === "SELL") return "loss";
  return "";
};

const AiPredictions = () => {
  const [symbol, setSymbol] = useState(watchSymbols[0]);
  const [days, setDays] = useState(10);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadPrediction = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAiPrediction(symbol, days);
        if (!ignore) setPrediction(data);
      } catch (err) {
        if (!ignore) {
          setError(err?.response?.data?.error || "AI prediction unavailable");
          setPrediction(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadPrediction();
    const timer = setInterval(loadPrediction, 60000);
    return () => {
      ignore = true;
      clearInterval(timer);
    };
  }, [symbol, days]);

  const chartData = useMemo(() => {
    const candles = prediction?.candles || [];
    const forecast = prediction?.forecast?.prediction || [];
    const labels = [
      ...candles.map((item) => item.time.slice(5, 10)),
      ...forecast.map((item) => item.date.slice(5, 10)),
    ];
    const historyValues = candles.map((item) => item.close);
    const forecastValues = [
      ...Array(Math.max(candles.length - 1, 0)).fill(null),
      candles[candles.length - 1]?.close || null,
      ...forecast.map((item) => item.price),
    ];

    return {
      labels,
      datasets: [
        {
          label: "Historical close",
          data: historyValues,
          borderColor: "#4184f3",
          backgroundColor: "rgba(65, 132, 243, 0.14)",
          pointRadius: 0,
          tension: 0.25,
        },
        {
          label: "AI forecast",
          data: forecastValues,
          borderColor: "#f56834",
          backgroundColor: "rgba(245, 104, 52, 0.14)",
          borderDash: [6, 4],
          pointRadius: 2,
          tension: 0.25,
        },
      ],
    };
  }, [prediction]);

  const forecast = prediction?.forecast;
  const advice = prediction?.advice;

  return (
    <div className="content-enter ai-page">
      <div className="ai-header">
        <div>
          <span className="ai-kicker">
            <PsychologyIcon fontSize="small" /> StoxFlow AI Bot
          </span>
          <h2>AI Stock Mentor</h2>
          <p className="live-status">
            {loading
              ? "Refreshing predictions..."
              : prediction?.asOf
              ? `Updated ${new Date(prediction.asOf).toLocaleTimeString()}`
              : "Select a stock to generate prediction"}
          </p>
        </div>
        <div className="ai-controls">
          <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
            {watchSymbols.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
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

      {error && <p className="fund-message loss">{error}</p>}

      {forecast && (
        <div className="ai-metrics">
          <div>
            <span>Signal</span>
            <strong className={actionClass(forecast.action)}>{forecast.action}</strong>
          </div>
          <div>
            <span>Current</span>
            <strong>{formatMoney(forecast.currentPrice)}</strong>
          </div>
          <div>
            <span>Target {days}D</span>
            <strong>{formatMoney(forecast.predictedPrice)}</strong>
          </div>
          <div>
            <span>Return</span>
            <strong className={forecast.expectedReturn >= 0 ? "profit" : "loss"}>
              {forecast.expectedReturn}%
            </strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>{Math.round(forecast.confidence * 100)}%</strong>
          </div>
        </div>
      )}

      <div className="ai-chart-panel">
        <div className="ai-panel-title">
          <AutoGraphIcon fontSize="small" />
          <span>{symbol} forecast chart</span>
        </div>
        <div className="ai-chart">
          {prediction ? <Line data={chartData} options={chartOptions} /> : null}
        </div>
      </div>

      {advice && (
        <div className="ai-advice-grid">
          <div className="ai-advice">
            <span>{advice.provider === "gemini-rag" ? "Gemini analysis" : "Local analysis"}</span>
            <p>{advice.summary}</p>
          </div>
          <div className="ai-advice">
            <span>Risk</span>
            <p>{advice.risk || "Moderate"}</p>
          </div>
          <div className="ai-advice">
            <span>Indicators</span>
            <p>
              RSI {forecast.indicators.rsi}, EMA {forecast.indicators.shortEma}/
              {forecast.indicators.longEma}, Vol {forecast.indicators.volatility}%
            </p>
          </div>
        </div>
      )}

      <p className="live-status">{prediction?.disclaimer}</p>
    </div>
  );
};

export default AiPredictions;
