import {Link} from "react-router-dom";
import "./Footer.css";

function Footer({
                    pageLinks,
                    genreLinks,
                    socialLinks,
                    socialsTitle = "Bezoek onze Socials!",
                    socialsSub = "En vergeet ons niet te volgen :)",
                    copyright = "© 2025 GameFinder. Alle rechten voorbehouden."
                }) {

    const renderLinkList = (links) => (
        <ul className="footer__list">
            {links.map((link, index) => (
                <li key={index}>
                    <Link to={link.to}>{link.children}</Link>
                </li>
            ))}
        </ul>
    );

    return (
        <footer className="footer" role="contentinfo">
            <div className="footer__container">

                {/* Linker kolom: Algemene Pagina's */}
                <nav className="footer__col footer__col--left">
                    <h3>Alle Pagina's</h3>
                    {pageLinks && pageLinks.length > 0 ? renderLinkList(pageLinks) : <p>Geen links beschikbaar</p>}
                </nav>

                {/* Middelste kolom: Socials */}
                <nav className="footer__col footer__col--center footer__socials">
                    <h3>{socialsTitle}</h3>
                    <p className="footer__sub">{socialsSub}</p>
                    <ul className="footer__icons">
                        {socialLinks && socialLinks.map((social, index) => (
                            <li key={index}>
                                <a href={social.to} target="_blank" rel="noopener noreferrer">
                                    <img src={social.icon} alt={social.alt} loading="lazy"/>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Rechter kolom: Populaire Genres */}
                <nav className="footer__col footer__col--right" aria-label="Populaire Genres">
                    <h3>Populaire Genres</h3>
                    {genreLinks && genreLinks.length > 0 ? renderLinkList(genreLinks) : <p>Geen links beschikbaar</p>}
                </nav>
            </div>

            {/* Copyright informatie */}
            <div className="footer__copyright">
                <p>{copyright}</p>
            </div>
        </footer>
    );
}

export default Footer;