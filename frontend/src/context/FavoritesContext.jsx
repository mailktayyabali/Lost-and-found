import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = () => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_favorites");
    if (stored) {
      const allFavorites = JSON.parse(stored);
      const userFavorites = allFavorites[user.email] || [];
      setFavorites(userFavorites);
    }
  };

  const saveFavorites = (itemIds) => {
    if (!user) return;
    
    const stored = localStorage.getItem("findit_favorites");
    const allFavorites = stored ? JSON.parse(stored) : {};
    allFavorites[user.email] = itemIds;
    localStorage.setItem("findit_favorites", JSON.stringify(allFavorites));
    setFavorites(itemIds);
  };

  const addFavorite = (itemId) => {
    if (!user) return false;
    
    if (!favorites.includes(itemId)) {
      const updated = [...favorites, itemId];
      saveFavorites(updated);
      return true;
    }
    return false;
  };

  const removeFavorite = (itemId) => {
    if (!user) return false;
    
    const updated = favorites.filter((id) => id !== itemId);
    saveFavorites(updated);
    return true;
  };

  const toggleFavorite = (itemId) => {
    if (!user) return false;
    
    if (isFavorite(itemId)) {
      return removeFavorite(itemId);
    } else {
      return addFavorite(itemId);
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
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

