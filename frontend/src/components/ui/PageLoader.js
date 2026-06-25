import React, { useEffect, useState } from "react";

const PageLoader = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-loader${hidden ? " hidden" : ""}`} aria-hidden={hidden}>
      <div className="page-loader-spinner" />
      <span className="page-loader-text">StoxFlow</span>
    </div>
  );
};

export default PageLoader;
