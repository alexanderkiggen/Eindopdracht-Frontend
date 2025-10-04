import React, { useState } from "react";
import "./RatingGame.css";

function RatingGame({ gameRating }) {
    const formatRating = (rating) => {
        if (!rating) return 'N/A';
        // RAWG rating is uit 5, dit convert het naar percentage
        const percentage = Math.round((rating / 5) * 100);
        return `${percentage}% Ratings`;
    };
    return (
        <span className="rating">
            {formatRating(gameRating)}
        </span>
    );
}

export default RatingGame;
