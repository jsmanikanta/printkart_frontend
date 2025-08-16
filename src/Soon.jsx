import React from "react";
import "./styles/comingsoon.css";
import Loader from "./Loading";

export default function ComingSoon() {
  return (
    <div className="comingsoon-bg">
      <div className="comingsoon-container">
        <h1 className="comingsoon-title">This screen will be available soon!</h1>
        <p className="comingsoon-message">
          We're working hard to bring you this feature. Please check back later.
        </p>
      </div>
    </div>
  );
}