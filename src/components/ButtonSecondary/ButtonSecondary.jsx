import { Link } from "react-router-dom";
import "./ButtonSecondary.css";

function ButtonSecondary({ children, to }) {
    return (
        <Link to={to} className="btn--secondary">
            {children}
        </Link>
    );
}

export default ButtonSecondary;
