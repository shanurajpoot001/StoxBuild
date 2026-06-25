import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function RightSection({ imageURL, productName, productDesription }) {
  return (
    <div className="container mt-5 product-section">
      <div className="row align-items-center">
        <ScrollReveal className="col-12 col-md-6 order-md-1 order-2 p-3 p-md-5" variant="reveal-left">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div className="product-links">
            <a href="https://zerodha.com/varsity/" target="_blank" rel="noreferrer" className="link-arrow">Learn More →</a>
          </div>
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 order-md-2 order-1 mb-4 mb-md-0 text-center" variant="reveal-right" delay={100}>
          <LazyImage src={imageURL} alt={productName} className="hover-lift" />
        </ScrollReveal>
      </div>
    </div>
  );
}

export default RightSection;
