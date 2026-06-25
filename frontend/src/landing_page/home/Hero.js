import React from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import LazyImage from '../../components/ui/LazyImage';

function Hero() {
  const navigate = useNavigate();  
  return ( 
    <div className="container p-5 mb-5 hero-section">
      <div className="row text-center">
        <LazyImage
          src="media/images/homeHero.png"
          alt="StoxFlow trading platform"
          className="mb-5 hero-img"
        />
        <h1 className="mt-5 hero-title">Invest smarter with AI market tools</h1>
        <p className="hero-subtitle text-muted">
          Research stocks, learn trading basics, test AI predictions, and enter the dashboard only when you are ready.
        </p>
        <div className="hero-actions">
          <button
            className="p-2 btn btn-primary fs-5 btn-cta btn-premium btn-glow btn-gradient hero-cta"
            onClick={() => navigate('/signup')}
          >
            Register
          </button>
          <Link className="btn btn-outline-primary fs-5 btn-cta hero-ghost" to="/ai-prediction">
            Try AI Model
          </Link>
        </div>
        <div className="hero-ai-preview" aria-label="AI model preview">
          <div>
            <span>AI signal</span>
            <strong>Public stock prediction</strong>
          </div>
          <p>Forecast price direction before login, with confidence, risk notes, and education-first guidance.</p>
          <Link to="/documentation">Learn trading basics</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
