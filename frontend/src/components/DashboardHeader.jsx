import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleReportClick = () => {
    navigate("/report?type=lost"); 
  };

  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold">Welcome back, John! 👋</h1>
        <p className="text-gray-500 mt-1">
          Here’s what's happening with your items today.
        </p>
      </div>

      <button
  onClick={handleReportClick}
  className="px-6 py-3 text-white font-semibold rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]
             bg-[#2E5C6B] hover:bg-[#3D7A8C] transition-all duration-200"
>
  + Report Lost Item
</button>


    </div>
  );
}
