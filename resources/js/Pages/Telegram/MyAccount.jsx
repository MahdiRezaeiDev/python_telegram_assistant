import axios from 'axios';
import { useEffect, useState } from 'react';

export default function MyAccount() {
    const [me, setMe] = useState(null);
    const [error, setError] = useState('');
    const phone = localStorage.getItem('telegram_phone');

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.post(route('getAccountInfo'), {
                    phone,
                });
                console.log(res);

                setMe(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching info');
            }
        };
        fetchMe();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!me) return <p>Loading account info...</p>;

    return (
        <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow">
            <h1 className="mb-4 text-xl font-bold">Your Telegram Account</h1>
            <p>
                <strong>Name:</strong> {me.first_name} {me.last_name || ''}
            </p>
            <p>
                <strong>Username:</strong> @{me.username || '—'}
            </p>
            <p>
                <strong>Phone:</strong> {me.phone}
            </p>
        </div>
    );
}
