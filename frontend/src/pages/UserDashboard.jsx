import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";

export default function UserDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
        <DashboardHeader />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatCard 
            title="Total Lost Items" 
            value="4" 
            subtitle="+1 new this week"
            icon={<i className="fa-solid fa-magnifying-glass text-2xl"></i>}
            type="lost"
          />
          <StatCard 
            title="Total Found Items" 
            value="12" 
            subtitle="+3 posted this month"
            icon={<i className="fa-solid fa-check-circle text-2xl"></i>}
            type="found"
          />
          <StatCard 
            title="Claimed Items" 
            value="7" 
            subtitle="Successful matches"
            icon={<i className="fa-solid fa-box text-2xl"></i>}
            type="claim"
          />
        </div>

        <ActivityTable />
      </main>
    </div>
  );
}
