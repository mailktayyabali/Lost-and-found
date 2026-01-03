import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { claimsApi } from "../services/claimsApi";

export default function IncomingClaimsWidget() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const response = await claimsApi.getClaimsReceived();
            if (response.success) {
                setClaims(response.data.claims);
            }
        } catch (error) {
            console.error("Failed to fetch received claims", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || claims.length === 0) return null;

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-orange-100 bg-orange-50/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2b90d]">inbox_customize</span>
                    Incoming Claims
                </h3>
                <span className="bg-[#f2b90d] text-[#1c180d] text-xs font-bold px-2 py-1 rounded-full">
                    {claims.length} Pending
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {claims.map((claim) => (
                    <div
                        key={claim._id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/item/${claim.itemId._id || claim.itemId}`)}
                    >
                        <div className="flex items-center gap-3">
                            {claim.claimantId ? (
                                <img
                                    src={claim.claimantId.avatar || `https://ui-avatars.com/api/?name=${claim.claimantId.name}&background=random`}
                                    alt={claim.claimantId.name}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100"></div>
                            )}
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{claim.itemId ? claim.itemId.title : 'Item Unavailable'}</h4>
                                <p className="text-xs text-gray-500">
                                    Claimed by <span className="font-medium text-gray-700">{claim.claimantId ? claim.claimantId.name : 'Unknown User'}</span>
                                </p>
                            </div>
                        </div>
                        <button className="text-[#f2b90d] hover:text-[#e0ab0b] transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
