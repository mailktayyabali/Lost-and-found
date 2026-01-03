import { useState, useEffect } from "react";
import { claimsApi } from "../services/claimsApi";

export default function ClaimManagement({ itemId }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchClaims();
    }, [itemId]);

    const fetchClaims = async () => {
        try {
            const response = await claimsApi.getClaimsByItem(itemId);
            if (response.success) {
                setClaims(response.data.claims);
            }
        } catch (error) {
            console.error("Failed to fetch claims", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (claimId, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this claim?`)) return;

        setActionLoading(claimId);
        try {
            const response = await claimsApi.updateClaimStatus(claimId, status);
            if (response.success) {
                // Refresh claims
                fetchClaims();
                alert(`Claim ${status} successfully`);
            }
        } catch (error) {
            alert("Failed to update claim status");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading claims...</div>;

    if (claims.length === 0) return null; // Don't show if no claims

    return (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Claim Requests ({claims.length})</h3>
            <div className="flex flex-col gap-4">
                {claims.map((claim) => (
                    <div key={claim._id} className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            {claim.claimantId ? (
                                <>
                                    <img
                                        src={claim.claimantId.avatar || "https://ui-avatars.com/api/?name=" + claim.claimantId.name}
                                        alt={claim.claimantId.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{claim.claimantId.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(claim.createdAt).toLocaleDateString()}
                                            {claim.message && <span className="block mt-1 italic text-gray-600">"{claim.message}"</span>}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500 italic">User deleted</div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {claim.status === 'pending' ? (
                                <>
                                    <button
                                        onClick={() => handleAction(claim._id, 'approved')}
                                        disabled={!!actionLoading}
                                        className="rounded-lg bg-green-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(claim._id, 'rejected')}
                                        disabled={!!actionLoading}
                                        className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <span className={`rounded-lg px-3 py-1 text-sm font-semibold capitalize ${claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {claim.status}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
