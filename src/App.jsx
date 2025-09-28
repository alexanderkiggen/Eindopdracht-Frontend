import {useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Favorieten from './pages/Favorieten/Favorieten';
import Keuzehulp from "./pages/Keuzehulp/Keuzehulp";
import Login from './pages/Login/Login';
import Ontdekken from "./pages/Ontdekken/Ontdekken";
import Informatie from "./pages/Informatie/Informatie";

import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer"; // Importeer de Footer component

// Importeer de sociale media logo's hier
import DiscordLogo from "../public/Socials/discord-logo.png";
import FacebookLogo from "../public/Socials/facebook-logo.png";
import InstagramLogo from "../public/Socials/instagram-logo.png";
import TwitchLogo from "../public/Socials/twitch-logo.png";
import XLogo from "../public/Socials/x-logo.png";
import YoutubeLogo from "../public/Socials/youtube-logo.png";


function App() {
    const [count, setCount] = useState(0);

    const pageLinks = [
        { to: "/ontdekken", children: "Ontdekken" },
        { to: "/keuzehulp", children: "Keuzehulp" },
        { to: "/favorieten", children: "Favorieten" },
        { to: "/login", children: "Inloggen" },
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
        { to: "https://www.instagram.com/", icon: InstagramLogo, alt: "Instagram", label: "Instagram" },
        { to: "https://www.youtube.com/", icon: YoutubeLogo, alt: "YouTube", label: "YouTube" },
        { to: "https://www.facebook.com/", icon: FacebookLogo, alt: "Facebook", label: "Facebook" },
        { to: "https://www.twitch.tv/", icon: TwitchLogo, alt: "Twitch", label: "Twitch" },
    ];

    return (
        <Router>
            <div className="app">
                <NavBar NavigationLinkOneTo="/ontdekken"
                        NavigationLinkOneChildren="Ontdekken"
                        NavigationLinkTwoTo="/keuzehulp"
                        NavigationLinkTwoChildren="Keuzehulp"
                        ButtonPrimaryTo="/login"
                        ButtonPrimaryChildren="Inloggen"
                        ButtonSecondaryTo="/favorieten"
                        ButtonSecondaryChildren="Favorieten"/>

                <div className="routes-container">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/ontdekken" element={<Ontdekken/>}/>
                        <Route path="/informatie" element={<Informatie/>}/>
                        <Route path="/keuzehulp" element={<Keuzehulp/>}/>
                        <Route path="/favorieten" element={<Favorieten/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </div>

                <Footer pageLinks={pageLinks} genreLinks={genreLinks} socialLinks={socialLinks} />
            </div>
        </Router>
    );
}

export default App;