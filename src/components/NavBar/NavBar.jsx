import { Link } from "react-router-dom";
import { useState } from "react";
import ButtonSecondary from "../ButtonSecondary/ButtonSecondary";
import Logo from "../../../public/logo.png";
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('no-scroll', !isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('no-scroll');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const query = formData.get("search");
        console.log("Zoekterm:", query);
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                {/* Linker kant: logo + navigatie links + zoekbalk */}
                <div className="navbar__left">
                    <Link to="/" onClick={closeMenu} className="navbar__logo-link">
                        <img className="navbar__logo" src={Logo} alt="GameFinder logo" />
                    </Link>

                    <div
                        id="navbar-collapsible"
                        className="navbar__collapsible"
                        data-state={isMenuOpen ? "open" : "closed"}
                    >
                        <ul className="navbar__menu" onClick={closeMenu}>
                            <li>
                                <Link to={NavigationLinkOneTo}>{NavigationLinkOneChildren}</Link>
                            </li>
                            <li>
                                <Link to={NavigationLinkTwoTo}>{NavigationLinkTwoChildren}</Link>
                            </li>
                        </ul>

                        <form className="navbar__search" onSubmit={handleSearchSubmit}>
                            <input type="text" name="search" placeholder="Zoeken in Finder…" />
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
