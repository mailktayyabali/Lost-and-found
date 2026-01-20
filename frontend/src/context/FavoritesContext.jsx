import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { favoritesApi } from "../services/favoritesApi";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoriteItems([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await favoritesApi.getFavorites();
      console.log('FavoritesContext: getFavorites response', response);

      if (response.success) {
        // Transform backend response (array of favorite objects) to array of item IDs
        const favs = response.data?.favorites || response.data || [];
        console.log('FavoritesContext: Parsed favorites array', favs);

        // Extract the actual item objects
        const items = favs.map(f => f.item).filter(i => i); // Filter out nulls
        console.log('FavoritesContext: Extracted items', items);

        const itemIds = items.map((item) => item.id || item._id);

        setFavorites(itemIds);

        // Store full items with consistent ID
        const finalItems = items.map(item => ({
          ...item,
          id: item.id || item._id,
          imageUrl: item.imageUrl || (item.images && item.images[0]) || null
        }));
        console.log('FavoritesContext: Setting favoriteItems state', finalItems);
        setFavoriteItems(finalItems);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
      setFavoriteItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (itemId) => {
    if (!user) return false;

    console.log(`FavoritesContext: Adding favorite ${itemId}`);
    try {
      const response = await favoritesApi.addFavorite(itemId);
      if (response.success) {
        if (!isFavorite(itemId)) {
          setFavorites(prev => [...prev, itemId]);
          // Note: We don't have the full item here without fetching
          loadFavorites();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      return false;
    }
  };

  const removeFavorite = async (itemId) => {
    if (!user) return false;

    console.log(`FavoritesContext: Removing favorite ${itemId}`);
    try {
      const response = await favoritesApi.removeFavorite(itemId);
      if (response.success) {
        setFavorites(prev => prev.filter((id) => String(id) !== String(itemId)));
        setFavoriteItems(prev => prev.filter((item) => String(item.id) !== String(itemId)));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      return false;
    }
  };

  const toggleFavorite = async (itemId) => {
    if (!user) return false;

    if (isFavorite(itemId)) {
      return await removeFavorite(itemId);
    } else {
      return await addFavorite(itemId);
    }
  };

  const isFavorite = (itemId) => {
    return favorites.some(id => String(id) === String(itemId));
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteItems,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        getFavoriteCount,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

