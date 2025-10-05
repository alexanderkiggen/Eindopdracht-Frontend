import { useParams } from "react-router-dom";
import './Informatie.css';

function Informatie() {
    const { game_slug } = useParams();
    return (
        <div className="ontdekken-container">
            <h1>Welcome to the Informatie Page!</h1>
            <p>This is a simple Informatie page built with React.</p>
            <div>De game is {game_slug}</div>
        </div>
    );
}

export default Informatie;