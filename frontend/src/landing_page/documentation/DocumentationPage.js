import React, { useState } from 'react';
import axios from 'axios';
import './DocumentationPage.css';

const API_BASE = (process.env.REACT_APP_API_BASE || 'https://stoxbuild-backend.onrender.com').replace(/\/$/, '');

const sections = [
  {
    title: 'Start here: how StoxFlow works',
    items: [
      'Use the landing page to learn, check live market movement, and try the AI model without login.',
      'Register only when you want to place demo orders, manage funds, or open the dashboard.',
      'The dashboard includes watchlist, holdings, positions, orders, funds, and AI prediction.',
      'Watchlist tracks symbols; holdings show delivery investments; positions show active trades.',
    ],
  },
  {
    title: 'Buying a stock: simple process',
    items: [
      'Choose a liquid stock from the watchlist or search by symbol.',
      'Check price trend, support zone, resistance zone, volume, news, and broader market direction.',
      'Decide entry price, quantity, target, stop-loss, and maximum risk before clicking buy.',
      'Use small position size while learning; never buy only because a candle is moving fast.',
    ],
  },
  {
    title: 'Selling a stock: when and why',
    items: [
      'Sell to book profit, cut loss, rebalance, or exit when your thesis changes.',
      'For delivery holdings, selling reduces or closes your owned quantity.',
      'For intraday or derivatives, selling can create short exposure and needs stricter risk control.',
      'Always decide exit rules before entry.',
    ],
  },
  {
    title: 'Main trading and investing types',
    items: [
      'Delivery: Buy shares and hold beyond the trading day.',
      'Intraday: Buy and sell within the same day; positions are closed before market close.',
      'Swing trading: Hold for days or weeks based on trend and support/resistance.',
      'Futures and Options: Leveraged derivative contracts with expiry, margin, and higher risk.',
      'Long-term investing: Build positions based on fundamentals, valuation, and time horizon.',
    ],
  },
  {
    title: 'How to read a stock before trading',
    items: [
      'Trend: higher highs and higher lows usually show strength; lower highs and lower lows show weakness.',
      'Support: a price area where buyers have appeared earlier.',
      'Resistance: a price area where sellers have appeared earlier.',
      'Volume: higher volume with price movement gives stronger confirmation than low-volume movement.',
      'News and results: earnings, management updates, sector news, and global cues can change the setup quickly.',
    ],
  },
  {
    title: 'Beginner risk rules',
    items: [
      'Risk only a small fixed percentage per trade, such as 1% of available capital while learning.',
      'Do not average down blindly when the stock is falling against your plan.',
      'Avoid trading illiquid stocks where entry is easy but exit is difficult.',
      'Keep a trade journal with reason, entry, exit, mistake, and learning.',
      'AI, indicators, and tips are research inputs; your risk plan matters more than the signal.',
    ],
  },
  {
    title: 'Before placing any order',
    items: [
      'Never risk money needed for essentials.',
      'Use stop-losses and position sizing.',
      'Avoid overtrading after profit or loss.',
      'Check news, market trend, volume, and liquidity.',
      'Treat AI prediction as research support, not a guaranteed signal.',
    ],
  },
];

function DocumentationPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askMentor = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const response = await axios.post(
        `${API_BASE}/api/ai/mentor`,
        { question },
        { timeout: 30000 }
      );
      setAnswer(response.data?.answer || 'I could not answer that yet. Try asking in simpler words.');
    } catch (_err) {
      setAnswer('Mentor is unavailable right now. Please check backend server and Gemini key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="docs-page">
      <section className="docs-hero">
        <div className="container">
          <p className="eyebrow">Documentation</p>
          <h1>Learn the market before placing your first trade</h1>
          <p>
            A practical guide for new users: how the app works, how buying and selling works, and how to think about trading risk.
          </p>
        </div>
      </section>

      <section className="container docs-layout">
        <div className="docs-content">
          {sections.map((section) => (
            <article className="docs-card" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}

          <article className="docs-card">
            <h2>Common order terms</h2>
            <div className="terms-grid">
              <div><strong>Market order</strong><p>Executes quickly near the best available market price.</p></div>
              <div><strong>Limit order</strong><p>Executes only at your selected price or better.</p></div>
              <div><strong>Stop-loss</strong><p>Triggers an exit when price moves against your plan.</p></div>
              <div><strong>Target</strong><p>A pre-decided price where you book profit.</p></div>
              <div><strong>CNC / Delivery</strong><p>Used when you want to carry shares after market close.</p></div>
              <div><strong>MIS / Intraday</strong><p>Used when the position is meant to close on the same day.</p></div>
              <div><strong>Long</strong><p>You buy first because you expect price to rise.</p></div>
              <div><strong>Short</strong><p>You sell first because you expect price to fall; risk can be higher.</p></div>
            </div>
          </article>
        </div>

        <aside className="mentor-panel">
          <span>AI mentor bot</span>
          <h2>Ask a stock market question</h2>
          <form onSubmit={askMentor}>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: What is intraday trading?"
              rows="5"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Thinking...' : 'Ask mentor'}
            </button>
          </form>
          {answer && <p className="mentor-answer">{answer}</p>}
        </aside>
      </section>
    </main>
  );
}

export default DocumentationPage;
