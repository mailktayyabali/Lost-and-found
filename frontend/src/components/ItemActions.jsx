import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ItemActions({ status, itemId, postedBy }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFound = status === "FOUND";

  const handleMessage = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!postedBy || !postedBy.email) {
      alert("Unable to start conversation. User information not available.");
      return;
    }

    navigate(`/chat/${itemId}/${postedBy.email}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f2b90d] to-[#ffca28] px-6 py-4 text-[#1c180d] font-bold shadow-md shadow-[#f2b90d]/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#f2b90d]/30 active:translate-y-0 text-lg">
        <span className="material-symbols-outlined">back_hand</span>
        {isFound ? "Claim This Item" : "I Found This"}
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleMessage}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#212121] font-semibold transition-colors hover:bg-gray-50 hover:border-gray-300"
        >
          <span className="material-symbols-outlined text-gray-500">chat</span>
          Message
        </button>
        <button
          className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#212121] transition-colors hover:bg-gray-50 hover:border-gray-300"
          title="More Options"
        >
          <span className="material-symbols-outlined text-gray-500">more_horiz</span>
        </button>
      </div>
    </div>
  );
}

export default ItemActions;

