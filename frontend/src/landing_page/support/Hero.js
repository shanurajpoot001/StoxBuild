import React from 'react'

function Hero() {
    return ( 
         <section className="container-fluid" id="supportHero">
      <div id="supportWrapper">
        <h4 className="mb-0">Support Portal</h4>
        <a href="#tickets">Track Tickets</a>
      </div>
      <div className="container">
        <div className="row p-3 p-md-5">
          <div className="col-12 col-md-6 p-3">
            <h1 className="fs-3">
              Search for an answer or browse help topics to create a ticket
            </h1>
            <input placeholder="Eg. how do I activate F&O" aria-label="Search support" />
            <div className="support-links mt-2">
              <a href="#track">Track account opening</a>
              <a href="#segment">Track segment activation</a>
              <a href="#margins">Intraday margins</a>
              <a href="#manual">Kite user manual</a>
            </div>
          </div>
          <div className="col-12 col-md-6 p-3 p-md-5">
            <h1 className="fs-3">Featured</h1>
            <ol>
              <li>
                <a href="#featured-1">Current Takeovers and Delisting - January 2024</a>
              </li>
              <li>
                <a href="#featured-2">Latest Intraday leverages - MIS & CO</a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
      );
}

export default Hero;
