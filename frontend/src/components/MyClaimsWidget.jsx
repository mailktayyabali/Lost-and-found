import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsApi } from '../services/claimsApi';
import { useAuth } from '../context/AuthContext';

function MyClaimsWidget() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await claimsApi.getMyClaims();
                if (response.success) {
                    setClaims(response.data.claims || []);
                }
            } catch (error) {
                console.error('Failed to fetch my claims:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchClaims();
        }
    }, [user]);

    if (loading) return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (claims.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-4">My Claims</h3>
                <p className="text-slate text-sm">You haven't claimed any items yet.</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Rejected</span>;
            default:
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>;
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy">My Claims</h3>
                <span className="bg-teal/10 text-teal text-xs font-bold px-2 py-1 rounded-full">
                    {claims.length}
                </span>
            </div>

            <div className="space-y-4">
                {claims.slice(0, 3).map((claim) => (
                    <div
                        key={claim._id}
                        onClick={() => navigate(`/item/${claim.itemId?._id || claim.itemId}`)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {claim.itemId?.images && claim.itemId.images.length > 0 ? (
                                <img
                                    src={claim.itemId.images[0]}
                                    alt={claim.itemId.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <i className="fa-solid fa-box"></i>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-navy truncate">
                                {claim.itemId?.title || 'Unknown Item'}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-slate">
                                    {new Date(claim.createdAt).toLocaleDateString()}
                                </span>
                                {getStatusBadge(claim.status)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {claims.length > 3 && (
                <button className="w-full mt-4 text-center text-sm text-teal font-medium hover:text-teal-dark transition-colors">
                    View All Claims
                </button>
            )}
        </div>
    );
}

export default MyClaimsWidget;
