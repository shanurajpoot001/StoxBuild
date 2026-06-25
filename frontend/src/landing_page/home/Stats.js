import React from 'react'
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';
import { useCountUp } from '../../hooks/useCountUp';

function StatCounter({ end, label }) {
  const { ref, display } = useCountUp(end, 2200);
  return (
    <div ref={ref} className="premium-card p-3 text-center hover-lift">
      <h2 className="stat-number fs-2 mb-2">{display}</h2>
      <p className="text-muted mb-0">{label}</p>
    </div>
  );
}

function Stats() {
  const navigate = useNavigate();
  return (  
    <div className="container p-3">
      <div className="row p-3 p-md-5">
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-left">
          <h1 className="fs-2 mb-5">Trust with confidence</h1>
          <h2 className="fs-4">Customer-first always</h2>
          <p className="text-muted">
            That's why 1.3+ crore customers trust Zerodha with ₹3.5+ lakh crores
            worth of equity investments.
          </p>
          <h2 className="fs-4">No spam or gimmicks</h2>
          <p className="text-muted">
            No gimmicks, spam, "gamification", or annoying push notifications.
            High quality apps that you use at your pace, the way you like.
          </p>
          <h2 className="fs-4">The StoxFlow universe</h2>
          <p className="text-muted">
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>
          <h2 className="fs-4">Do better with money</h2>
          <p className="text-muted">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your
            money.
          </p>

          <div className="row g-3 mt-4">
            <div className="col-6">
              <StatCounter end="1.3+" label="Crore customers" />
            </div>
            <div className="col-6">
              <StatCounter end="15%" label="Daily order volume" />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-right" delay={150}>
          <LazyImage src="media/images/ecosystem.png" style={{ width: "90%", maxWidth: "100%" }} alt="Ecosystem" />
          <div className="stats-links">
            <a href="/product" onClick={(e) => { e.preventDefault(); navigate('/product'); }} className="link-arrow">
              Explore our products{" "}
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
            <a href="https://www.ig.com/en/demo-account" target="_blank" rel="noreferrer" className="link-arrow">
              Try Kite demo{" "}
              <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Stats;
