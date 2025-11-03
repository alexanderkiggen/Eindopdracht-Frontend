import { api } from './authentication.js';

const listeners = new Set();

// Haalt de favorieten op van de ingelogde gebruiker
export async function fetchFavoritesFromBackend(userId) {
    try {
        const { data } = await api.get(`/api/favorites?userId=${userId}`);
        return data || [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

// Voeg favorieten toe
export async function addFavoriteToBackend(userId, gameId, gameSlug) {
    try {
        // Haalt alle favorieten op om het laatste ID te bepalen
        const allFavorites = await api.get('/api/favorites');
        const maxId = allFavorites.data.reduce((max, fav) =>
            Math.max(max, fav.id || 0), 0
        );

        const { data } = await api.post('/api/favorites', {
            id: maxId + 1,
            userId,
            gameId,
            slug: gameSlug
        });

        notifyListeners();
        return data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}

// Verwijder favorieten
export async function removeFavoriteFromBackend(favoriteId) {
    try {
        await api.delete(`/api/favorites/${favoriteId}`);
        notifyListeners();
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

// Controleer of game favoriet is
export function isFavorite(gameId, favorites) {
    return favorites.some(fav => fav.gameId === gameId);
}

// Vind favoriet op basis van gameId
export function findFavorite(gameId, favorites) {
    return favorites.find(fav => fav.gameId === gameId);
}

// Toggle favoriet (toevoegen of verwijderen)
export async function toggleFavorite(userId, gameId, gameSlug, favorites) {
    const existing = findFavorite(gameId, favorites);

    if (existing) {
        await removeFavoriteFromBackend(existing.id);
        return { isFavorite: false, action: 'removed' };
    } else {
        await addFavoriteToBackend(userId, gameId, gameSlug);
        return { isFavorite: true, action: 'added' };
    }
}

// Event listeners
export function subscribeFavoriteChanges(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function notifyListeners() {
    listeners.forEach(cb => {
        try { cb(); } catch (error) {
            console.error('Listener error:', error);
        }
    });
}