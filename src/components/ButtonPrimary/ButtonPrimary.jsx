import { Link } from "react-router-dom";
import "./ButtonPrimary.css";

function ButtonPrimary({ children, to, onClick, type = "button", disabled = false, ...rest }) {

    if (to) {
        return (
            <Link
                to={to}
                className="btn--primary"
                tabIndex={disabled ? -1 : 0}
                {...rest}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            type={type}
            className="btn--primary"
            disabled={disabled || (!onClick && type !== 'submit')}
            {...rest}
        >
            {children}
        </button>
    );
}

export default ButtonPrimary;