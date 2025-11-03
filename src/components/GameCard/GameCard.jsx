import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import "./GameCard.css";

import RatingGame from "../RatingGame/RatingGame.jsx";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary.jsx";
import PlayStationIcon from "../../assets/icons/playstation.png";
import XboxIcon from "../../assets/icons/xbox.png";
import WindowsIcon from "../../assets/icons/windows.png";
import NoImage from "../../assets/images/no-image.png";

import {isFavorite as checkIsFavorite, toggleFavorite} from "../../utils/favoritesManager";
import {getAuth} from "../../utils/authentication";

function GameCard({game, favorites = [], onFavoriteChange, showFavoriteButton = true}) {
    const navigate = useNavigate();
    const [isFav, setIsFav] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const {user} = getAuth();

    // Controleer favorieten status
    useEffect(() => {
        if (favorites && Array.isArray(favorites)) {
            setIsFav(checkIsFavorite(game.id, favorites));
        }
    }, [game.id, favorites]);

    const getPlatformIcon = (platformName) => {
        const name = platformName.toLowerCase();
        if (name.includes("playstation") || name.includes("ps")) {
            return <img src={PlayStationIcon} alt="PlayStation" className="favorieten-card__platform-icon" loading="lazy"/>;
        }
        if (name.includes("xbox")) {
            return <img src={XboxIcon} alt="Xbox" className="favorieten-card__platform-icon" loading="lazy"/>;
        }
        if (name.includes("pc") || name.includes("windows")) {
            return <img src={WindowsIcon} alt="PC" className="favorieten-card__platform-icon" loading="lazy"/>;
        }
        return null;
    };

    const truncateText = (text, maxLength = 125) => {
        if (!text) return "Helaas is er geen beschrijving beschikbaar voor deze game, maar je kunt wel andere gegevens bekijken op de informatie-pagina.";

        let cleanText = text.replace(/<[^>]*>/g, "");
        cleanText = cleanText.replace(/https?:\/\/\S+/g, "");
        cleanText = cleanText.replace(/\s{2,}/g, " ").trim();

        return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + "..." : cleanText;
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();

        if (!user?.id) return;

        if (isProcessing) return;

        try {
            setIsProcessing(true);

            const result = await toggleFavorite(user.id, game.id, game.slug, favorites);
            setIsFav(result.isFavorite);

            if (onFavoriteChange) {
                onFavoriteChange(game.id, result.isFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Er is iets misgegaan. Probeer het opnieuw.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <article key={game.id} className="favorieten-card">
            <div
                className="favorieten-card__image-wrapper"
                onClick={() => navigate(`/informatie/${game.slug}`)}
            >
                <img
                    src={game.background_image || NoImage}
                    alt={game.name}
                    className="favorieten-card__image"
                    loading="lazy"
                />
                {showFavoriteButton && user?.id && (
                    <button
                        onClick={handleFavoriteClick}
                        disabled={isProcessing}
                        className={`favorieten-card__favorite-btn ${isFav ? 'favorieten-card__favorite-btn--active' : ''}`}
                        style={{opacity: isProcessing ? 0.5 : 1}}
                    />
                )}
            </div>

            <div className="favorieten-card__content">
                <div className="favorieten-card__header">
                    <p className="favorieten-card__maker">
                        {game.developers && game.developers.length > 0 ? game.developers[0].name : "Onbekende ontwikkelaar"}
                    </p>
                    <h3 className="favorieten-card__title">{game.name}</h3>
                    <p className="favorieten-card__description">
                        {truncateText(game.description_raw)}
                    </p>
                </div>

                <div className="favorieten-card__footer">
                    <div className="favorieten-card__rating">
                        <RatingGame gameRating={game.rating}/>
                    </div>
                    <div className="favorieten-card__actions">
                        <ButtonPrimary to={`/informatie/${game.slug}`}>
                            Bekijk de game
                        </ButtonPrimary>
                        <div className="favorieten-card__platforms">
                            {game.parent_platforms?.slice(0, 3).map((platform, index) => (
                                <span key={index} title={platform.platform.name}>
                                    {getPlatformIcon(platform.platform.name)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default GameCard;