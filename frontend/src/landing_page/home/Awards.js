import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function Awards() {
  return ( 
    <div className="container mt-5">
      <div className="row">
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-left">
          <LazyImage src="media/images/largestBroker.svg" alt="Largest broker in India" />
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5 mt-md-5" variant="reveal-right" delay={100}>
          <h1>Largest stock broker in India</h1>
          <p className="mb-5">
            2+ million StoxFlow clients contribute to over 15% of all retail
            order volumes in India daily by trading and investing in:
          </p>
          <div className="row">
            <div className="col-12 col-sm-6">
              <ul>
                <li><p>Futures and Options</p></li>
                <li><p>Commodity derivatives</p></li>
                <li><p>Currency derivatives</p></li>
              </ul>
            </div>
            <div className="col-12 col-sm-6">
              <ul>
                <li><p>Stocks & IPOs</p></li>
                <li><p>Direct mutual funds</p></li>
                <li><p>Bonds and Govt. Securities</p></li>
              </ul>
            </div>
          </div>
          <LazyImage src="media/images/pressLogos.png" style={{ width: "90%", maxWidth: "100%" }} alt="Press logos" />
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Awards;
