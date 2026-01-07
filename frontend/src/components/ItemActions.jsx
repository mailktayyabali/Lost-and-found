import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClaimModal from "./modals/ClaimModal";
import { claimsApi } from "../services/claimsApi";

function ItemActions({ status, itemId, postedBy }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFound = status === "FOUND";

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);

  useEffect(() => {
    // Check if current user has already claimed this item
    const checkClaimStatus = async () => {
      if (user && itemId) {
        try {
          const response = await claimsApi.getMyClaims();
          if (response.success) {
            const myClaim = response.data.claims.find(c => (c.itemId && c.itemId._id === itemId) || c.itemId === itemId);
            if (myClaim) {
              setHasClaimed(true);
              setClaimStatus(myClaim.status);
            }
          }
        } catch (error) {
          console.error("Failed to check claim status", error);
        }
      }
    };
    checkClaimStatus();
  }, [user, itemId]);

  const handleClaimHelpers = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Open modal
    setShowClaimModal(true);
  };

  const handleMessage = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const posterId = postedBy?._id || postedBy?.id || postedBy;

    if (!posterId || (typeof posterId === 'object' && !posterId.email && !posterId._id)) {
      console.error("ItemActions: Invalid posterId", postedBy);
      alert("Unable to start conversation. User information not available.");
      return;
    }

    // posterId might be the object if it wasn't just an ID
    const actualId = postedBy?._id || postedBy?.id || postedBy;
    navigate(`/chat/${itemId}/${actualId}`);
  };

  const onClaimSuccess = () => {
    setHasClaimed(true);
    setClaimStatus('pending');
    alert("Claim request submitted! The poster will review it.");
  };

  return (
    <div className="flex flex-col gap-3">
      {hasClaimed ? (
        <div className={`p-4 rounded-xl text-center font-bold border ${claimStatus === 'approved' ? 'bg-green-50 border-green-200 text-green-700' :
          claimStatus === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
          {claimStatus === 'approved' ? 'Claim Approved!' :
            claimStatus === 'rejected' ? 'Claim Rejected' :
              'Claim Pending Review'}
        </div>
      ) : (
        <button
          onClick={handleClaimHelpers}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b90d] to-[#ffca28] px-6 py-4 text-[#1c180d] font-bold shadow-md shadow-[#f2b90d]/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f2b90d]/30 active:translate-y-0 text-lg"
        >
          <span className="material-symbols-outlined">back_hand</span>
          {isFound ? "Claim This Item" : "I Found This"}
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleMessage}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#212121] font-semibold transition-colors hover:bg-gray-50 hover:border-gray-300"
        >
          <span className="material-symbols-outlined text-gray-500">chat</span>
          Message
        </button>

      </div>

      {showClaimModal && (
        <ClaimModal
          itemId={itemId}
          onClose={() => setShowClaimModal(false)}
          onSuccess={onClaimSuccess}
        />
      )}
    </div>
  );
}

export default ItemActions;

