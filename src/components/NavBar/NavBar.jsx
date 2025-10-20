import {Link, NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import "./Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar({
                    NavigationLinkOneChildren,
                    NavigationLinkOneTo,
                    NavigationLinkTwoChildren,
                    NavigationLinkTwoTo,
                    ButtonSecondaryChildren,
                    ButtonSecondaryTo,
                    ButtonPrimaryChildren,
                    onLoginClick,
                    onLogoutClick,
                    isLoggedIn
                }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('no-scroll', !isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('no-scroll');
    };

    const performSearch = () => {
        const q = searchValue.trim();
        if (!q) return;
        closeMenu();
        navigate(`/zoeken?search=${encodeURIComponent(q)}`);
        setSearchValue("");
    };

    const primaryAction = () => {
        if (isLoggedIn) onLogoutClick?.();
        else onLoginClick?.();
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <div className="navbar__left">
                    <Link to="/" onClick={closeMenu} className="navbar__logo-link">
                        <img className="navbar__logo" src={Logo} alt="GameFinder logo"/>
                    </Link>

                    <div id="navbar-collapsible" className="navbar__collapsible"
                         data-state={isMenuOpen ? "open" : "closed"}>
                        <ul className="navbar__menu" onClick={closeMenu}>
                            <li>
                                <NavLink
                                    className={({isActive}) => isActive ? 'navbar__navlink navbar__navlink__active' : 'navbar__navlink'}
                                    to={NavigationLinkOneTo}>{NavigationLinkOneChildren}</NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({isActive}) => isActive ? 'navbar__navlink navbar__navlink__active' : 'navbar__navlink'}
                                    to={NavigationLinkTwoTo}>{NavigationLinkTwoChildren}</NavLink>
                            </li>
                        </ul>

                        <form className="navbar__search" onSubmit={(e) => {
                            e.preventDefault();
                            performSearch();
                        }}>
                            <button type="button" className="navbar__search-icon" onClick={performSearch}
                                    aria-label="Zoeken">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8b8b8f"
                                     viewBox="0 0 24 24">
                                    <path
                                        d="M21 20.3 16.7 16a7.5 7.5 0 1 0-1.7 1.7L20.3 21 21 20.3zM10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/>
                                </svg>
                            </button>
                            <input type="text" name="search" placeholder="Zoeken in Finder…"
                                   value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                        </form>

                        <div className="navbar__actions--mobile" onClick={closeMenu}>
                            <a className="btn--secondary" href={ButtonSecondaryTo}>{ButtonSecondaryChildren}</a>
                            <button className="btn--primary" onClick={primaryAction}>
                                {ButtonPrimaryChildren}
                            </button>
                        </div>
                    </div>
                </div>

                <button className="navbar__toggle" aria-label="Menu" aria-controls="navbar-collapsible"
                        aria-expanded={isMenuOpen} onClick={toggleMenu}></button>

                <div className="navbar__right">
                    <a className="btn--secondary" href={ButtonSecondaryTo}>{ButtonSecondaryChildren}</a>
                    <button className="btn--primary" onClick={primaryAction}>
                        {ButtonPrimaryChildren}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
