import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  className = "",
  variant = "",
  delay = 0,
  as: Tag = "div",
}) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = [
    "reveal",
    variant,
    revealed ? "revealed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ transitionDelay: revealed ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
