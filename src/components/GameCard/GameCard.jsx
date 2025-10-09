import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./GameCard.css";

import RatingGame from "../RatingGame/RatingGame.jsx";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary.jsx";
import PlayStationIcon from "../../assets/icons/playstation.svg";
import XboxIcon from "../../assets/icons/xbox.svg";
import WindowsIcon from "../../assets/icons/windows.svg";
import NoImage from "../../assets/images/no-image.png";

import { toggleFavorite, isFavorite, subscribeFavoriteChanges } from "../../utils/favoritesManager";

function GameCard({ game, removeFavorite, showFavoriteButton = true, onFavoriteChange }) {
    const navigate = useNavigate();
    const [isFav, setIsFav] = useState(() => isFavorite(game.id));

    // Check status opnieuw als game.id verandert
    useEffect(() => {
        setIsFav(isFavorite(game.id));
    }, [game.id]);

    const getPlatformIcon = (platformName) => {
        const name = platformName.toLowerCase();
        if (name.includes("playstation") || name.includes("ps")) {
            return <img src={PlayStationIcon} alt="PlayStation" className="favorieten-card__platform-icon" />;
        }
        if (name.includes("xbox")) {
            return <img src={XboxIcon} alt="Xbox" className="favorieten-card__platform-icon" />;
        }
        if (name.includes("pc") || name.includes("windows")) {
            return <img src={WindowsIcon} alt="PC" className="favorieten-card__platform-icon" />;
        }
        return null;
    };

    const truncateText = (text, maxLength = 125) => {
        if (!text) return "Helaas is er geen beschrijving beschikbaar voor deze game, maar je kunt wel andere gegevens bekijken op de informatie-pagina.";

        // HTML tags verwijderen
        let cleanText = text.replace(/<[^>]*>/g, "");

        // Alle hyperlinks (http/https + woorden zonder spatie) verwijderen
        cleanText = cleanText.replace(/https?:\/\/\S+/g, "");

        // Trim dubbele spaties na verwijderen
        cleanText = cleanText.replace(/\s{2,}/g, " ").trim();

        // Inkorten
        return cleanText.length > maxLength
            ? cleanText.substring(0, maxLength) + "..."
            : cleanText;
    };


    const handleFavoriteClick = (e) => {
        e.stopPropagation();

        const newFavStatus = toggleFavorite(game.id, game.slug);
        setIsFav(newFavStatus);

        if (onFavoriteChange) {
            onFavoriteChange(game.id, newFavStatus);
        }

        // Dit is voor de favorietenpagina
        if (!newFavStatus && removeFavorite) {
            removeFavorite(game.id);
        }
    };

    return (
        <div key={game.id} className="favorieten-card">
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
                {showFavoriteButton && (
                    <button
                        onClick={handleFavoriteClick}
                        className={`favorieten-card__favorite-btn ${isFav ? 'favorieten-card__favorite-btn--active' : ''}`}
                    ></button>
                )}
            </div>

            <div className="favorieten-card__content">
                <div className="favorieten-card__header">
                    <p className="favorieten-card__maker">
                        {game.developers && game.developers.length > 0
                            ? game.developers[0].name
                            : "Onbekende ontwikkelaar"}
                    </p>
                    <h3 className="favorieten-card__title">{game.name}</h3>
                    <p className="favorieten-card__description">
                        {truncateText(game.description_raw)}
                    </p>
                </div>

                <div className="favorieten-card__footer">
                    <div className="favorieten-card__rating">
                        <RatingGame gameRating={game.rating} />
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
        </div>
    );
}

export default GameCard;