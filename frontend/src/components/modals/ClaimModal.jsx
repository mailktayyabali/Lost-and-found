import { useState } from 'react';
import { claimsApi } from '../../services/claimsApi';

export default function ClaimModal({ itemId, onClose, onSuccess }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await claimsApi.createClaim({ itemId, message });
            if (response.success) {
                onSuccess(response.data);
                onClose();
            } else {
                setError(response.message || 'Failed to submit claim');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-scale-up">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Claim Item</h3>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Message to Poster (Optional)
                        </label>
                        <textarea
                            className="w-full rounded-xl border border-gray-300 p-3 focus:border-[#f2b90d] focus:outline-none focus:ring-1 focus:ring-[#f2b90d]"
                            rows="4"
                            placeholder="Describe the item or provide proof of ownership..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500">
                            The poster will review your claim request.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-200 bg-white py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-[#f2b90d] py-3 font-bold text-[#1c180d] transition-all hover:bg-[#e0ab0b] disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Claim'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
