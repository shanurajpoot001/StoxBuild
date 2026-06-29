import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = (process.env.REACT_APP_API_BASE || 'https://stoxbuild-backend.onrender.com').replace(/\/$/, '');

const fallbackAnswer = (question) => {
  const text = question.toLowerCase();
  if (text.includes('sell')) return 'Sell when your target hits, your stop-loss hits, or your original trade reason is no longer valid. Avoid emotional exits.';
  if (text.includes('buy')) return 'Before buying, check trend, support, resistance, volume, news, capital risk, target, and stop-loss.';
  if (text.includes('intraday')) return 'Intraday means entry and exit on the same trading day. Use strict stop-loss and small quantities while learning.';
  return 'Start with risk management: learn order types, position sizing, support/resistance, and never treat AI output as guaranteed profit.';
};

function FloatingAiBot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi, I am your StoxFlow mentor. Ask me about buy, sell, intraday, stop-loss, or AI signals.' },
  ]);
  const [loading, setLoading] = useState(false);

  const askBot = async (event) => {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    setMessages((items) => [...items, { role: 'user', text: cleanQuestion }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/ai/mentor`, { question: cleanQuestion }, { timeout: 25000 });
      setMessages((items) => [...items, { role: 'bot', text: response.data?.answer || fallbackAnswer(cleanQuestion) }]);
    } catch (_error) {
      setMessages((items) => [...items, { role: 'bot', text: fallbackAnswer(cleanQuestion) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floating-ai-bot">
      {open && (
        <section className="ai-bot-panel" aria-label="AI mentor chat">
          <div className="ai-bot-head">
            <div>
              <span>AI Mentor</span>
              <strong>Trading help</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI mentor">x</button>
          </div>
          <div className="ai-bot-messages">
            {messages.map((message, index) => (
              <p className={`ai-bot-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</p>
            ))}
            {loading && <p className="ai-bot-message bot">Thinking...</p>}
          </div>
          <form className="ai-bot-form" onSubmit={askBot}>
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about trading..."
            />
            <button type="submit" disabled={loading}>Ask</button>
          </form>
        </section>
      )}
      <button type="button" className="ai-bot-fab" onClick={() => setOpen((value) => !value)} aria-label="Open AI mentor">
        <span className="ai-bot-face" aria-hidden="true">
          <span></span>
        </span>
      </button>
    </div>
  );
}

export default FloatingAiBot;
