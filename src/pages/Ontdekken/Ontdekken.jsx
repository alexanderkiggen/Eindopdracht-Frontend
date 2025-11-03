import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from 'axios';

import './Ontdekken.css';

import GameCard from '../../components/GameCard/GameCard';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';
import ShortDescription from '../../components/ShortDescription/ShortDescription';
import FilterSection from '../../components/FilterSection/FilterSection';
import GenreCarousel from '../../components/GenreCarousel/GenreCarousel';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import {fetchFavoritesFromBackend, subscribeFavoriteChanges} from '../../utils/favoritesManager';
import {getAuth} from '../../utils/authentication';

function Ontdekken() {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    const GAMES_PER_PAGE = 9;
    const PLATFORMS = '4,187,18,1,186';

    const currentPage = parseInt(searchParams.get('page')) || 1;
    const selectedGenre = searchParams.get('genre') || '';
    const selectedPlatform = searchParams.get('platform') || '';
    const selectedFeatures = searchParams.get('features') || '';
    const sortOrder = searchParams.get('sort') || '-rating';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchGames();
        loadFavorites();
    }, [currentPage, selectedGenre, selectedPlatform, selectedFeatures, sortOrder]);

    useEffect(() => {
        const unsubscribe = subscribeFavoriteChanges(() => {
            loadFavorites();
        });
        return () => unsubscribe();
    }, []);

    const loadFavorites = async () => {
        const {user} = getAuth();
        if (!user?.id) {
            setFavorites([]);
            return;
        }

        try {
            const favs = await fetchFavoritesFromBackend(user.id);
            setFavorites(favs);
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                key: import.meta.env.VITE_API_KEY,
                page: currentPage,
                page_size: GAMES_PER_PAGE,
                platforms: selectedPlatform || PLATFORMS,
                ordering: sortOrder,
            };
            if (selectedGenre) params.genres = selectedGenre;
            if (selectedFeatures) params.tags = selectedFeatures;

            const listResp = await axios.get(`${import.meta.env.VITE_BASE_URL}/games`, {params});
            const baseResults = listResp.data?.results ?? [];
            setTotalCount(listResp.data?.count || 0);

            const detailPromises = baseResults.slice(0, GAMES_PER_PAGE).map((g) => axios
                .get(`${import.meta.env.VITE_BASE_URL}/games/${g.slug}`, {params: {key: import.meta.env.VITE_API_KEY}})
                .then((r) => ({
                    slug: g.slug,
                    description_raw: r.data?.description_raw ?? '',
                    developers: r.data?.developers ?? [],
                    publishers: r.data?.publishers ?? [],
                }))
                .catch(() => ({
                    slug: g.slug, description_raw: '', developers: [], publishers: [],
                })),);

            const details = await Promise.all(detailPromises);
            const detailsBySlug = new Map(details.map((d) => [d.slug, d]));
            const enriched = baseResults.map((b) => {
                const d = detailsBySlug.get(b.slug);
                return d ? {...b, ...d} : b;
            });

            setGames(enriched);
        } catch (err) {
            console.error('Error fetching games:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (filterType, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(filterType, value); else newParams.delete(filterType);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageChange = (pageNumber) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', pageNumber);
        setSearchParams(newParams);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handlePrevPage = () => {
        if (currentPage > 1) handlePageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(totalCount / GAMES_PER_PAGE);
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(totalCount / GAMES_PER_PAGE);
        const pages = [];
        const maxVisible = 4;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    return (
        <main className="ontdekken-container">
            <header className="ontdekken-header">
                <h1>Ontdek Games</h1>
                <ShortDescription
                    maxLength={65}
                    text="Welkom op de ontdekken-pagina! Hier vind je een uitgebreide en gefilterde catalogus van games. Gebruik de genres, platforms en kenmerken aan de zijkant om jouw zoektocht te verfijnen. Duik in verschillende stijlen en verhalen, van intense actie tot ontspannen puzzels. Of je nu op zoek bent naar de nieuwste AAA-titel, een specifieke co-op game voor de PlayStation, of een verborgen parel in het indie-genre, onze filters helpen je om moeiteloos jouw volgende game-avontuur te selecteren." />
            </header>

            {loading && (
                <LoadingSpinner/>
            )}

            {!loading && error && (
                <div className="ontdekken-error" role="alert">
                    <h2>Fout bij het laden van games</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchGames}>Opnieuw proberen</ButtonPrimary>
                </div>
            )}

            {!loading && !error && (<>
                    <GenreCarousel onGenreSelect={(genre) => updateFilters('genre', genre)}/>

                    <section className="ontdekken-content">
                        <FilterSection
                            selectedGenre={selectedGenre}
                            selectedPlatform={selectedPlatform}
                            selectedFeatures={selectedFeatures}
                            sortOrder={sortOrder}
                            onFilterChange={updateFilters}
                        />

                        <section className="ontdekken-games">
                            <div className="ontdekken-grid">
                                {games.map((game) => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        favorites={favorites}
                                        showFavoriteButton={true}
                                    />
                                ))}
                            </div>

                            <nav className="ontdekken-pagination" aria-label="Game paginering">
                                <ButtonSecondary onClick={handlePrevPage} disabled={currentPage === 1}>
                                    {isMobile ? '<' : 'Vorige Pagina'}
                                </ButtonSecondary>

                                <div className="ontdekken-pagination__pages">
                                    {getPageNumbers().map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            className={`ontdekken-pagination__page ${currentPage === pageNum ? 'ontdekken-pagination__page--active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                            aria-current={currentPage === pageNum ? 'page' : undefined}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>

                                <ButtonSecondary
                                    onClick={handleNextPage}
                                    disabled={currentPage >= Math.ceil(totalCount / GAMES_PER_PAGE)}
                                >
                                    {isMobile ? '>' : 'Volgende Pagina'}
                                </ButtonSecondary>
                            </nav>
                        </section>
                    </section>
                </>)}
        </main>);
}

export default Ontdekken;