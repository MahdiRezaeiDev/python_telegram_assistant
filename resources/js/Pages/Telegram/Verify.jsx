import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Verify() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const phone = localStorage.getItem('telegram_phone');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post(route('verifyAccount'), {
                phone,
                code,
            });

            if (res.data.two_factor_required) {
                router.visit(route('passwordPage')); // فرم رمز دوم
            } else if (res.data?.message) {
                setMessage('✅ Login Successful!');
            } else {
                setMessage(res.data.error || 'Error occurred');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Error occurred');
        }

        setLoading(false);
    };

    return (
        <AuthenticatedLayout>
            <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-4 text-xl font-bold">
                    Enter Verification Code
                </h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Code"
                        className="mb-4 w-full border p-2"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        disabled={loading}
                        className="w-full rounded bg-green-500 px-4 py-2 text-white"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
                {message && (
                    <p className="mt-4 text-sm text-gray-700">{message}</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
