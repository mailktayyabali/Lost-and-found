import api from './api';

export const claimsApi = {
  // Create a new claim
  createClaim: async (data) => {
    const response = await api.post('/claims', data);
    return response;
  },

  // Get claims for a specific item (for the poster)
  getClaimsByItem: async (itemId) => {
    const response = await api.get(`/claims/item/${itemId}`);
    return response;
  },

  // Get my claims
  getMyClaims: async () => {
    const response = await api.get('/claims/my-claims');
    return response;
  },

  // Get received claims (claims on my items)
  getClaimsReceived: async () => {
      const response = await api.get('/claims/received');
      return response;
  },

  // Approve or Reject a claim
  updateClaimStatus: async (claimId, status) => {
    const response = await api.patch(`/claims/${claimId}/status`, { status });
    return response;
  },
};
