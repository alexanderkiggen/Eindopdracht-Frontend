import {Link} from "react-router-dom";
import {useState} from "react";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";
import ButtonSecondary from "../ButtonSecondary/ButtonSecondary";
import Logo from "../../assets/images/logo.png";
import "./Navbar.css";

function Navbar({
                    NavigationLinkOneChildren,
                    NavigationLinkOneTo,
                    NavigationLinkTwoChildren,
                    NavigationLinkTwoTo,
                    ButtonSecondaryChildren,
                    ButtonSecondaryTo,
                    ButtonPrimaryChildren,
                    ButtonPrimaryTo
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
        console.log("Zoekterm:", query); // Tijdelijk totdat de zoekbalk werkend is.
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                {/* Linker kant: logo + navigatie links  + zoekbalk */}
                <div className="navbar__left">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenu} className="navbar__logo-link">
                        <img className="navbar__logo" src={Logo} alt="GameFinder logo"/>
                    </Link>

                    {/* Inklabare content mobiel */}
                    <div
                        id="navbar-collapsible"
                        className="navbar__collapsible"
                        data-state={isMenuOpen ? "open" : "closed"}
                    >
                        {/* Navigatie links */}
                        <ul className="navbar__menu" onClick={closeMenu}>
                            <li>
                                <Link to={NavigationLinkOneTo} onClick={closeMenu}>{NavigationLinkOneChildren}</Link>
                            </li>
                            <li>
                                <Link to={NavigationLinkTwoTo} onClick={closeMenu}>{NavigationLinkTwoChildren}</Link>
                            </li>
                        </ul>

                        {/* Zoekbalk */}
                        <form className="navbar__search" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                name="search"
                                placeholder="Zoeken in Finder…"
                            />
                        </form>

                        {/* Actie knoppen voor mobiel */}
                        <div className="navbar__actions--mobile" onClick={closeMenu}>
                            <ButtonSecondary to={ButtonSecondaryTo}>{ButtonSecondaryChildren}</ButtonSecondary>
                            <ButtonPrimary to={ButtonPrimaryTo}>{ButtonPrimaryChildren}</ButtonPrimary>
                        </div>
                    </div>
                </div>

                {/* Hamburger menu knop (Mobile) */}
                <button
                    className="navbar__toggle"
                    aria-label="Menu"
                    aria-controls="navbar-collapsible"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                ></button>

                {/* Rechter kant: Actie knoppen voor grote schermen  */}
                <div className="navbar__right">
                    <ButtonSecondary to={ButtonSecondaryTo}>{ButtonSecondaryChildren}</ButtonSecondary>
                    <ButtonPrimary to={ButtonPrimaryTo}>{ButtonPrimaryChildren}</ButtonPrimary>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;