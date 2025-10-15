import {Link, NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import ButtonSecondary from "../ButtonSecondary/ButtonSecondary";
import Logo from "../../assets/logo.png";
import "./Navbar.css";

function Navbar({
                    NavigationLinkOneChildren,
                    NavigationLinkOneTo,
                    NavigationLinkTwoChildren,
                    NavigationLinkTwoTo,
                    ButtonSecondaryChildren,
                    ButtonSecondaryTo,
                    ButtonPrimaryChildren,
                    onLoginClick
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
        const query = searchValue.trim();
        if (!query) return;
        closeMenu();
        navigate(`/zoeken?search=${encodeURIComponent(query)}`);
        setSearchValue("");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch();
    };

    const handleSearchIconClick = (e) => {
        e.preventDefault();
        performSearch();
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                {/* Linker kant: logo + navigatie links + zoekbalk */}
                <div className="navbar__left">
                    <Link to="/" onClick={closeMenu} className="navbar__logo-link">
                        <img className="navbar__logo" src={Logo} alt="GameFinder logo"/>
                    </Link>

                    <div
                        id="navbar-collapsible"
                        className="navbar__collapsible"
                        data-state={isMenuOpen ? "open" : "closed"}
                    >
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

                        <form className="navbar__search" onSubmit={handleSearchSubmit}>
                            <button
                                type="button"
                                className="navbar__search-icon"
                                onClick={handleSearchIconClick}
                                aria-label="Zoeken"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8b8b8f" viewBox="0 0 24 24">
                                    <path d="M21 20.3 16.7 16a7.5 7.5 0 1 0-1.7 1.7L20.3 21 21 20.3zM10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/>
                                </svg>
                            </button>
                            <input
                                type="text"
                                name="search"
                                placeholder="Zoeken in Finder…"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </form>

                        {/* Mobiel acties */}
                        <div className="navbar__actions--mobile" onClick={closeMenu}>
                            <ButtonSecondary to={ButtonSecondaryTo}>{ButtonSecondaryChildren}</ButtonSecondary>
                            <button className="btn--primary" onClick={onLoginClick}>
                                {ButtonPrimaryChildren}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hamburger knop */}
                <button
                    className="navbar__toggle"
                    aria-label="Menu"
                    aria-controls="navbar-collapsible"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                ></button>

                {/* Desktop acties */}
                <div className="navbar__right">
                    <ButtonSecondary to={ButtonSecondaryTo}>{ButtonSecondaryChildren}</ButtonSecondary>
                    <button className="btn--primary" onClick={onLoginClick}>
                        {ButtonPrimaryChildren}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;