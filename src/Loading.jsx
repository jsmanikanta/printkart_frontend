import React from "react";
import "./styles/loading.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="book-loader">
        <span className="page"></span>
        <span className="page"></span>
        <span className="page"></span>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;
