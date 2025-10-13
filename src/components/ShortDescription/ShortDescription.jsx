import { useState } from "react";
import "./ShortDescription.css";

function ShortDescription({ text, maxLength }) {
    const [showMore, setShowMore] = useState(false);

    const words = text.trim().split(/\s+/);
    const shortText = words.slice(0, maxLength).join(" ");
    const remainingText = words.slice(parseInt(maxLength)).join(" ");

    const toggleReadMore = (e) => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    return (
        <div className="short-description">
            <p>
                {shortText}
                {!showMore && words.length > parseInt(maxLength) && <span>... </span>}
                {showMore && <span> {remainingText} {" "}</span>}
                {words.length > parseInt(maxLength) && (
                    <a onClick={toggleReadMore} className="leesmeer-link" href="#">
                        {showMore ? "Lees Minder" : "Lees Meer"}
                    </a>
                )}
            </p>
        </div>
    );
}

export default ShortDescription;
