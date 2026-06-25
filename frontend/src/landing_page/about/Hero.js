import React from 'react'
import ScrollReveal from '../../components/ui/ScrollReveal';

function Hero() {
  return (
    <div className="container page-transition">
      <ScrollReveal className="row p-3 p-md-5 mt-3 mt-md-5 mb-3 mb-md-5">
        <h1 className="fs-2 text-center">
          We pioneered the discount broking model in India
          <br />
          Now, we are breaking ground with our technology.
        </h1>
      </ScrollReveal>

      <div className="row p-3 p-md-5 mt-3 mt-md-5 border-top text-muted" style={{ lineHeight: "1.8", fontSize: "1.2em" }}>
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-left">
          <p>
            We started our platform with a simple vision — to make investing
            and trading affordable and accessible for everyone in India.
          </p>
          <p>
            By combining innovation with ease of use, we've built a platform
            that empowers individuals to take control of their financial journey.
          </p>
          <p>
            Today, a strong community of investors and traders rely on us daily.
          </p>
        </ScrollReveal>
        <ScrollReveal className="col-12 col-md-6 p-3 p-md-5" variant="reveal-right" delay={100}>
          <p>
            We also run several open learning and community-driven programs.
          </p>
          <p>
            <a href="#rainmatter" className="link-arrow">Rainmatter</a>, our investment initiative,
            partners with multiple fintech startups.
          </p>
          <p>
            Catch up on the latest updates on our blog or see what the media is saying about us.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Hero;
