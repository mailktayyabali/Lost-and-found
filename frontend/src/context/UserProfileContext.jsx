import { createContext, useContext, useState, useEffect } from "react";

const UserProfileContext = createContext();

export const useUserProfiles = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadProfiles();
    loadReviews();
  }, []);

  const loadProfiles = () => {
    const stored = localStorage.getItem("findit_user_profiles");
    if (stored) {
      setProfiles(JSON.parse(stored));
    }
  };

  const loadReviews = () => {
    const stored = localStorage.getItem("findit_reviews");
    if (stored) {
      setReviews(JSON.parse(stored));
    }
  };

  const saveProfiles = (newProfiles) => {
    localStorage.setItem("findit_user_profiles", JSON.stringify(newProfiles));
    setProfiles(newProfiles);
  };

  const saveReviews = (newReviews) => {
    localStorage.setItem("findit_reviews", JSON.stringify(newReviews));
    setReviews(newReviews);
  };

  const getProfile = (userId) => {
    return profiles[userId] || null;
  };

  const createOrUpdateProfile = (userId, profileData) => {
    const updated = {
      ...profiles,
      [userId]: {
        ...profiles[userId],
        ...profileData,
        userId,
        memberSince: profiles[userId]?.memberSince || new Date().toISOString(),
      },
    };
    saveProfiles(updated);
    return updated[userId];
  };

  const addReview = (review) => {
    const newReview = {
      id: Date.now().toString(),
      ...review,
      createdAt: new Date().toISOString(),
    };
    const updated = [...reviews, newReview];
    saveReviews(updated);

    // Update profile rating
    const profile = getProfile(review.revieweeId);
    if (profile) {
      const userReviews = updated.filter((r) => r.revieweeId === review.revieweeId);
      const avgRating =
        userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      createOrUpdateProfile(review.revieweeId, {
        rating: avgRating,
        reviewCount: userReviews.length,
      });
    }

    return newReview;
  };

  const getReviewsForUser = (userId) => {
    return reviews.filter((r) => r.revieweeId === userId);
  };

  const getUserStats = (userId) => {
    const profile = getProfile(userId);
    const userReviews = getReviewsForUser(userId);
    
    return {
      rating: profile?.rating || 0,
      reviewCount: userReviews.length,
      itemsPosted: profile?.itemsPosted || 0,
      itemsFound: profile?.itemsFound || 0,
      verified: profile?.verified || false,
      memberSince: profile?.memberSince || new Date().toISOString(),
    };
  };

  return (
    <UserProfileContext.Provider
      value={{
        profiles,
        reviews,
        getProfile,
        createOrUpdateProfile,
        addReview,
        getReviewsForUser,
        getUserStats,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

