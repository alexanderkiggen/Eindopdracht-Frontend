import {useEffect, useMemo, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";

import ButtonPrimary from "../../components/ButtonPrimary/ButtonPrimary";
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';
import "./Zoeken.css";
import NoImage from "../../assets/images/no-image.png";

function useQueryParam(name) {
    const {search} = useLocation();
    return useMemo(() => new URLSearchParams(search).get(name) ?? "", [search, name]);
}

export default function Zoeken() {
    const searchQ = useQueryParam("search");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchGames = async (url) => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(url);
            const data = res.data;
            setItems(data.results ?? []);
        } catch (e) {
            setError(e.response?.statusText || e.message || "Fout bij het laden van games");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQ) {
            setItems([]);
            return;
        }
        const url = `${import.meta.env.VITE_BASE_URL}/games?key=${import.meta.env.VITE_API_KEY}&search=${encodeURIComponent(searchQ)}&page_size=20&page=1`;
        fetchGames(url);
    }, [searchQ]);

    if (!searchQ) {
        return (
            <main className="zoekresultaten-container">
                <h1>Zoeken</h1>
                <p>Voer een zoekterm in.</p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="zoekresultaten-container">
                <LoadingSpinner text={`Zoeken naar games voor "${searchQ}"...`}/>
            </main>
        );
    }

    if (error) {
        return (
            <main className="ontdekken-container">
                <div className="ontdekken-error">
                    <h2>Fout bij het laden van games</h2>
                    <p>{error}</p>
                    <ButtonPrimary onClick={() => window.location.reload()}>
                        Opnieuw proberen
                    </ButtonPrimary>
                </div>
            </main>
        );
    }

    return (
        <main className="zoekresultaten-container">
        <h1>Zoekresultaten voor "{searchQ}"</h1>

        {items.length === 0 && !loading && <p>Geen resultaten gevonden.</p>}

        <ul className="zoekresultaten-lijst">
            {items.map((game) => (
                <li key={`game-${game.id}-${game.slug}`} className="zoekresultaat">
                <figure className="zoekresultaat__figure">
                    <img
                        src={game.background_image || NoImage}
                        alt={game.name}
                        className="zoekresultaat__image"
                        loading="lazy"
                    />
                    <figcaption className="zoekresultaat__info">
                        <div className="zoekresultaat__text">
                            <h3 className="zoekresultaat__title">{game.name}</h3>
                            <p className="zoekresultaat__genre">
                                {game.genres?.map((g) => g.name).join(", ") || "Geen genres"}
                            </p>
                        </div>

                        <ButtonPrimary to={`/informatie/${game.slug}`}>
                            Bekijk de game
                        </ButtonPrimary>
                    </figcaption>
                </figure>
            </li>
            ))}
        </ul>
    </main>
    );
}