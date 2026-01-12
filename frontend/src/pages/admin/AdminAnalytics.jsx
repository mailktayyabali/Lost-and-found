import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import { Activity, UserPlus, Package } from "lucide-react";

export default function AdminAnalytics() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // 'all', 'users', 'items'

    useEffect(() => {
        loadActivity();
    }, [filter]);

    const loadActivity = async () => {
        setLoading(true);
        try {
            const query = { limit: 50, type: filter === 'all' ? undefined : filter };
            const response = await adminApi.getActivityLog(query);
            if (response.success) {
                setLogs(response.data.activities);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-teal" /> System Analytics
                </h2>
                <p className="text-slate-500">Monitor system activity and performance</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-4">
                {['all', 'users', 'items'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-sm font-medium capitalize px-3 py-1 rounded-md transition-colors ${filter === f ? 'bg-teal/10 text-teal' : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Activity Log List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-slate-800">Recent Activity Log</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading activity...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No recent activity found.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {logs.map((log, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-full ${log.type === 'user_registered' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {log.type === 'user_registered' ? <UserPlus size={16} /> : <Package size={16} />}
                                </div>
                                <div>
                                    <p className="text-slate-800 font-medium">
                                        {log.type === 'user_registered'
                                            ? <span>New user <b>{log.user.name}</b> joined</span>
                                            : <span>Item <b>{log.item.title}</b> posted by <b>{log.user.name}</b></span>
                                        }
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
