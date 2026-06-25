import React, { useEffect, useState } from "react";

const PageLoader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`page-loader${hidden ? " hidden" : ""}`} aria-hidden={hidden}>
      <div className="page-loader-spinner" />
      <span style={{ color: "#888", fontSize: "0.85rem" }}>Loading dashboard…</span>
    </div>
  );
};

export default PageLoader;
