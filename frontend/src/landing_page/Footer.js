import React from 'react'
import { useNavigate } from 'react-router-dom';

function Footer() {
     const navigate = useNavigate();
    return ( 
       <footer style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div className="container border-top mt-5">
        <div className="row mt-5">
          <div className="col">
            <img src="media/images/stoxflow-logo.svg" style={{ width: "50%" }} />
            <p className='' style={{ fontSize: "14px" }}>
              &copy; 2010 - 2025, StoxFlow Technologies Pvt. Ltd.
            </p>
            
           <div style={{ textAlign: "center", fontSize: "30px", margin: "20px 0" }}>
      {/* Instagram */}

      <a
        href="https://shanurajpoot.onrender.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: "0 15px", color: "#4CAF50" }}
      >
        <i className="fas fa-globe"></i>
      </a>

      <a
        href="https://www.instagram.com/sr_rajpoot_001/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: "0 15px", color: "#E1306C" }}
      >
        <i className="fab fa-instagram"></i>
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/shanu-pratap-rajpoot/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: "0 15px", color: "#0077b5" }}
      >
        <i className="fab fa-linkedin"></i>
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/shanurajpoot001/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: "0 15px", color: "#333" }}
      >
        <i className="fab fa-github"></i>
      </a>
    </div>





          </div>
          <div className="col text-decoration-none">
            <p>Company</p>
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/')}}>About</a>
            <br />
            <a class="text-decoration-none" href=""   onClick={() =>{ navigate('/Product')}}>Products</a>
            <br />
            <a class="text-decoration-none" href=""   onClick={() =>{ navigate('/Pricing')}}>Pricing</a>
            <br />
            <a class="text-decoration-none" href=""   onClick={() =>{ navigate('/Support')}}>Referral programme</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/')}}>Careers</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/')}}>StoxFlow.tech</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Support')}} >Press & media</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/')}}>StoxFlow cares (CSR)</a>
            <br />
          </div>
          <div className="col">
            <p>Support</p>
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Support')}}>Contact</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Support')}}>Support portal</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Support')}}>S-Connect blog</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Pricing')}}>List of charges</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/Support')}}>Downloads & resources</a>
            <br />
          </div>
          <div className="col">
            <p>Account</p>
            <a class="text-decoration-none" href="" onClick={() =>{ navigate('/signup')}}>Open an account</a>
            <br />
            <a class="text-decoration-none" href="" onClick={() =>{ navigate('/Pricing')}}>Fund transfer</a>
            <br />
            <a class="text-decoration-none" href=""  onClick={() =>{ navigate('/')}}>60 day challenge</a>
            <br />
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            StoxFlow Technologies Pvt. Ltd.: Member of NSE & BSE – SEBI 
            Registration no.: INZ**********.Depository services through
            StoxFlow Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-200-2024.
            Commodity Trading through StoxFlow Commodities Pvt. Ltd.
            MCX: 12345 – SEBI Registration no.: INZ**********.

          </p>

          <p>
            Registered Address: StoxFlow Technologies Pvt. Ltd., 21/7,
             Tech Park, Sector 62, ****, MP - 482002, India.
             For any complaints, please write to support@StoxFlow.com***.
             <br/>
             Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>
          {/* <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p> */}

          <p>
            "Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day. Issued in the interest of
            investors. KYC is one time exercise while dealing in securities
            markets - once KYC is done through a SEBI registered intermediary
            (broker, DP, Mutual Fund etc.), you need not undergo the same
            process again when you approach another intermediary." Dear
            Investor, if you are subscribing to an IPO, there is no need to
            issue a cheque. Please write the Bank account number and sign the
            IPO application form to authorize your bank to make payment in case
            of allotment. In case of non allotment the funds will remain in your
            bank account. As a business we don't give stock tips, and have not
            authorized anyone to trade on behalf of others. If you find anyone
            claiming to be part of Zerodha and offering such services, please
            create a ticket here.
          </p>
        </div>
      </div>
    </footer>
     );
}

export default Footer;