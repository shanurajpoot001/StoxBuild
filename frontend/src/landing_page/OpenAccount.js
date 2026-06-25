import React from 'react'
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ui/ScrollReveal';

function OpenAccount() {
  const navigate = useNavigate();
  return (  
    <ScrollReveal className="container p-5 mb-5" variant="reveal-scale">
      <div className="row text-center">
        <h1 className="mt-5">Open a StoxFlow account</h1>
        <p className="text-muted">
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
        </p>
        <button
          className="p-2 btn btn-primary fs-5 mb-5 btn-cta btn-premium btn-gradient"
          style={{ margin: "0 auto", display: "block" }}
          onClick={() => navigate('/signup')}
        >
          Sign Up Now
        </button>
      </div>
    </ScrollReveal>
  );
}

export default OpenAccount;
