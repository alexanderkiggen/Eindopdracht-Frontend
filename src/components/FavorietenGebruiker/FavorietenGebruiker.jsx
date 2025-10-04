import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './FavorietenGebruiker.css';
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary/ButtonSecondary';
import GameCard from "../GameCard/GameCard";

function Favorieten() {
    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const gamesPerPage = 8;

    const API_KEY = "1c64704f98f5425d89b4a108cce3c0bb";
    const BASE_URL = 'https://api.rawg.io/api';

    const favoriteGames = [
        {id: 326243, slug: "elden-ring"},
        {id: 3498, slug: "grand-theft-auto-v"},
        {id: 41494, slug: "cyberpunk-2077"},
        {id: 4200, slug: "portal-2"},
        {id: 5286, slug: "tomb-raider"},
        {id: 13536, slug: "portal"},
        {id: 12020, slug: "left-4-dead-2"},
        {id: 58175, slug: "god-of-war-2"},
        {id: 28, slug: "red-dead-redemption-2"},
    ];

    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchFavoriteGames();
    }, []);

    const fetchFavoriteGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const gamePromises = favoriteGames.map(fav =>
                axios.get(`${BASE_URL}/games/${fav.slug}`, {
                    params: { key: API_KEY }
                })
            );

            const gamesResponses = await Promise.all(gamePromises);
            const gamesData = gamesResponses.map(response => response.data);
            setAllGames(gamesData);
        } catch (err) {
            console.error('Error fetching favorite games:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = (gameId) => {
        const newGames = allGames.filter(game => game.id !== gameId);
        setAllGames(newGames);

        const newTotalPages = Math.ceil(newGames.length / gamesPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setSearchParams({ page: newTotalPages });
        }
    };

    const totalPages = Math.ceil(allGames.length / gamesPerPage);
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = allGames.slice(indexOfFirstGame, indexOfLastGame);

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
        if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    if (loading) {
        return (
            <div className="favorieten-lijst-container">
                <div className="favorieten-loading">
                    <div>Je favorieten worden geladen...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorieten-lijst-container">
                <div className="favorieten-error">
                    <h2>Fout bij het laden</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchFavoriteGames}>Opnieuw proberen</ButtonPrimary>
                </div>
            </div>
        );
    }

    if (allGames.length === 0) {
        return (
            <div className="favorieten-lijst-container">
                <div className="favorieten-empty">
                    <div className="favorieten-empty__icon"></div>
                    <h2>Nog geen favorieten</h2>
                    <p>Begin met het toevoegen van games aan je favorieten!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorieten-lijst-container">
            <div className="favorieten-grid">
                {currentGames.map((game) => (
                    <GameCard key={game.id} game={game} removeFavorite={removeFavorite} />
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

export default Favorieten;
