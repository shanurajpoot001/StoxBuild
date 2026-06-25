import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function LeftSection({
  imageURL,
  productName,
  productDesription,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5 product-section">
      <div className="row align-items-center">
        <ScrollReveal className="col-12 col-md-6 mb-4 mb-md-0 text-center" variant="reveal-left">
          <LazyImage src={imageURL} alt={productName} className="hover-lift" />
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-right" delay={100}>
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div className="product-links">
            <a href="https://www.tradingview.com/chart/" target="_blank" rel="noreferrer" className="link-arrow">Try Demo →</a>
            <a href="https://zerodha.com/varsity/" target="_blank" rel="noreferrer" className="link-arrow">Learn More →</a>
          </div>
          <div className="product-badges mt-3">
            <a href={googlePlay}>
              <LazyImage src="media/images/googlePlayBadge.svg" alt="Google Play" />
            </a>
            <a href={appStore}>
              <LazyImage src="media/images/appstoreBadge.svg" alt="App Store" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default LeftSection;
