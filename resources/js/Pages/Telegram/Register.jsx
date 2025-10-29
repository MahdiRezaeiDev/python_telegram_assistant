import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const [phone, setPhone] = useState('+93728550025');
    const [apiId, setApiId] = useState('28143353');
    const [apiHash, setApiHash] = useState('e8a1d1e5589b927d470ef6dfa5d5b667');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const res = await axios.post(route('registerAccount'), {
            phone,
            api_id: apiId,
            api_hash: apiHash,
        });

        if (res.data.message) {
            setMessage(res.data.message);
            localStorage.setItem('telegram_phone', phone);
            router.visit(route('verifyPage'));
        } else {
            setMessage(res.data.error || 'Error occurred');
        }

        setLoading(false);
    };

    return (
        <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-4 text-xl font-bold">Telegram Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Phone"
                    className="mb-2 w-full border p-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="API ID"
                    className="mb-2 w-full border p-2"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="API Hash"
                    className="mb-4 w-full border p-2"
                    value={apiHash}
                    onChange={(e) => setApiHash(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full rounded bg-blue-500 px-4 py-2 text-white"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
