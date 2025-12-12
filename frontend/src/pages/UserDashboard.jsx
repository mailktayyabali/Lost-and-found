import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import ActivityTable from "../components/ActivityTable";

export default function UserDashboard() {
  return (
    <div className="flex bg-gray-100">

      <Sidebar />

      <main className="flex-1 p-10">
        
        <DashboardHeader />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard 
            title="Total Lost Items" 
            value="4" 
            subtitle="+1 new this week"
            icon="🔍"
          />
          <StatCard 
            title="Total Found Items" 
            value="12" 
            subtitle="+3 posted this month"
            icon="✅"
          />
          <StatCard 
            title="Claimed Items" 
            value="7" 
            subtitle="Successful matches"
            icon="📦"
          />
        </div>

        <ActivityTable />
      </main>

    </div>
  );
}
