import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../data/posts";
import ChatWindow from "../components/ChatWindow";
import { ArrowLeft } from "lucide-react";

function Chat() {
  const { itemId, userId } = useParams();
  const navigate = useNavigate();
  const post = getPostById(itemId);

  if (!post) {
    return (
      <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-navy mb-4">Item not found</h2>
          <button
            onClick={() => navigate("/messages")}
            className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal-dark transition"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/messages")}
          className="flex items-center gap-2 text-slate hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Messages</span>
        </button>

        {/* Chat Window */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
          <ChatWindow
            itemId={itemId}
            otherUserId={userId}
            itemTitle={post.title}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;

