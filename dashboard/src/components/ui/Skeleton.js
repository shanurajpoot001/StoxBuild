import React from "react";

export const SkeletonRow = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton skeleton-row" />
    ))}
  </>
);

export const SkeletonTitle = () => <div className="skeleton skeleton-title" />;
