import { Link } from "react-router-dom";
import "./ButtonPrimary.css";

function ButtonPrimary({ children, to, onClick, type = "button" }) {
    if (to) {
        return (
            <Link to={to} className="btn--primary">
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            type={type}
            className="btn--primary"
            disabled={!onClick}
        >
            {children}
        </button>
    );
}

export default ButtonPrimary;
