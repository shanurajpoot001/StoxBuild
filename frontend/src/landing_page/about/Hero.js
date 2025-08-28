import React from 'react'

function Hero() {
    return (
        <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-center">
          We pioneered the discount broking model in India
          <br />
          Now, we are breaking ground with our technology.
        </h1>
      </div>

      <div
        className="row p-5 mt-5 border-top text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-5">
          <p>
            We started our platform with a simple vision — to make investing
             and trading affordable and accessible for everyone in India. High 
             costs, complicated processes, and lack of support were the biggest 
             hurdles for new traders, and our goal has always been to remove them
              with transparent pricing and modern technology.
          </p>
          <p>
            By combining innovation with ease of use, we’ve built a platform
             that empowers individuals to take control of their financial journey.
              Our focus on simplicity and technology-first solutions has helped
               us grow rapidly and earn the trust of millions.
          </p>
          <p>
            Today, a strong community of investors and traders rely on us daily to
             place orders, manage portfolios, and explore market opportunities.
              With a user base that continues to expand, we are proud to contribute
               significantly to India’s retail trading ecosystem.
          </p>
        </div>
        <div className="col-6 p-5">
          <p>
            We also run several open learning and community-driven programs designed to guide and
            support retail traders and investors in their journey.
          </p>
          <p>
            <a href="" style={{ textDecoration: "none" }}>
              Rainmatter
            </a>
            , our investment and incubation initiative, we have partnered with multiple fintech startups that
            are working to expand and strengthen India’s capital markets.
          </p>
          <p>
            And yet, we are always up to something new every day. Catch up on
            the latest updates on our blog or see what the media is saying about
            us.
          </p>
        </div>
      </div>
    </div>
    );
}

export default Hero;