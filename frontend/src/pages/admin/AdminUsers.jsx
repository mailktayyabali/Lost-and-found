import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import AdminTable from "../../components/AdminTable";
import { Search, Ban, CheckCircle, Trash2 } from "lucide-react";
import { getErrorMessage } from "../../utils/errorHandler";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");

    useEffect(() => {
        loadUsers();
    }, [page, searchTerm]); // Debounce search in real app

    const loadUsers = async () => {
        setLoading(true);
        try {
            const query = { page, limit: 10 };
            if (searchTerm) query.search = searchTerm;

            const response = await adminApi.getAllUsers(query); // We need to ensure adminApi assumes query params
            // Assuming adminApi.getAllUsers supports query object or string logic. 
            // Current adminApi service method might need update to accept params object

            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const openBanModal = (user) => {
        setSelectedUser(user);
        setBanReason("");
        setIsBanModalOpen(true);
    };

    const handleBanUser = async () => {
        if (!selectedUser) return;
        try {
            await adminApi.banUser(selectedUser.id, banReason);
            setIsBanModalOpen(false);
            loadUsers(); // Refresh
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    const handleUnbanUser = async (user) => {
        if (window.confirm(`Unban ${user.name}?`)) {
            try {
                await adminApi.unbanUser(user.id);
                loadUsers();
            } catch (error) {
                alert(getErrorMessage(error));
            }
        }
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)) {
            try {
                await adminApi.deleteUser(user.id);
                loadUsers();
            } catch (error) {
                alert(getErrorMessage(error));
            }
        }
    };

    const columns = [
        {
            header: "User",
            key: "name",
            render: (user) => (
                <div className="flex items-center gap-3">
                    <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            key: "status",
            render: (user) => (
                user.isBanned ? (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">
                        Banned
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase">
                        Active
                    </span>
                )
            )
        },
        {
            header: "Joined",
            key: "createdAt",
            render: (user) => new Date(user.createdAt).toLocaleDateString()
        }
    ];

    const Actions = (user) => (
        <>
            {user.role !== 'admin' && (
                <>
                    {user.isBanned ? (
                        <button
                            onClick={() => handleUnbanUser(user)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip"
                            title="Unban User"
                        >
                            <CheckCircle size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => openBanModal(user)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="Ban User"
                        >
                            <Ban size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                    >
                        <Trash2 size={18} />
                    </button>
                </>
            )}
        </>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500">View and moderate registered users</p>
                </div>
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal/20 focus:outline-none w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin text-2xl text-teal"></i></div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={users}
                    actions={Actions}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            )}

            {/* Ban Modal */}
            {isBanModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Ban User: {selectedUser?.name}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Reason for Ban</label>
                            <textarea
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-red-200 focus:outline-none"
                                placeholder="Explain why this user is being banned..."
                            ></textarea>
                            <p className="text-xs text-slate-400 mt-1">This will be visible to other admins.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsBanModalOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBanUser}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md shadow-red-200"
                            >
                                Confirm Ban
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
