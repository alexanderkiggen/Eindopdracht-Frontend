import favoritenData from '../data/favorieten.json';

export const getFavorites = () => {
    try {
        const favorites = localStorage.getItem('gameFavorites');
        if (favorites) {
            return JSON.parse(favorites);
        }
        // Als localStorage leeg is wordt jsosn data gebruikt
        localStorage.setItem('gameFavorites', JSON.stringify(favoritenData));
        return favoritenData;
    } catch (error) {
        console.error('Error reading favorites:', error);
        return favoritenData;
    }
};

const saveFavorites = (favorites) => {
    try {
        localStorage.setItem('gameFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
};

export const isFavorite = (gameId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === gameId);
};

export const addFavorite = (gameId, gameSlug) => {
    try {
        const favorites = getFavorites();

        // Check of game al bestaat
        if (favorites.some(fav => fav.id === gameId)) {
            return false;
        }

        // Voeg toe
        favorites.push({ id: gameId, slug: gameSlug });
        saveFavorites(favorites);
        return true;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return false;
    }
};

export const removeFavorite = (gameId) => {
    try {
        const favorites = getFavorites();
        const filtered = favorites.filter(fav => fav.id !== gameId);

        if (filtered.length === favorites.length) {
            return false;
        }

        saveFavorites(filtered);
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
};

export const toggleFavorite = (gameId, gameSlug) => {
    if (isFavorite(gameId)) {
        removeFavorite(gameId);
        return false;
    } else {
        addFavorite(gameId, gameSlug);
        return true;
    }
};

export const initializeFavoritesFromJSON = () => {
    try {
        const existing = localStorage.getItem('gameFavorites');
        if (existing) {
            return;
        }

        // Gebruik geïmporteerde JSON data
        localStorage.setItem('gameFavorites', JSON.stringify(favoritenData));
    } catch (error) {
        console.error('Error initializing favorites:', error);
    }
};

// Event listener systeem voor realtime updates
const listeners = new Set();

export const subscribeFavoriteChanges = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};

const notifyListeners = () => {
    listeners.forEach(callback => callback());
};
