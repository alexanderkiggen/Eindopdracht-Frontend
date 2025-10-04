import { Link } from "react-router-dom";
import "./ButtonSecondary.css";

function ButtonSecondary({ children, to, onClick, type = "button", disabled = false }) {
    if (to) {
        return (
            <Link
                to={disabled ? "#" : to}
                className={`btn--secondary ${disabled ? "btn--secondary--disabled" : ""}`}
                onClick={e => disabled && e.preventDefault()}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            type={type}
            className="btn--secondary"
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default ButtonSecondary;
