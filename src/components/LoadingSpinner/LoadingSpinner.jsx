import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner({ text = "Games worden geladen..." }) {
    return (
        <div className="loading-spinner">
            <div className="loading-spinner__circle" />
            <p className="loading-spinner__text">{text}</p>
        </div>
    );
}

export default LoadingSpinner;
