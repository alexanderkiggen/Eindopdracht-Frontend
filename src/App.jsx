import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Favorieten from './pages/Favorieten/Favorieten';
import Keuzehulp from "./pages/Keuzehulp/Keuzehulp";
import Ontdekken from "./pages/Ontdekken/Ontdekken";
import Informatie from "./pages/Informatie/Informatie";
import LoginComponent from './components/Login/Login';

import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

import DiscordLogo from "../public/Socials/discord-logo.png";
import FacebookLogo from "../public/Socials/facebook-logo.png";
import InstagramLogo from "../public/Socials/instagram-logo.png";
import TwitchLogo from "../public/Socials/twitch-logo.png";
import XLogo from "../public/Socials/x-logo.png";
import YoutubeLogo from "../public/Socials/youtube-logo.png";

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    // Scroll lock bij popup
    useEffect(() => {
        if (isLoginOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoginOpen]);

    const pageLinks = [
        { to: "/ontdekken", children: "Ontdekken" },
        { to: "/keuzehulp", children: "Keuzehulp" },
        { to: "/favorieten", children: "FavorietenGebruiker" },
        { to: "/", children: "Home" },
    ];

    const genreLinks = [
        { to: "#", children: "Action" },
        { to: "#", children: "Adventure" },
        { to: "#", children: "Role-Playing Game" },
        { to: "#", children: "Shooter" },
        { to: "#", children: "Sports" },
    ];

    const socialLinks = [
        { to: "https://discord.com/", icon: DiscordLogo, alt: "Discord", label: "Discord" },
        { to: "https://x.com/", icon: XLogo, alt: "X", label: "X (Twitter)" },
        { to: "https://www.instagram.com/", icon: InstagramLogo, alt: "Instagram" },
        { to: "https://www.youtube.com/", icon: YoutubeLogo, alt: "YouTube" },
        { to: "https://www.facebook.com/", icon: FacebookLogo, alt: "Facebook" },
        { to: "https://www.twitch.tv/", icon: TwitchLogo, alt: "Twitch" },
    ];

    return (
        <Router>
            <div className="app">
                <NavBar
                    NavigationLinkOneTo="/ontdekken"
                    NavigationLinkOneChildren="Ontdekken"
                    NavigationLinkTwoTo="/keuzehulp"
                    NavigationLinkTwoChildren="Keuzehulp"
                    ButtonPrimaryChildren="Inloggen"
                    onLoginClick={openLogin}
                    ButtonSecondaryTo="/favorieten"
                    ButtonSecondaryChildren="Favorieten"
                />

                <div className="routes-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ontdekken" element={<Ontdekken />} />
                        <Route path="/informatie" element={<Informatie />} />
                        <Route path="/keuzehulp" element={<Keuzehulp />} />
                        <Route path="/favorieten" element={<Favorieten />} />
                    </Routes>
                </div>

                {/* Overlay Login tonen */}
                {isLoginOpen && <LoginComponent onClose={closeLogin} />}

                <Footer pageLinks={pageLinks} genreLinks={genreLinks} socialLinks={socialLinks} />
            </div>
        </Router>
    );
}

export default App;
