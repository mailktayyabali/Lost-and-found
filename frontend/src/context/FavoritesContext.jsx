import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { favoritesApi } from "../services/favoritesApi";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await favoritesApi.getFavorites();
      if (response.success) {
        // Transform backend response (array of favorite objects) to array of item IDs
        const favoriteItems = response.data?.favorites || response.data || [];
        const itemIds = favoriteItems.map((fav) => fav.item?.id || fav.item?._id || fav.itemId);
        setFavorites(itemIds);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (itemId) => {
    if (!user) return false;
    
    try {
      const response = await favoritesApi.addFavorite(itemId);
      if (response.success) {
        if (!favorites.includes(itemId)) {
          setFavorites([...favorites, itemId]);
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
    
    try {
      const response = await favoritesApi.removeFavorite(itemId);
      if (response.success) {
        setFavorites(favorites.filter((id) => id !== itemId));
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
    return favorites.includes(itemId);
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
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

