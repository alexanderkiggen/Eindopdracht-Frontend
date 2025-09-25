import { Link } from "react-router-dom";
import "./ButtonPrimary.css";

function ButtonPrimary({ children, to }) {
    return (
        <Link to={to} className="btn--primary">
            {children}
        </Link>
    );
}

export default ButtonPrimary;
