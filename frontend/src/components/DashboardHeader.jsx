import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report?type=lost"); 
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, John! <span className="inline-block">👋</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Here's what's happening with your items today.
        </p>
      </div>

      <button
        onClick={handleReportClick}
        className="w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl
                   bg-[#2E5C6B] hover:bg-[#3D7A8C] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-plus"></i>
        Report Lost Item
      </button>
    </div>
  );
}
