import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
        <DashboardHeader />

        <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy">Admin Overview</h1>
            <p className="text-slate text-sm">Welcome back, Admin</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value="1,245" 
            subtitle="+45 this month"
            icon={<i className="fa-solid fa-users text-2xl"></i>}
            type="info"
          />
           <StatCard 
            title="Active Reports" 
            value="43" 
            subtitle="Needs review"
            icon={<i className="fa-solid fa-clipboard-list text-2xl"></i>}
            type="lost"
          />
          <StatCard 
            title="Resolved Cases" 
            value="892" 
            subtitle="All time"
            icon={<i className="fa-solid fa-check-double text-2xl"></i>}
            type="found"
          />
          <StatCard 
            title="System Status" 
            value="98%" 
            subtitle="Uptime"
            icon={<i className="fa-solid fa-server text-2xl"></i>}
            type="claim"
          />
        </div>

        {/* Admin Actions / Recent Logins Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-navy">Recent System Activity</h2>
                <button className="text-sm text-teal font-medium hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                            <th className="py-3 font-medium pl-2">User</th>
                            <th className="py-3 font-medium">Action</th>
                            <th className="py-3 font-medium">Time</th>
                            <th className="py-3 font-medium text-right pr-2">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                            <td className="py-3 font-medium text-navy pl-2 group-hover:text-teal transition-colors">user@example.com</td>
                            <td className="py-3 text-slate">Reported Item #1234</td>
                            <td className="py-3 text-slate">2 mins ago</td>
                            <td className="py-3 text-right pr-2"><span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Pending</span></td>
                        </tr>
                         <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                            <td className="py-3 font-medium text-navy pl-2 group-hover:text-teal transition-colors">john@doe.com</td>
                            <td className="py-3 text-slate">Claimed Item #9876</td>
                            <td className="py-3 text-slate">15 mins ago</td>
                             <td className="py-3 text-right pr-2"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Approved</span></td>
                        </tr>
                         <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors group">
                            <td className="py-3 font-medium text-navy pl-2 group-hover:text-teal transition-colors">sarah@smith.com</td>
                            <td className="py-3 text-slate">New Registration</td>
                            <td className="py-3 text-slate">1 hour ago</td>
                             <td className="py-3 text-right pr-2"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Active</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
