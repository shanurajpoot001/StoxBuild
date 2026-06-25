import { useEffect, useRef, useState } from "react";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(end, duration = 2000, startOnView = true) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef(null);
  const parsed = parseFloat(String(end).replace(/[^0-9.]/g, "")) || 0;
  const suffix = String(end).replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started || parsed === 0) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(easeOut(progress) * parsed);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, parsed, duration]);

  const display =
    parsed % 1 !== 0
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString("en-IN");

  return { ref, display: `${display}${suffix}`, raw: value };
}
