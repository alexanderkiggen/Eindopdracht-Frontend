import React, { useState, useEffect } from 'react';
import './FavorietenGebruiker.css';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';

function Favorieten() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = "1c64704f98f5425d89b4a108cce3c0bb";
    const BASE_URL = 'https://api.rawg.io/api';

    // Favorieten IDs - later kun je dit vervangen met data uit state/context
    const favoriteGames = [
        { id: 326243, slug: "elden-ring" },
        { id: 51325, slug: "the-last-of-us-part-2" }
    ];

    useEffect(() => {
        console.log('Component mounted, fetching games...');
        fetchFavoriteGames();
    }, []);

    const fetchFavoriteGames = async () => {
        console.log('fetchFavoriteGames called');
        try {
            setLoading(true);
            setError(null);

            // Fetch elke game individueel
            const gamePromises = favoriteGames.map(fav => {
                console.log(`Fetching game: ${fav.slug}`);
                return fetch(`${BASE_URL}/games/${fav.slug}?key=${API_KEY}`)
                    .then(res => {
                        console.log(`Response for ${fav.slug}:`, res.status);
                        if (!res.ok) throw new Error(`Kan game ${fav.slug} niet ophalen`);
                        return res.json();
                    });
            });

            const gamesData = await Promise.all(gamePromises);
            console.log('Games data received:', gamesData);
            setGames(gamesData);
        } catch (err) {
            console.error('Error fetching favorite games:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log('Loading finished');
        }
    };

    const formatRating = (rating) => {
        if (!rating) return 'N/A';
        const percentage = Math.round((rating / 5) * 100);
        return `${percentage}% Ratings`;
    };

    const removeFavorite = (gameId) => {
        console.log(`Verwijder favoriet: ${gameId}`);
        setGames(games.filter(game => game.id !== gameId));
    };

    console.log('Render state:', { loading, error, gamesCount: games.length });

    if (loading) {
        return (
            <div className="favorieten-container">
                <div className="favorieten-loading">
                    <div>Je favorieten worden geladen...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorieten-container">
                <div className="favorieten-error">
                    <h2>Fout bij het laden</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchFavoriteGames}>
                        Opnieuw proberen
                    </ButtonPrimary>
                </div>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="favorieten-container">
                <div className="favorieten-empty">
                    <svg
                        className="favorieten-empty__icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <h2>Nog geen favorieten</h2>
                    <p>Begin met het toevoegen van games aan je favorieten!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorieten-container">
            <h1>Mijn Favorieten</h1>

            <div className="favorieten-grid">
                {games.map((game) => (
                    <div key={game.id} className="favorieten-card">
                        <div className="favorieten-card__image-wrapper">
                            <img
                                src={game.background_image || '/api/placeholder/400/225'}
                                alt={game.name}
                                className="favorieten-card__image"
                                loading="lazy"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFavorite(game.id);
                                }}
                                className="favorieten-card__favorite-btn"
                                aria-label="Verwijder uit favorieten"
                            >
                                <svg viewBox="0 0 24 24" fill="#26BBFF" stroke="#26BBFF" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>

                        <div className="favorieten-card__content">
                            <h3 className="favorieten-card__title">
                                {game.name}
                            </h3>

                            <div className="favorieten-card__rating">
                                <span className="favorieten-card__rating-text">
                                    <span className="favorieten-card__rating-icon"></span>
                                    {formatRating(game.rating)}
                                </span>
                            </div>

                            <div className="favorieten-card__genres">
                                {game.genres?.slice(0, 3).map((genre) => (
                                    <span key={genre.id} className="favorieten-card__genre">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {game.released && (
                                <p className="favorieten-card__release">
                                    Release: {new Date(game.released).toLocaleDateString('nl-NL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorieten;