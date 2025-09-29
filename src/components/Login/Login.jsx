import React, { useState } from 'react';
import './Login.css';
import ButtonPrimary from "../../components/ButtonPrimary/ButtonPrimary";

function Login({ onClose }) {
    const [mode, setMode] = useState("login");
    const [resetEmail, setResetEmail] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login gegevens:', { email: formData.email, password: formData.password });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Registreer gegevens:', formData);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        console.log('Wachtwoord reset aangevraagd voor:', resetEmail);
        setResetEmail('');
        setMode("login");
    };

    return (
        <div className="login-page" onClick={onClose}>
            <div className="login-card" onClick={(e) => e.stopPropagation()}>
                <div className="login-header">
                    <button className="back-link" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Sluiten
                    </button>
                    <h1>
                        {mode === "register"
                            ? "Registreren"
                            : mode === "forgot"
                                ? "Wachtwoord vergeten"
                                : "Inloggen"}
                    </h1>
                </div>

                <form onSubmit={
                    mode === "register"
                        ? handleRegister
                        : mode === "forgot"
                            ? handlePasswordReset
                            : handleLogin
                }>
                    {mode === "register" && (
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Voornaam</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Voornaam"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Achternaam</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Achternaam"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {(mode === "login" || mode === "register") && (
                        <>
                            <div className="form-group">
                                <label htmlFor="email">E-mailadres</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="je@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Wachtwoord</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Ssss"
                                    required
                                />
                                {mode === "login" && (
                                    <button
                                        type="button"
                                        className="forgot-password"
                                        onClick={() => setMode("forgot")}
                                    >
                                        Wachtwoord vergeten?
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {mode === "forgot" && (
                        <div className="form-group">
                            <label htmlFor="resetEmail">E-mailadres</label>
                            <input
                                type="email"
                                id="resetEmail"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="je@email.com"
                                required
                                autoFocus
                            />
                        </div>
                    )}

                    <ButtonPrimary type="submit">
                        {mode === "register"
                            ? "Registreren"
                            : mode === "forgot"
                                ? "Wachtwoord aanvragen"
                                : "Inloggen"}
                    </ButtonPrimary>

                    <div className="form-footer">
                        {mode === "login" && (
                            <>
                                <p>Ben je nog niet bekend bij ons? </p>
                                <button
                                    type="button"
                                    className="toggle-mode"
                                    onClick={() => setMode("register")}
                                >
                                    Registreer
                                </button>
                                <span className="footer-suffix">  je dan eerst en krijg toegang tot alles!</span>
                            </>
                        )}

                        {mode === "register" && (
                            <>
                                <p>Heb je al een account? </p>
                                <button
                                    type="button"
                                    className="toggle-mode"
                                    onClick={() => setMode("login")}
                                >
                                    Breng me naar inloggen
                                </button>
                            </>
                        )}

                        {mode === "forgot" && (
                            <>
                                <p>Je wachtwoord toch herinnerd? </p>
                                <button
                                    type="button"
                                    className="toggle-mode"
                                    onClick={() => setMode("login")}
                                >
                                    Breng me naar inloggen
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;