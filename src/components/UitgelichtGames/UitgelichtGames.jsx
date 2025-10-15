import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import './UitgelichtGames.css';

import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";
import ButtonSecondary from "../ButtonSecondary/ButtonSecondary";
import RatingGame from "../RatingGame/RatingGame";

const UitgelichtGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // De datums van dit jaar
    const getCurrentYearRange = () => {
        const now = new Date();
        const start = `${now.getFullYear()}-01-01`;
        const end = now.toISOString().split('T')[0];
        return `${start},${end}`;
    };

    useEffect(() => {
        if (!import.meta.env.VITE_API_KEY) {
            setError('RAWG API key niet gevonden in environment variabelen');
            setLoading(false);
            return;
        }
        fetchPopularPS5Games();
    }, [import.meta.env.VITE_API_KEY]);

    const fetchPopularPS5Games = async () => {
        try {
            setLoading(true);
            setError(null);

            const dateRange = getCurrentYearRange();

            // Populaire PS5-games van dit jaar op
            const response = await axios.get(`${BASE_URL}/games`, {
                params: {
                    key: import.meta.env.VITE_API_KEY,
                    platforms: 187, // PS5
                    dates: dateRange, // dit jaar
                    ordering: '-added', // populairste (meest toegevoegd aan lijsten van RAWG)
                    page_size: 6
                }
            });

            if (response.data.results?.length > 0) {
                setGames(response.data.results);
            } else {
                throw new Error('Geen games gevonden dit jaar');
            }

        } catch (err) {
            console.error('Error fetching PS5 games:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="highlighted-games-section">
                <h2 className="section-title">Uitgelichte PS5 Games</h2>
                <div className="loading-container">
                    <div>Populaire PS5-games worden geladen...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="highlighted-games-section">
                <h2 className="section-title">Uitgelichte PS5 Games</h2>
                <div className="error-container">
                    <h3>Fout bij het laden van games</h3>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchPopularPS5Games}>
                        Opnieuw proberen
                    </ButtonPrimary>
                </div>
            </section>
        );
    }

    return (
        <section className="highlighted-games-section">
            <h2 className="section-title">Uitgelichte PS5 Games</h2>
            <div className="highlighted-games-grid">
                {games.map((game) => (
                    <Link
                        key={game.id || game.slug}
                        to={`/informatie/${game.slug}`}
                        className="game-card"
                    >
                        <img
                            src={game.background_image || '/api/placeholder/400/200'}
                            alt={game.name}
                            loading="lazy"
                        />
                        <p>{game.name}</p>
                        <RatingGame gameRating={game.rating} />
                    </Link>
                ))}
            </div>
            <div className="view-more">
                <ButtonSecondary to={"/ontdekken"}>Bekijk Meer</ButtonSecondary>
            </div>
        </section>
    );
};

export default UitgelichtGames;
