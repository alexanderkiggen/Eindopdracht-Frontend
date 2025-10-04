import { useNavigate } from "react-router-dom";

import "./GameCard.css";
import RatingGame from "../RatingGame/RatingGame.jsx";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary.jsx";
import PlayStationIcon from "../../assets/icons/playstation.svg";
import XboxIcon from "../../assets/icons/xbox.svg";
import WindowsIcon from "../../assets/icons/windows.svg";
import NoImage from "../../assets/images/no-image.png";

function GameCard({ game, removeFavorite }) {
    const navigate = useNavigate();

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
        if (!text) return "Helaas is er geen beschrijving beschikbaar over deze game.";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div key={game.id} className="favorieten-card">
            <div
                className="favorieten-card__image-wrapper"
                onClick={() => navigate(`/ontdekken?game=${game.slug}`)}
                style={{ cursor: "pointer" }}
            >
                <img
                    src={game.background_image || NoImage}
                    alt={game.name}
                    className="favorieten-card__image"
                    loading="lazy"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(game.id);
                    }}
                    className="favorieten-card__favorite-btn favorieten-card__favorite-btn--active"
                    aria-label="Verwijder uit favorieten"
                ></button>
            </div>

            <div className="favorieten-card__content">
                <div className="favorieten-card__header">
                    <p className="favorieten-card__maker">
                        {game.developers && game.developers.length > 0 ? game.developers[0].name : "Onbekende ontwikkelaar"}
                    </p>
                    <h3 className="favorieten-card__title">{game.name}</h3>
                    <p className="favorieten-card__description">{truncateText(game.description_raw)}</p>
                </div>

                <div className="favorieten-card__footer">
                    <div className="favorieten-card__rating">
                        <RatingGame gameRating={game.rating} />
                    </div>
                    <div className="favorieten-card__actions">
                        <ButtonPrimary to={`/ontdekken?game=${game.slug}`}>
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
