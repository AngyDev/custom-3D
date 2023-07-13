import React from "react";
import { MutatingDots } from "react-loader-spinner";

export default function Spinner() {
  // 191e2a
  return (
    <div className="resultLoader">
      <div className="loader">
        <MutatingDots ariaLabel="loading-indicator" height={100} width={100} color="#c98a6b" secondaryColor="#c98a6b" />
      </div>
    </div>
  );
}
