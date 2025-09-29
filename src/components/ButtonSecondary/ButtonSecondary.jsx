import { Link } from "react-router-dom";
import "./ButtonSecondary.css";

function ButtonSecondary({ children, to, onClick, type = "button" }) {
    if (to) {
        return (
            <Link to={to} className="btn--secondary">
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            type={type}
            className="btn--secondary"
            disabled={!onClick}
        >
            {children}
        </button>
    );
}

export default ButtonSecondary;
