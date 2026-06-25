import React, { useState } from "react";
import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_BASE || "https://stoxbuild-backend.onrender.com").replace(/\/$/, "");

const fallbackAnswer = (question) => {
  const text = question.toLowerCase();
  if (text.includes("sell")) return "Sell when your target hits, your stop-loss hits, or the trade setup becomes invalid. Do not sell only because of panic.";
  if (text.includes("buy")) return "Before buying, check trend, volume, support, resistance, news, quantity, target and stop-loss.";
  if (text.includes("fund") || text.includes("payment")) return "Buy orders debit available funds instantly. Sell orders add credit back to available cash after execution.";
  return "Use small risk per trade, keep a stop-loss, and treat AI as research support instead of a guaranteed signal.";
};

function FloatingAiBot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "I am your StoxFlow AI mentor. Ask about orders, funds, buy/sell, stop-loss, or AI signals." },
  ]);
  const [loading, setLoading] = useState(false);

  const askBot = async (event) => {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    setMessages((items) => [...items, { role: "user", text: cleanQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/ai/mentor`, { question: cleanQuestion }, { timeout: 25000 });
      setMessages((items) => [...items, { role: "bot", text: response.data?.answer || fallbackAnswer(cleanQuestion) }]);
    } catch (_error) {
      setMessages((items) => [...items, { role: "bot", text: fallbackAnswer(cleanQuestion) }]);
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
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about trading..." />
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
