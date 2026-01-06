import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import AdminTable from "../../components/AdminTable";
import { Check, X, ShieldAlert } from "lucide-react";
import { getErrorMessage } from "../../utils/errorHandler";
import { Link } from "react-router-dom";

export default function AdminReports() {
    const [flags, setFlags] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("PENDING"); // PENDING, RESOLVED, DISMISSED

    useEffect(() => {
        loadFlags();
    }, [page, activeTab]);

    const loadFlags = async () => {
        setLoading(true);
        try {
            // Add timestamp to prevent caching (304 issues)
            const query = { page, limit: 10, status: activeTab, _t: Date.now() };
            const response = await adminApi.getFlags(query);

            if (response.success) {
                setFlags(response.data.flags);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (flag, newStatus, note = "") => {
        try {
            await adminApi.updateFlagStatus(flag._id, newStatus, note);
            loadFlags();
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    const columns = [
        {
            header: "Reported Object",
            key: "target",
            render: (flag) => (
                <div className="flex flex-col">
                    {flag.targetItem ? (
                        <Link to={`/item/${flag.targetItem._id}`} target="_blank" className="text-teal font-medium hover:underline flex items-center gap-1">
                            <i className="fa-solid fa-box text-xs"></i> {flag.targetItem.title}
                        </Link>
                    ) : flag.targetUser ? (
                        <span className="text-slate-800 font-medium flex items-center gap-1">
                            <i className="fa-solid fa-user text-xs"></i> {flag.targetUser.name}
                        </span>
                    ) : (
                        <span className="text-slate-400 italic">Content deleted</span>
                    )}
                    <div className="text-xs text-slate-400 mt-1">
                        Reported by: <span className="font-semibold">{flag.reporter?.name || "Unknown"}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Reason",
            key: "reason",
            render: (flag) => (
                <div className="max-w-xs">
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded border border-red-100 mb-1 inline-block">Reason</span>
                    <p className="text-sm text-slate-700 italic">"{flag.reason}"</p>
                </div>
            )
        },
        {
            header: "Date",
            key: "createdAt",
            render: (flag) => new Date(flag.createdAt).toLocaleDateString()
        }
    ];

    const Actions = (flag) => (
        <>
            {flag.status === 'PENDING' && (
                <>
                    <button
                        onClick={() => handleResolve(flag, 'DISMISSED', 'No violation found')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X size={14} /> Dismiss
                    </button>
                    <button
                        onClick={() => handleResolve(flag, 'RESOLVED', 'Action taken')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-teal hover:bg-teal-dark rounded-lg shadow-sm transition-colors"
                    >
                        <Check size={14} /> Resolve
                    </button>
                </>
            )}
            {flag.status !== 'PENDING' && (
                <span className={`text-xs font-bold uppercase ${flag.status === 'RESOLVED' ? 'text-green-600' : 'text-slate-400'
                    }`}>
                    {flag.status}
                </span>
            )}
        </>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert className="text-teal" /> Moderation Queue
                    </h2>
                    <p className="text-slate-500">Review user reports and flagged content</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                    {['PENDING', 'RESOLVED', 'DISMISSED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === status
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin text-2xl text-teal"></i></div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={flags}
                    actions={Actions}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
