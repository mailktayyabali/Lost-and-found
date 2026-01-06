import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi"; // Ensure this path is correct
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from "recharts";
import StatCard from "../../components/StatCard"; // Reusing existing component
import { Users, Package, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await adminApi.getDashboardStats();
            if (response.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Failed to load admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-teal"></i>
            </div>
        );
    }

    // Prepare chart data defaults if missing
    const signupData = stats?.chartData?.dailySignups || [];
    const itemData = stats?.chartData?.dailyItems || [];

    // Merge for main chart if needed, or display separate
    // For simplicity, let's visualize daily trend

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, here's what's happening today.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.users?.total || 0}
                    subtitle={`${stats?.users?.new || 0} new this month`}
                    icon={<Users size={24} />}
                    type="info"
                />
                <StatCard
                    title="Active Items"
                    value={stats?.items?.active || 0}
                    subtitle={`${stats?.items?.new || 0} new this month`}
                    icon={<Package size={24} />}
                    type="lost"
                />
                <StatCard
                    title="Pending Reports"
                    value={stats?.flags?.pending || 0}
                    subtitle="Requires attention"
                    icon={<AlertTriangle size={24} />}
                    type="found" // Reusing colors
                />
                <StatCard
                    title="Resolved Cases"
                    value={stats?.items?.resolved || 0}
                    subtitle="All time success"
                    icon={<CheckCircle size={24} />}
                    type="claim"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">User Growth (Last 30 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={signupData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" hide />
                                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Item Activity Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Item Activity (Last 30 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={itemData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" hide />
                                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Activity could go here */}
        </div>
    );
}
