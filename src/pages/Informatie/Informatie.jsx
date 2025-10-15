import {useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';

import axios from 'axios';
import './Informatie.css';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary.jsx';
import RatingGame from '../../components/RatingGame/RatingGame.jsx';
import PlayStationIcon from "../../assets/icons/playstation.svg";
import XboxIcon from "../../assets/icons/xbox.svg";
import WindowsIcon from "../../assets/icons/windows.svg";
import NoImage from "../../assets/images/no-image.png";

function Informatie() {
    const {game_slug} = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [selectedScreenshot, setSelectedScreenshot] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (game_slug) {
            fetchGameData();
            setShowFullDescription(false);
        }
    }, [game_slug]);

    const fetchGameData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch game details en screenshots tegelijk
            const [gameResponse, screenshotsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/games/${game_slug}`, {params: {key: import.meta.env.VITE_API_KEY}}),
                axios.get(`${BASE_URL}/games/${game_slug}/screenshots`, {params: {key: import.meta.env.VITE_API_KEY}})
            ]);

            setGame(gameResponse.data);
            setScreenshots(screenshotsResponse.data.results || []);

        } catch (err) {
            console.error('Error fetching game data:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPlatformIcon = (platformName) => {
        const name = platformName.toLowerCase();
        if (name.includes("playstation") || name.includes("ps")) {
            return <img src={PlayStationIcon} alt="PlayStation" className="informatie-platform-icon"/>;
        }
        if (name.includes("xbox")) {
            return <img src={XboxIcon} alt="Xbox" className="informatie-platform-icon"/>;
        }
        if (name.includes("pc") || name.includes("windows")) {
            return <img src={WindowsIcon} alt="PC" className="informatie-platform-icon"/>;
        }
        return null;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Nog niet bekend';
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL', {day: 'numeric', month: 'long', year: 'numeric'});
    };

    const truncateDescription = (htmlString, wordLimit = 75) => {
        if (!htmlString) return '';

        // Skip HTML tags voor word count
        const textOnly = htmlString.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const words = textOnly.split(' ');

        if (words.length <= wordLimit) return htmlString;

        // Neem eerste X woorden en behoud HTML structuur
        let wordCount = 0;
        let result = '';
        let inTag = false;
        let tagStack = [];

        for (let i = 0; i < htmlString.length && wordCount < wordLimit; i++) {
            const char = htmlString[i];
            result += char;

            if (char === '<') {
                inTag = true;
                // Check voor opening tag
                const tagMatch = htmlString.substring(i).match(/^<(\w+)[^>]*>/);
                if (tagMatch && !htmlString.substring(i).match(/^<\//) && !htmlString.substring(i).match(/\/>$/)) {
                    tagStack.push(tagMatch[1]);
                }
                // Check voor closing tag
                const closeMatch = htmlString.substring(i).match(/^<\/(\w+)>/);
                if (closeMatch) {
                    tagStack.pop();
                }
            } else if (char === '>') {
                inTag = false;
            } else if (!inTag && char === ' ') {
                wordCount++;
            }
        }

        // Sluit open tags
        while (tagStack.length > 0) {
            result += `</${tagStack.pop()}>`;
        }

        return result;
    };

    const getDescriptionContent = () => {
        if (!game.description) return 'Geen beschrijving beschikbaar voor deze game.';

        if (isMobile && !showFullDescription) {
            return truncateDescription(game.description, 75);
        }

        return game.description;
    };

    const openScreenshot = (screenshot) => {
        setSelectedScreenshot(screenshot);
        document.body.style.overflow = "hidden";
    };

    const closeScreenshot = () => {
        setSelectedScreenshot(null);
        document.body.style.overflow = "";
    };

    const goToPreviousScreenshot = () => {
        if (!selectedScreenshot) return;
        const currentIndex = screenshots.findIndex(s => s.id === selectedScreenshot.id);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : screenshots.length - 1;
        setSelectedScreenshot(screenshots[previousIndex]);
    };

    const goToNextScreenshot = () => {
        if (!selectedScreenshot) return;
        const currentIndex = screenshots.findIndex(s => s.id === selectedScreenshot.id);
        const nextIndex = currentIndex < screenshots.length - 1 ? currentIndex + 1 : 0;
        setSelectedScreenshot(screenshots[nextIndex]);
    };

    if (loading) {
        return (
            <div className="informatie-container">
                <div className="informatie-loading">
                    <div>Game informatie wordt geladen...</div>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="informatie-container">
                <div className="informatie-error">
                    <h2>Fout bij het laden van games</h2>
                    <p>{error || 'Game niet gevonden'}</p>
                    <ButtonPrimary onClick={() => navigate(-1)}>Terug</ButtonPrimary>
                </div>
            </div>
        );
    }

    return (
        <div className="informatie-container">
            {/* Hero Section */}
            <div className="informatie-header">
                <div className="informatie-hero">
                    <img
                        src={game.background_image || NoImage}
                        alt={game.name}
                        className="informatie-hero__image"
                        loading="lazy"
                    />
                    <div className="informatie-hero__overlay"></div>
                    <div className="informatie-hero__content">
                        <h1 className="informatie-hero__title">{game.name}</h1>
                        <div className="informatie-hero__meta">
                            <RatingGame gameRating={game.rating}/>
                            {game.genres && game.genres.length > 0 && (
                                <span>
                                  {game.genres.map(g => g.name).join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="informatie-content">
                <div className="informatie-main">
                    {/* Description Section */}
                    <div className="informatie-section">
                        <h2 className="informatie-section__title">Over deze game</h2>

                        {(() => {
                            // Controleer of de beschrijving lang is
                            const hasLongDescription =
                                game.description &&
                                game.description.replace(/<[^>]*>/g, ' ').split(' ').length > 75;

                            if (isMobile && !showFullDescription && hasLongDescription) {
                                return (
                                    <>
                                        <div
                                            className="informatie-description"
                                            dangerouslySetInnerHTML={{
                                                __html: getDescriptionContent(),
                                            }}
                                        />
                                        <button
                                            onClick={() => setShowFullDescription(true)}
                                            className="informatie-read-more"
                                        >
                                            Lees verder
                                        </button>
                                    </>
                                );
                            }

                            // volledige beschrijving
                            else {
                                return (
                                    <>
                                        <div
                                            className="informatie-description"
                                            dangerouslySetInnerHTML={{
                                                __html: getDescriptionContent(),
                                            }}
                                        />
                                        {isMobile &&
                                            showFullDescription &&
                                            hasLongDescription && (
                                                <button
                                                    onClick={() => setShowFullDescription(false)}
                                                    className="informatie-read-more"
                                                >
                                                    Lees minder
                                                </button>
                                            )}
                                    </>
                                );
                            }
                        })()}
                    </div>


                    {/* Screenshots Section */}
                    {screenshots.length > 0 && (
                        <div className="informatie-section">
                            <h2 className="informatie-section__title">Screenshots</h2>
                            <div className="informatie-screenshots">
                                {screenshots.slice(0, 4).map((screenshot, index) => (
                                    <img
                                        key={screenshot.id}
                                        src={screenshot.image}
                                        alt={`${game.name} screenshot ${index + 1}`}
                                        className="informatie-screenshot"
                                        loading="lazy"
                                        onClick={() => openScreenshot(screenshot)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="informatie-sidebar">
                    {/* Details Box */}
                    <div className="informatie-info-box">
                        <h3>Details</h3>
                        <div className="informatie-info-row">
                            <span className="informatie-info-label">Uitgever</span>
                            <span className="informatie-info-value">
                {game.publishers && game.publishers.length > 0
                    ? game.publishers[0].name
                    : 'Onbekend'}
              </span>
                        </div>
                        <div className="informatie-info-row">
                            <span className="informatie-info-label">Ontwikkelaar</span>
                            <span className="informatie-info-value">
                {game.developers && game.developers.length > 0
                    ? game.developers[0].name
                    : 'Onbekend'}
              </span>
                        </div>
                        <div className="informatie-info-row">
                            <span className="informatie-info-label">Release datum</span>
                            <span className="informatie-info-value">
                {formatDate(game.released)}
              </span>
                        </div>
                        <div className="informatie-info-row">
                            <span className="informatie-info-label">Leeftijd</span>
                            <span className="informatie-info-value">
                {game.esrb_rating?.name || 'Niet beoordeeld'}
              </span>
                        </div>
                    </div>

                    {/* Platforms Box */}
                    <div className="informatie-info-box">
                        <h3>Platforms</h3>
                        <div className="informatie-platforms">
                            {game.parent_platforms?.map((platform, index) => (
                                <span key={index} title={platform.platform.name}>
                  {getPlatformIcon(platform.platform.name)}
                </span>
                            ))}
                        </div>
                        <div className="informatie-platforms-text">
                            {game.platforms?.map(p => p.platform.name).join(', ')}
                        </div>
                    </div>

                    {/* Genres Box */}
                    {game.genres && game.genres.length > 0 && (
                        <div className="informatie-info-box">
                            <h3>Genres</h3>
                            <div className="informatie-genres">
                                {game.genres.map(genre => (
                                    <Link
                                        key={genre.id}
                                        to={`/ontdekken?genre=${genre.slug}`}
                                        className="informatie-link"
                                    >
                                        {genre.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags Box */}
                    {game.tags && game.tags.length > 0 && (
                        <div className="informatie-info-box">
                            <h3>Tags</h3>
                            <div className="informatie-tags">
                                {game.tags.slice(0, 12).map(tag => (
                                    <span key={tag.id} className="informatie-tag">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Website Box */}
                    {game.website && (
                        <div className="informatie-info-box">
                            <h3>Website</h3>
                            <a
                                href={game.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="informatie-link"
                            >
                                Bezoek officiële website
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Screenshot in groot */}
            {selectedScreenshot && (
                <div className="screenshot-modal" onClick={closeScreenshot}>
                    <button
                        className="screenshot-modal__close"
                        onClick={closeScreenshot}
                        aria-label="Sluiten"
                    >
                        ×
                    </button>

                    <button
                        className="screenshot-modal__nav screenshot-modal__nav--prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPreviousScreenshot();
                        }}
                        aria-label="Vorige screenshot"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>

                    <img
                        src={selectedScreenshot.image}
                        alt={game.name}
                        className="screenshot-modal__image"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        className="screenshot-modal__nav screenshot-modal__nav--next"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNextScreenshot();
                        }}
                        aria-label="Volgende screenshot"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>

                    <div className="screenshot-modal__counter">
                        {screenshots.findIndex(s => s.id === selectedScreenshot.id) + 1} / {screenshots.length}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Informatie;