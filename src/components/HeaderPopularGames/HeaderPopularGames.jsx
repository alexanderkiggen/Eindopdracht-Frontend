import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './HeaderPopularGames.css';
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";

const HeaderPopularGames = () => {
    const [featuredGame, setFeaturedGame] = useState(null);
    const [topGames, setTopGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const intervalRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const CYCLE_DURATION = 25000;
    const PROGRESS_UPDATE_INTERVAL = 100;

    useEffect(() => {
        if (!import.meta.env.VITE_API_KEY) {
            setError('RAWG API key niet gevonden');
            setLoading(false);
            return;
        }
        fetchTopGames();
    }, [import.meta.env.VITE_API_KEY]);

    // Start cycling
    useEffect(() => {
        if (topGames.length > 0) {
            startCycling();
        }
        return () => {
            stopCycling();
        };
    }, [topGames]);

    // Update featured game wanneer currentGameIndex verandert
    useEffect(() => {
        if (topGames.length > 0 && topGames[currentGameIndex]) {
            loadFeaturedGame(topGames[currentGameIndex]);
            setProgress(0); // Reset progress voor nieuwe game
        }
    }, [currentGameIndex, topGames]);

    const fetchTopGames = async () => {
        try {
            setLoading(true);
            setError(null);

            // Haal all time top 5 games op
            const response = await axios.get(`${BASE_URL}/games`, {
                params: {
                    key: import.meta.env.VITE_API_KEY,
                    ordering: '-added',
                    page_size: 5
                }
            });

            if (response.data.results && response.data.results.length > 0) {
                setTopGames(response.data.results);
                setCurrentGameIndex(0);
                // Eerste game als default featured game
                loadFeaturedGame(response.data.results[0]);
            } else {
                throw new Error('Geen games gevonden');
            }

        } catch (err) {
            console.error('Error fetching games:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Extra request voor beschrijving van featured game
    const loadFeaturedGame = async (game) => {
        // Check of description al bestaat in topGames
        if (game.description) {
            setFeaturedGame(game);
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/games/${game.id}`, {
                params: {
                    key: import.meta.env.VITE_API_KEY
                }
            });

            // Update featuredGame + opslaan in topGames array
            const updatedGame = { ...game, description: response.data.description_raw };
            setFeaturedGame(updatedGame);
            setTopGames(prevGames =>
                prevGames.map(g => g.id === game.id ? updatedGame : g)
            );
        } catch (err) {
            console.error(err);
            setFeaturedGame(game);
        }
    };


    const startCycling = () => {
        if (topGames.length <= 1) return;

        stopCycling(); // Stop bestaande intervals

        // Start game cycling interval
        intervalRef.current = setInterval(() => {
            if (!isPaused) {
                setCurrentGameIndex(prevIndex =>
                    (prevIndex + 1) % topGames.length
                );
            }
        }, CYCLE_DURATION);

        // Start progress update interval
        progressIntervalRef.current = setInterval(() => {
            if (!isPaused) {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + (PROGRESS_UPDATE_INTERVAL / CYCLE_DURATION) * 100;
                    return newProgress >= 100 ? 0 : newProgress;
                });
            }
        }, PROGRESS_UPDATE_INTERVAL);
    };

    const stopCycling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const pauseCycling = () => {
        setIsPaused(true);
    };

    const resumeCycling = () => {
        setIsPaused(false);
    };

    const truncateDescription = (text, maxLength = 120) => {
        if (!text) return 'Ontdek deze geweldige game en beleef een unieke ervaring.';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleGameClick = (game, index) => {
        setCurrentGameIndex(index);
        setProgress(0); // Reset progress bij handmatige selectie
        loadFeaturedGame(game);
    };

    if (loading) {
        return (
            <main className="main-content">
                <div className="loading-container">
                    <div>Top games worden geladen...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="main-content">
                <div className="error-container">
                    <h2>Fout bij het laden van games</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchTopGames}>{"Opnieuw proberen"}</ButtonPrimary>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">
            {/* Featured Game Section */}
            <section className="featured-game">
                {featuredGame && (
                    <div
                        className="featured-game__wrapper"
                        onMouseEnter={pauseCycling}
                        onMouseLeave={resumeCycling}
                    >
                        <img
                            src={featuredGame.background_image || '/api/placeholder/800/400'}
                            alt={featuredGame.name}
                            loading="lazy"
                        />
                        <div className="featured-game__overlay"></div>
                        <div className="featured-game__content">
                            <h2>{featuredGame.name}</h2>
                            <p>
                                {truncateDescription(featuredGame.description)}
                            </p>
                            <ButtonPrimary to={`/informatie/${featuredGame.slug}`}>
                                Bekijk de Game
                            </ButtonPrimary>
                        </div>
                    </div>
                )}
            </section>

            {/* Top Games Section */}
            <aside className="highlighted-games">
                {topGames.map((game, index) => (
                    <div
                        key={game.id}
                        className={`game-card ${currentGameIndex === index ? 'active' : ''}`}
                        onClick={() => handleGameClick(game, index)}
                        onMouseEnter={pauseCycling}
                        onMouseLeave={resumeCycling}
                    >
                        <div className="game-card__content">
                            <img
                                src={game.background_image || '/api/placeholder/140/80'}
                                alt={game.name}
                                loading="lazy"
                            />
                            <p>{game.name}</p>
                        </div>
                        {currentGameIndex === index && (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                ))}
            </aside>
        </main>
    );
};

export default HeaderPopularGames;