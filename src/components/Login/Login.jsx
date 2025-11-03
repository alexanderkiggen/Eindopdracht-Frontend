import {useState} from 'react';
import './Login.css';
import {loginRequest, registerRequest} from '../../utils/authentication.js';
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";

function Login({onClose, onSuccess}) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({email: '', password: '', confirm: ''});
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState('Voer je gegevens in om in te loggen.');

    const swapMode = (next) => {
        setMode(next);
        setMsg(next === 'login' ? 'Voer je gegevens in om in te loggen.' : 'Maak een account aan om te starten.');
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);

        try {
            if (mode === 'login') {
                setMsg('Bezig met inloggen...');
                const {user} = await loginRequest(form.email.trim(), form.password);
                setMsg('Inloggen gelukt.');
                onSuccess?.(user);
            } else {
                if (form.password.length < 6) {
                    setMsg('Wachtwoord moet minimaal 6 tekens zijn.');
                    setBusy(false);
                    return;
                }
                if (form.password !== form.confirm) {
                    setMsg('Wachtwoorden komen niet overeen.');
                    setBusy(false);
                    return;
                }
                setMsg('Bezig met registreren...');
                const {user} = await registerRequest(form.email.trim(), form.password);
                setMsg('Account aangemaakt en ingelogd.');
                onSuccess?.(user);
            }
        } catch (err) {
            let apiMsg;

            if (mode === 'login') {
                // Specifieke foutmelding voor login
                if (err?.response?.status === 401) {
                    apiMsg = 'Onbekende gegevens. Controleer je e-mailadres en wachtwoord.';
                } else {
                    apiMsg = err?.response?.data?.message || 'Inloggen mislukt. Probeer het opnieuw.';
                }
            } else {
                // Registratie foutmeldingen
                apiMsg = err?.message || err?.response?.data?.message || 'Registreren mislukt. Probeer het opnieuw.';
            }

            setMsg(apiMsg);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="login-page" onClick={onClose}>
            <div className="login-card" onClick={(e) => e.stopPropagation()}>
                <header className="login-header">
                    <button className="back-link" onClick={onClose}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Sluiten
                    </button>
                    <h1>{mode === 'login' ? 'Inloggen' : 'Registreren'}</h1>
                </header>

                <form onSubmit={submit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            minLength={6}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="confirm">Herhaal wachtwoord</label>
                            <input
                                id="confirm"
                                type="password"
                                required
                                value={form.confirm}
                                onChange={(e) => setForm({...form, confirm: e.target.value})}
                                minLength={6}
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <p className="status-message">
                        {msg}
                    </p>

                    <ButtonPrimary
                        type="submit"
                        disabled={busy}
                    >
                        {busy ? 'Bezig…' : mode === 'login' ? 'Inloggen' : 'Account aanmaken'}
                    </ButtonPrimary>

                    <p className="footer-text">
                        {mode === 'login' ? (
                            <>
                                Nog geen account?{' '}
                                <button
                                    type="button"
                                    className="toggle-link"
                                    onClick={() => swapMode('register')}
                                >
                                    Registreer hier
                                </button>
                                .
                            </>
                        ) : (
                            <>
                                Al een account?{' '}
                                <button
                                    type="button"
                                    className="toggle-link"
                                    onClick={() => swapMode('login')}
                                >
                                    Log hier in
                                </button>
                                .
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;