import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';
import LazyImage from '../../components/ui/LazyImage';

function Team() {
  return (
    <div className="container">
      <ScrollReveal className="row p-3 mt-5 border-top">
        <h1 className="text-center">People</h1>
      </ScrollReveal>

      <div className="row p-3 text-muted" style={{ lineHeight: "1.8", fontSize: "1.2em" }}>
        <ScrollReveal className="col-12 col-md-6 p-3 text-center" variant="reveal-left">
          <LazyImage
            src="media/images/shanu.jpg"
            alt="Shanu Pratap Rajpoot"
            className="team-photo hover-lift"
          />
          <h4 className="mt-5">Shanu Pratap Rajpoot</h4>
          <h6>Founder, CEO</h6>
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 p-3" variant="reveal-right" delay={100}>
          <p>
            Shanu Pratap Rajpoot bootstrapped and founded StoxFlow to
            simplify investing and trading by breaking the barriers he
            faced as a beginner in the markets.
          </p>
          <p>
            He is passionate about technology and finance, and continues to
            work on ideas that make investing more transparent and accessible.
          </p>
          <p>Outside of work, he finds balance in sports and learning new things every day.</p>
          <p>
            Connect on{" "}
            <a href="/">Homepage</a> /{" "}
            <a href="https://www.linkedin.com/in/shanu-pratap-rajpoot/" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Team;
