import React from 'react'
import { useNavigate } from 'react-router-dom';

function Team() {
  const navigate = useNavigate();
    return (
       <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">People</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="media/images/shanu.jpg"
            alt="Shanu Pratap Rajpoot"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5 font-weight-bold  font-family: Arial ">Shanu Pratap Rajpoot</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            Shanu Pratap Rajpoot bootstrapped and founded StoxFlow to
             simplify investing and trading by breaking the barriers he
            faced as a beginner in the markets. Today, StoxFlow is
             building a modern ecosystem for retail traders in India.
          </p>
          <p>
            He is passionate about technology and finance, and continues to
             work on ideas that make investing more transparent and accessible.
          </p>
          <p>Outside of work, he finds balance in sports and learning new things every day.</p>
          <p>
            Connect on <a href=""
            onClick={() => navigate('/')}
            >Homepage</a> / <a href="https://www.linkedin.com/in/shanu-pratap-rajpoot/"
            // onClick={() => navigate('/')}
            target='_blank'
            >TradingQnA</a> /{" "}
            <a href="https://www.linkedin.com/in/shanu-pratap-rajpoot/" target='_blank'>LinkedIn</a>
          </p>
        </div>
      </div>
    </div>
    );
}

export default Team;