import {useState, useEffect} from 'react';
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

function Ontdekken() {
    const [games, setGames] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    const API_KEY = '1c64704f98f5425d89b4a108cce3c0bb';
    const BASE_URL = 'https://api.rawg.io/api';
    const GAMES_PER_PAGE = 9;

    const PLATFORMS = '4,187,18,1,186';

    const currentPage = parseInt(searchParams.get('page')) || 1;
    const selectedGenre = searchParams.get('genre') || '';
    const selectedPlatform = searchParams.get('platform') || '';
    const selectedFeatures = searchParams.get('features') || '';
    const sortOrder = searchParams.get('sort') || '-rating';

    useEffect(() => {
        // Dit is voor de pagina knoppen
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchGames();
    }, [currentPage, selectedGenre, selectedPlatform, selectedFeatures, sortOrder]);

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                key: API_KEY,
                page: currentPage,
                page_size: GAMES_PER_PAGE,
                platforms: selectedPlatform || PLATFORMS,
                ordering: sortOrder,
            };
            if (selectedGenre) params.genres = selectedGenre;
            if (selectedFeatures) params.tags = selectedFeatures;

            const listResp = await axios.get(`${BASE_URL}/games`, {params});
            const baseResults = listResp.data?.results ?? [];
            setTotalCount(listResp.data?.count || 0);

            const detailPromises = baseResults.slice(0, GAMES_PER_PAGE).map((g) =>
                axios
                    .get(`${BASE_URL}/games/${g.slug}`, {params: {key: API_KEY}})
                    .then((r) => ({
                        slug: g.slug,
                        description_raw: r.data?.description_raw ?? '',
                        developers: r.data?.developers ?? [],
                        publishers: r.data?.publishers ?? [],
                    }))
                    .catch(() => ({
                        slug: g.slug,
                        description_raw: '',
                        developers: [],
                        publishers: [],
                    })),
            );

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
        if (value) newParams.set(filterType, value);
        else newParams.delete(filterType);
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

    if (loading) {
        return (
            <div className="ontdekken-container">
                <div className="ontdekken-header">
                    <h1>Ontdek Games</h1>
                </div>
                <LoadingSpinner/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ontdekken-container">
                <div className="ontdekken-header">
                    <h1>Ontdek Games</h1>
                </div>
                <div className="ontdekken-error">
                    <h2>Er ging iets mis</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={fetchGames}>Opnieuw proberen</ButtonPrimary>
                </div>
            </div>
        );
    }

    return (
        <div className="ontdekken-container">
            <div className="ontdekken-header">
                <h1>Ontdek Games</h1>
                <ShortDescription
                    text="Ontdek visuele hoogtes waar elke game tot leven komt in rijke kleuren, meeslepende details en unieke werelden vol verbeelding. Blader moeiteloos door een divers aanbod van genres, stijlen en verhalen — van grote AAA-avonturen tot charmante indieparels. Laat je inspireren door aanbevelingen, ontdek nieuwe favorieten en verdwaal in werelden die speciaal zijn gemaakt om te verkennen, te ontspannen en te genieten. Hier begint jouw volgende game-ervaring."
                />
            </div>

            <GenreCarousel onGenreSelect={(genre) => updateFilters('genre', genre)}/>

            <div className="ontdekken-content">
                <FilterSection
                    selectedGenre={selectedGenre}
                    selectedPlatform={selectedPlatform}
                    selectedFeatures={selectedFeatures}
                    sortOrder={sortOrder}
                    onFilterChange={updateFilters}
                />

                <div className="ontdekken-games">
                    <>
                        <div className="ontdekken-grid">
                            {games.map((game) => (
                                <GameCard key={game.id} game={game} showFavoriteButton={true}/>
                            ))}
                        </div>

                        <div className="ontdekken-pagination">
                            <ButtonSecondary onClick={handlePrevPage} disabled={currentPage === 1}>
                                {isMobile ? '<' : 'Vorige Pagina'}
                            </ButtonSecondary>

                            <div className="ontdekken-pagination__pages">
                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        className={`ontdekken-pagination__page ${
                                            currentPage === pageNum ? 'ontdekken-pagination__page--active' : ''
                                        }`}
                                        onClick={() => handlePageChange(pageNum)}
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
                        </div>
                    </>
                </div>
            </div>
        </div>
    );
}

export default Ontdekken;
