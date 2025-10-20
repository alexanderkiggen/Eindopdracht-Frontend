import axios from 'axios';

const BASE = import.meta.env.VITE_NOVI_PROJECT_URL;
const PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID;

const STORAGE_TOKEN_KEY = 'token';
const STORAGE_EMAIL_KEY = 'user_email';

export function getAuth() {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const email = localStorage.getItem(STORAGE_EMAIL_KEY);
    return token && email ? { token, user: { email } } : { token: null, user: null };
}

export function setAuth({ token, email }) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_EMAIL_KEY, email);
}

export function clearAuth() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_EMAIL_KEY);
}

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((cfg) => {
    if (PROJECT_ID) cfg.headers['novi-education-project-id'] = PROJECT_ID;
    const { token } = getAuth();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export async function loginRequest(email, password) {
    const { data } = await api.post(
        '/api/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
    );

    const userEmail = data?.user?.email || email;
    setAuth({ token: data.token, email: userEmail });
    return { token: data.token, user: { email: userEmail } };
}

/**
 * Registreert een nieuwe gebruiker en logt direct in.
 * Vereist dat je API 'users' als collectie toestaat met POST voor 'anonymous'.
 */
export async function registerRequest(email, password) {
    // 1) Account aanmaken
    await api.post(
        '/api/users',
        { email, password, roles: ['user'] },
        { headers: { 'Content-Type': 'application/json' } }
    );
    // 2) Direct inloggen en token opslaan
    return loginRequest(email, password);
}
