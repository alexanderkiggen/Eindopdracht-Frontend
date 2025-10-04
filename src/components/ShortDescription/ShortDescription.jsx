import { useState } from "react";
import "./ShortDescription.css";

function ShortDescription({ text }) {
    const [showMore, setShowMore] = useState(false);

    const words = text.trim().split(/\s+/);
    const shortText = words.slice(0, 65).join(" ");
    const remainingText = words.slice(65).join(" ");

    const toggleReadMore = (e) => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    return (
        <div className="short-description">
            <p>
                {shortText}
                {!showMore && words.length > 65 && <span>... </span>}
                {showMore && <span> {remainingText} {" "}</span>}
                {words.length > 65 && (
                    <a onClick={toggleReadMore} className="leesmeer-link" href="#">
                        {showMore ? "Lees Minder" : "Lees Meer"}
                    </a>
                )}
            </p>
        </div>
    );
}

export default ShortDescription;
