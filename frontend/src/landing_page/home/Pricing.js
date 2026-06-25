import React from 'react'
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ui/ScrollReveal';

function Pricing() {
  const navigate = useNavigate();
  return ( 
    <div className="container">
      <div className="row">
        <ScrollReveal className="col-12 col-md-4 mb-4 mb-md-0" variant="reveal-left">
          <h1 className="mb-3 fs-2">Unbeatable pricing</h1>
          <p>
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <a
            href="/pricing"
            onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}
            className="link-arrow"
          >
            See Pricing{" "}
            <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </ScrollReveal>
        <div className="d-none d-md-block col-md-2"></div>
        <ScrollReveal className="col-12 col-md-6 mb-5" variant="reveal-right" delay={100}>
          <div className="row text-center pricing-cards">
            <div className="col p-3 border premium-card hover-lift">
              <h1 className="mb-3 stat-number">₹0</h1>
              <p>
                Free equity delivery and
                <br />
                direct mutual funds
              </p>
            </div>
            <div className="col p-3 border premium-card hover-lift">
              <h1 className="mb-3 stat-number">₹20</h1>
              <p>Intraday and F&O</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Pricing;
