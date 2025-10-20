// Per-account favorites: opgeslagen onder key "gameFavorites:<email>"
const KEY_PREFIX = 'gameFavorites:';

const currentEmail = () =>
    (localStorage.getItem('user_email') || 'anonymous').toLowerCase();

const keyFor = (email) => `${KEY_PREFIX}${(email || currentEmail()).toLowerCase()}`;

const safeParse = (v, fallback) => {
    try { return JSON.parse(v); } catch { return fallback; }
};

// --- Public API ---
export const getFavorites = (email) => {
    const list = safeParse(localStorage.getItem(keyFor(email)), null);
    return Array.isArray(list) ? list : [];
};

const saveFavorites = (favorites, email) => {
    localStorage.setItem(keyFor(email), JSON.stringify(favorites));
    notifyListeners(email);
};

export const isFavorite = (gameId, email) =>
    getFavorites(email).some((fav) => fav.id === gameId);

export const addFavorite = (gameId, gameSlug, email) => {
    const favorites = getFavorites(email);
    if (favorites.some((f) => f.id === gameId)) return false;
    favorites.push({ id: gameId, slug: gameSlug });
    saveFavorites(favorites, email);
    return true;
};

export const removeFavorite = (gameId, email) => {
    const favorites = getFavorites(email);
    const filtered = favorites.filter((f) => f.id !== gameId);
    if (filtered.length === favorites.length) return false;
    saveFavorites(filtered, email);
    return true;
};

export const toggleFavorite = (gameId, gameSlug, email) => {
    if (isFavorite(gameId, email)) {
        removeFavorite(gameId, email);
        return false;
    }
    addFavorite(gameId, gameSlug, email);
    return true;
};

// Event listeners voor realtime UI-updates
const listeners = new Set();
export const subscribeFavoriteChanges = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};
const notifyListeners = (email) => {
    listeners.forEach((cb) => {
        try { cb(email || currentEmail()); } catch {}
    });
};
