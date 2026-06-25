import React, { useState, useMemo } from "react";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  openSellWindow: () => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedOrderMode, setSelectedOrderMode] = useState("BUY");

  const handleOpenOrderWindow = (uid, mode = "BUY") => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedOrderMode(mode);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedOrderMode("BUY");
  };

  const value = useMemo(
    () => ({
      openBuyWindow: (uid) => handleOpenOrderWindow(uid, "BUY"),
      openSellWindow: (uid) => handleOpenOrderWindow(uid, "SELL"),
      closeBuyWindow: handleCloseBuyWindow,
    }),
    []
  );

  return (
    <GeneralContext.Provider value={value}>
      {props.children}
      {isBuyWindowOpen && (
        <div className="buy-window-overlay" onClick={handleCloseBuyWindow}>
          <div onClick={(e) => e.stopPropagation()}>
            <BuyActionWindow uid={selectedStockUID} initialMode={selectedOrderMode} />
          </div>
        </div>
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
