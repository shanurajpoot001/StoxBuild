import React, { useState } from "react";

const LazyImage = ({ src, alt, className = "", ...props }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`img-lazy${loaded ? " loaded" : ""} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
};

export default LazyImage;
