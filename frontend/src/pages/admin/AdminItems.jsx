import { useState, useEffect } from "react";
import { adminApi } from "../../services/adminApi";
import AdminTable from "../../components/AdminTable";
import { Search, Trash2, Eye, CheckCircle } from "lucide-react";
import { getErrorMessage } from "../../utils/errorHandler";
import { Link } from "react-router-dom";

export default function AdminItems() {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, LOST, FOUND

    useEffect(() => {
        loadItems();
    }, [page, searchTerm, filterStatus]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const query = { page, limit: 10 };
            if (searchTerm) query.search = searchTerm;
            if (filterStatus !== "ALL") query.status = filterStatus;

            const response = await adminApi.getAllItems(query);

            if (response.success) {
                setItems(response.data.items);
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

    const handleDeleteItem = async (item) => {
        if (window.confirm(`Permanently delete "${item.title}"?`)) {
            try {
                await adminApi.deleteItem(item.id);
                loadItems();
            } catch (error) {
                alert(getErrorMessage(error));
            }
        }
    };

    const columns = [
        {
            header: "Item",
            key: "title",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <i className={`fa-solid ${item.status === 'LOST' ? 'fa-magnifying-glass' : 'fa-box'} text-slate-300`}></i>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 truncate w-48">{item.title}</p>
                        <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Type",
            key: "status",
            render: (item) => (
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase ${item.status === 'LOST'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: "Posted By",
            key: "postedBy",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <img
                        src={item.postedBy?.avatar || `https://ui-avatars.com/api/?name=${item.postedBy?.name || 'User'}&background=random`}
                        alt=""
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-slate-600 truncate w-32">{item.postedBy?.name}</span>
                </div>
            )
        },
        {
            header: "Date",
            key: "date",
            render: (item) => new Date(item.date).toLocaleDateString()
        }
    ];

    const Actions = (item) => (
        <>
            <Link
                to={`/item/${item.id}`}
                target="_blank"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                title="View Public Page"
            >
                <Eye size={18} />
            </Link>
            <button
                onClick={() => handleDeleteItem(item)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Item"
            >
                <Trash2 size={18} />
            </button>
        </>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Item Management</h2>
                    <p className="text-slate-500">Moderate lost and found listings</p>
                </div>

                <div className="flex gap-3">
                    {/* Filter Tabs */}
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        {['ALL', 'LOST', 'FOUND'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === status
                                        ? "bg-slate-800 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal/20 focus:outline-none w-56"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin text-2xl text-teal"></i></div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={items}
                    actions={Actions}
                    pagination={pagination}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
