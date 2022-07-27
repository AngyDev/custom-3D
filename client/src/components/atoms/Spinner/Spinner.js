import React from "react";
import { MutatingDots } from "react-loader-spinner";

export default function Spinner() {
  return (
    <div className="resultLoader">
      <div className="loader">
        <MutatingDots ariaLabel="loading-indicator" height={100} width={100} color="#191e2a" secondaryColor="#191e2a" />
      </div>
    </div>
  );
}
