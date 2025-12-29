import { createContext, useContext, useState } from "react";
import { usersApi } from "../services/usersApi";
import { reviewsApi } from "../services/reviewsApi";

const UserProfileContext = createContext();

export const useUserProfiles = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState({});

  const getProfile = async (userId) => {
    // Return cached profile if available
    if (profiles[userId]) {
      return profiles[userId];
    }

    // Fetch from API
    if (loading[userId]) {
      return null; // Already loading
    }

    setLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await usersApi.getUserProfile(userId);
      if (response.success) {
        const profile = response.data?.user || response.data;
        setProfiles((prev) => ({
          ...prev,
          [userId]: { ...profile, id: profile.id || profile._id },
        }));
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Failed to load profile:", error);
      return null;
    } finally {
      setLoading((prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      }));
    }
  };

  const getUserStats = async (userId) => {
    try {
      const response = await usersApi.getUserStats(userId);
      if (response.success) {
        return response.data?.stats || response.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to load user stats:", error);
      return null;
    }
  };

  const getUserItems = async (userId) => {
    try {
      const response = await usersApi.getUserItems(userId);
      if (response.success) {
        return response.data?.items || response.data || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to load user items:", error);
      return [];
    }
  };

  const getReviewsForUser = async (userId) => {
    // Return cached reviews if available
    if (reviews[userId]) {
      return reviews[userId];
    }

    // Fetch from API
    if (loading[`reviews-${userId}`]) {
      return []; // Already loading
    }

    setLoading((prev) => ({ ...prev, [`reviews-${userId}`]: true }));
    try {
      const response = await reviewsApi.getUserReviews(userId);
      if (response.success) {
        const fetchedReviews = response.data?.reviews || response.data || [];
        const transformedReviews = fetchedReviews.map((review) => ({
          ...review,
          id: review.id || review._id,
          revieweeId: review.reviewee?.id || review.reviewee?._id || review.reviewee,
          reviewerId: review.reviewer?.id || review.reviewer?._id || review.reviewer,
        }));
        setReviews((prev) => ({
          ...prev,
          [userId]: transformedReviews,
        }));
        return transformedReviews;
      }
      return [];
    } catch (error) {
      console.error("Failed to load reviews:", error);
      return [];
    } finally {
      setLoading((prev => {
        const updated = { ...prev };
        delete updated[`reviews-${userId}`];
        return updated;
      }));
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profiles,
        reviews,
        getProfile,
        getUserStats,
        getUserItems,
        getReviewsForUser,
        loading,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

