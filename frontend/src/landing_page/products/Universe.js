import React from 'react'
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function Universe() {
  const navigate = useNavigate();  
  const partners = [
    { img: "media/images/smallcaseLogo.png", label: "Thematic investment platform" },
    { img: "media/images/sensibullLogo.svg", label: "ThemeWealth investment platform" },
    { img: "media/images/goldenpiLogo.png", label: "GoldenPi investment platform" },
    { img: "media/images/smallcaseLogo.png", label: "Thematic investment platform" },
    { img: "media/images/sensibullLogo.svg", label: "ThemeWealth investment platform" },
    { img: "media/images/goldenpiLogo.png", label: "GoldenPi investment platform" },
  ];

  return ( 
    <div className="container mt-5">
      <ScrollReveal className="row text-center" variant="reveal-scale">
        <h1>The StoxFlow Universe</h1>
        <p className="text-muted">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {partners.map((p, i) => (
          <ScrollReveal
            key={i}
            className="col-12 col-sm-6 col-md-4 p-3 mt-4 universe-grid"
            delay={i * 80}
          >
            <div className="premium-card hover-lift p-4">
              <LazyImage src={p.img} alt={p.label} />
              <p className="text-small text-muted mt-3 mb-0">{p.label}</p>
            </div>
          </ScrollReveal>
        ))}

        <button
          className="p-2 btn btn-primary fs-5 mb-5 btn-cta btn-premium btn-gradient"
          style={{ margin: "2rem auto 0", display: "block" }}
          onClick={() => navigate('/signup')}
        >
          Signup Now
        </button>
      </ScrollReveal>
    </div>
  );
}

export default Universe;
