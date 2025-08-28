import React from "react";

 // Read logged-in user from localStorage
 const user = (() => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch (_e) {
    return null;
  }
})();


const username = user?.username || "USER";
const initials = username
  .split(" ")
  .map((p) => p[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();


const Summary = () => {
  return (
    <>
      <div className="username">
        {/* <h6>Hi, User!</h6> */}
        <p className="username">Welcome :  {username.toUpperCase()}</p>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>{" "}
            </p>
            <p>
              Investment <span>29.88k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
