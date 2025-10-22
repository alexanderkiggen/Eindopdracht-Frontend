import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './FavorietenGebruiker.css';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary/ButtonSecondary';
import GameCard from "../GameCard/GameCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import {
    fetchFavoritesFromBackend,
    subscribeFavoriteChanges
} from "../../utils/favoritesManager";
import { getAuth } from "../../utils/authentication";

function FavorietenGebruiker() {
    const [favorites, setFavorites] = useState([]);
    const [gamesData, setGamesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const gamesPerPage = 8;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        loadFavorites();

        const unsubscribe = subscribeFavoriteChanges(() => {
            loadFavorites();
        });

        return () => unsubscribe();
    }, []);

    const loadFavorites = async () => {
        const { user } = getAuth();
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Haal favorieten op uit backend
            const backendFavorites = await fetchFavoritesFromBackend(user.id);
            setFavorites(backendFavorites);

            if (backendFavorites.length === 0) {
                setGamesData([]);
                setLoading(false);
                return;
            }

            // Haal game details op
            const gamePromises = backendFavorites.map(fav =>
                axios.get(`${BASE_URL}/games/${fav.slug}`, {
                    params: { key: import.meta.env.VITE_API_KEY }
                }).catch(err => {
                    console.error(`Failed to fetch game ${fav.slug}:`, err);
                    return null;
                })
            );

            const gamesResponses = await Promise.all(gamePromises);
            const games = gamesResponses
                .filter(response => response !== null)
                .map(response => response.data);

            setGamesData(games);
        } catch (err) {
            console.error('Error loading favorites:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteRemoved = (gameId) => {
        // Update local state
        setGamesData(prev => prev.filter(game => game.id !== gameId));
        setFavorites(prev => prev.filter(fav => fav.gameId !== gameId));

        // Controleer aantal
        const newTotalPages = Math.ceil((gamesData.length - 1) / gamesPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setSearchParams({ page: newTotalPages });
        }
    };

    const totalPages = Math.ceil(gamesData.length / gamesPerPage);
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = gamesData.slice(indexOfFirstGame, indexOfLastGame);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) handlePageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 4;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    if (loading) {
        return (
            <div className="favorieten-lijst-container">
                <LoadingSpinner text={"Favorieten worden geladen"} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorieten-lijst-container">
                <div className="favorieten-error">
                    <h2>Fout bij het laden van favorieten</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={loadFavorites}>Opnieuw proberen</ButtonPrimary>
                </div>
            </div>
        );
    }

    if (gamesData.length === 0) {
        return (
            <div className="favorieten-lijst-container">
                <div className="favorieten-empty">
                    <div className="favorieten-empty__icon"></div>
                    <h2>Nog geen favorieten</h2>
                    <p>Begin met het toevoegen van games aan je favorieten!</p>
                    <ButtonPrimary to="/ontdekken">Ontdek Games</ButtonPrimary>
                </div>
            </div>
        );
    }

    return (
        <div className="favorieten-lijst-container">
            <div className="favorieten-grid">
                {currentGames.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        favorites={favorites}
                        onFavoriteChange={handleFavoriteRemoved}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="favorieten-pagination">
                    <ButtonSecondary
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        {isMobile ? "<" : "Vorige Pagina"}
                    </ButtonSecondary>

                    <div className="favorieten-pagination__pages">
                        {getPageNumbers().map(pageNum => (
                            <button
                                key={pageNum}
                                className={`favorieten-pagination__page ${currentPage === pageNum ? 'favorieten-pagination__page--active' : ''}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <ButtonSecondary
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        {isMobile ? ">" : "Volgende Pagina"}
                    </ButtonSecondary>
                </div>
            )}
        </div>
    );
}

export default FavorietenGebruiker;