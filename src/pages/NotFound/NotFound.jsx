import './NotFound.css';
import ButtonPrimary from '../../components/ButtonPrimary/ButtonPrimary';
import ButtonSecondary from '../../components/ButtonSecondary/ButtonSecondary';

function NotFound() {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Pagina niet gevonden</h2>
                <p className="notfound-description">
                    Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
                </p>

                <div className="notfound-actions">
                    <ButtonSecondary onClick={handleGoBack}>
                        Ga Terug
                    </ButtonSecondary>
                    <ButtonPrimary to="/">
                        Terug naar Home
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
}

export default NotFound;