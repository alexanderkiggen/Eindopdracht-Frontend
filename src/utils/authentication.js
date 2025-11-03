import axios from 'axios';

const STORAGE_TOKEN_KEY = 'token';
const STORAGE_USER_KEY = 'user_data';

export function getAuth() {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userStr = localStorage.getItem(STORAGE_USER_KEY);

    if (!token || !userStr) {
        return { token: null, user: null };
    }

    try {
        const user = JSON.parse(userStr);
        return { token, user };
    } catch {
        return { token: null, user: null };
    }
}

export function setAuth({ token, user }) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
}

export const api = axios.create({ baseURL: import.meta.env.VITE_NOVI_PROJECT_URL });

api.interceptors.request.use((cfg) => {
    if (import.meta.env.VITE_NOVI_PROJECT_KEY) cfg.headers['novi-education-project-id'] = import.meta.env.VITE_NOVI_PROJECT_KEY;
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

    // User ID uit de JWT token
    const userId = decodeUserId(data.token);

    const user = {
        id: userId,
        email: data?.user?.email || email,
        roles: data?.user?.roles || ['user']
    };

    setAuth({ token: data.token, user });
    return { token: data.token, user };
}

export async function registerRequest(email, password) {
    // Controleer of e-mail al bestaat
    try {
        const { data: existingUsers } = await api.get('/api/users');
        const userExists = existingUsers.some(user =>
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (userExists) {
            throw new Error('Dit e-mailadres is al in gebruik');
        }
    } catch (error) {
        if (error.message === 'Dit e-mailadres is al in gebruik') {
            throw error;
        }

        console.warn('Could not check existing users:', error);
    }

    // Account aanmaken = userId ontvangen
    const { data: userData } = await api.post(
        '/api/users',
        { email, password, roles: ['user'] },
        { headers: { 'Content-Type': 'application/json' } }
    );

    // Direct inloggen
    return loginRequest(email, password);
}

// Helper functie om userId uit JWT te halen
function decodeUserId(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.sub || decoded.userId || decoded.id;
    } catch {
        return null;
    }
}