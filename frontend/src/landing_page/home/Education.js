import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function Education() {
  return ( 
    <div className="container mt-5">
      <div className="row">
        <ScrollReveal className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0" variant="reveal-left">
          <LazyImage src="media/images/education.svg" style={{ width: "70%", maxWidth: "320px" }} alt="Education" />
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6" variant="reveal-right" delay={100}>
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <a href="https://www.sebi.gov.in" target="_blank" rel="noreferrer" className="link-arrow">
            Versity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
          <p className="mt-5">
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <a href="https://www.morpher.com/blog/9-frequently-asked-questions-about-trading" target="_blank" rel="noreferrer" className="link-arrow">
            TradingQ&A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Education;
