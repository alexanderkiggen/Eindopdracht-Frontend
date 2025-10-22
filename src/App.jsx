import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import './App.css';

import Home from './pages/Home/Home';
import Favorieten from './pages/Favorieten/Favorieten';
import Keuzehulp from './pages/Keuzehulp/Keuzehulp';
import Ontdekken from './pages/Ontdekken/Ontdekken';
import Informatie from './pages/Informatie/Informatie';
import Zoeken from './pages/Zoeken/Zoeken';
import NotFound from './pages/NotFound/NotFound';

import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';

import DiscordLogo from './assets/Socials/discord.png';
import FacebookLogo from './assets/Socials/facebook.png';
import InstagramLogo from './assets/Socials/instagram.png';
import TwitchLogo from './assets/Socials/twitch.png';
import XLogo from './assets/Socials/x.png';
import YoutubeLogo from './assets/Socials/youtube.png';

import { getAuth, clearAuth } from './utils/authentication.js';

// Naar boven scrollen bij het openen van een nieuwe pagina
function ScrollToTop() {
    const { pathname, hash } = useLocation();
    useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
    return null;
}

function App() {
    const [auth, setAuth] = useState(getAuth());
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const handleLoginSuccess = () => {
        setAuth(getAuth());
        closeLogin();
    };

    const handleLogout = () => {
        clearAuth();
        setAuth(getAuth());
    };

    useEffect(() => {
        document.body.style.overflow = isLoginOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isLoginOpen]);

    const pageLinks = [
        { to: '/ontdekken', children: 'Ontdekken' },
        { to: '/keuzehulp', children: 'Keuzehulp' },
        { to: '/favorieten', children: 'Favorieten' },
        { to: '/', children: 'Home' },
    ];

    const genreLinks = [
        { to: '/ontdekken?genre=action', children: 'Action' },
        { to: '/ontdekken?genre=adventure', children: 'Adventure' },
        { to: '/ontdekken?genre=casual', children: 'Casual' },
        { to: '/ontdekken?genre=shooter', children: 'Shooter' },
        { to: '/ontdekken?genre=strategy', children: 'Strategy' },
    ];

    const socialLinks = [
        { to: 'https://discord.com/', icon: DiscordLogo, alt: 'Discord', label: 'Discord' },
        { to: 'https://x.com/', icon: XLogo, alt: 'X', label: 'X (Twitter)' },
        { to: 'https://www.instagram.com/', icon: InstagramLogo, alt: 'Instagram' },
        { to: 'https://www.youtube.com/', icon: YoutubeLogo, alt: 'YouTube' },
        { to: 'https://www.facebook.com/', icon: FacebookLogo, alt: 'Facebook' },
        { to: 'https://www.twitch.tv/', icon: TwitchLogo, alt: 'Twitch' },
    ];

    const isLoggedIn = !!auth.token;

    return (
        <Router>
            <ScrollToTop />
            <div className="app">
                <NavBar
                    NavigationLinkOneTo="/ontdekken"
                    NavigationLinkOneChildren="Ontdekken"
                    NavigationLinkTwoTo="/keuzehulp"
                    NavigationLinkTwoChildren="Keuzehulp"
                    ButtonPrimaryChildren={isLoggedIn ? 'Uitloggen' : 'Inloggen'}
                    onLoginClick={openLogin}
                    onLogoutClick={handleLogout}
                    isLoggedIn={isLoggedIn}
                    ButtonSecondaryTo="/favorieten"
                    ButtonSecondaryChildren="Favorieten"
                />

                <div className="routes-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ontdekken" element={<Ontdekken />} />
                        <Route path="/informatie/:game_slug" element={<Informatie />} />
                        <Route path="/keuzehulp" element={<Keuzehulp />} />
                        <Route path="/favorieten" element={<Favorieten user={auth.user} />} />
                        <Route path="/zoeken" element={<Zoeken />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                {isLoginOpen && <Login onClose={closeLogin} onSuccess={handleLoginSuccess} />}

                <Footer pageLinks={pageLinks} genreLinks={genreLinks} socialLinks={socialLinks} />
            </div>
        </Router>
    );
}

export default App;