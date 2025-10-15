import { useRef, useState, useEffect } from 'react';
import './GenreCarousel.css';

import actionImg from '../../assets/genre/action.jpg';
import adventureImg from '../../assets/genre/adventure.jpg';
import arcadeImg from '../../assets/genre/arcade.jpg';
import casualImg from '../../assets/genre/casual.jpg';
import indieImg from '../../assets/genre/indie.jpg';
import puzzleImg from '../../assets/genre/puzzle.jpg';
import rpgImg from '../../assets/genre/rpg.jpg';
import shooterImg from '../../assets/genre/shooter.jpg';
import simulationImg from '../../assets/genre/simulation.jpg';
import strategyImg from '../../assets/genre/strategy.jpg';

function GenreCarousel({ onGenreSelect }) {
    const scrollContainerRef = useRef(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const genres = [
        { name: 'Action', slug: 'action', image: actionImg, description: 'Intense gevechten & spanning' },
        { name: 'Adventure', slug: 'adventure', image: adventureImg, description: 'Ontdek epische verhalen' },
        { name: 'Arcade', slug: 'arcade', image: arcadeImg, description: 'Klassieke snelle gameplay' },
        { name: 'Casual', slug: 'casual', image: casualImg, description: 'Ontspannen & toegankelijk' },
        { name: 'Indie', slug: 'indie', image: indieImg, description: 'Unieke creatieve games' },
        { name: 'Puzzle', slug: 'puzzle', image: puzzleImg, description: 'Breek je hersenen' },
        { name: 'RPG', slug: 'rpg', image: rpgImg, description: 'Jouw verhaal & avontuur' },
        { name: 'Shooter', slug: 'shooter', image: shooterImg, description: 'Precisie & strategie' },
        { name: 'Simulation', slug: 'simulation', image: simulationImg, description: 'Realistische ervaringen' },
        { name: 'Strategy', slug: 'strategy', image: strategyImg, description: 'Tactisch denken vereist' },
    ];

    const checkScrollPosition = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        checkScrollPosition();

        container.addEventListener('scroll', checkScrollPosition);
        return () => container.removeEventListener('scroll', checkScrollPosition);
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newPosition =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="genre-carousel">
            <div className="genre-carousel__header">
                <h2>Populaire Genres</h2>
                <div className="genre-carousel__controls">
                    <button
                        className="genre-carousel__arrow genre-carousel__arrow--left btn--secondary"
                        onClick={() => scroll('left')}
                        aria-label="Scroll links"
                        disabled={isAtStart}
                    >
                        ‹
                    </button>
                    <button
                        className="genre-carousel__arrow genre-carousel__arrow--right btn--secondary"
                        onClick={() => scroll('right')}
                        aria-label="Scroll rechts"
                        disabled={isAtEnd}
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="genre-carousel__container" ref={scrollContainerRef}>
                <div className="genre-carousel__track">
                    {genres.map((genre) => (
                        <div
                            key={genre.slug}
                            className="genre-card"
                            onClick={() => onGenreSelect(genre.slug)}
                        >
                            <img src={genre.image} alt={genre.name} loading="lazy" />
                            <div className="genre-card__overlay">
                                <p className="genre-card__title">{genre.name}</p>
                                <p className="genre-card__subtitle">{genre.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GenreCarousel;
