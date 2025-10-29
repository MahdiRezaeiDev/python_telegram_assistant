import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

function MembersModal({ open, onClose, group, members }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={onClose}
            ></div>
            <div className="z-60 max-h-[80vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        {group?.title || group}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-3">
                    {members.length === 0 && (
                        <p className="text-sm text-gray-600">
                            No members found.
                        </p>
                    )}
                    {members.map((m) => (
                        <div
                            key={m.id}
                            className="flex items-center gap-3 rounded border p-2"
                        >
                            <img
                                src={
                                    m.photo_path
                                        ? `/api/telegram/downloads/${m.phone?.replace('+', '') || 'unknown'}/${(group.username || group.title || group).replace('/', '_')}/${`user_${m.id}.jpg`}`
                                        : 'https://via.placeholder.com/48?text=No'
                                }
                                alt={m.username || m.first_name}
                                className="h-12 w-12 rounded-full object-cover"
                                onError={(e) =>
                                    (e.currentTarget.src =
                                        'https://via.placeholder.com/48?text=No')
                                }
                            />
                            <div>
                                <div className="font-medium">
                                    {m.first_name || '—'} {m.last_name || ''}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {m.username
                                        ? `@${m.username}`
                                        : m.phone || '—'}
                                </div>
                                {m.error && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {m.error}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function MyGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);

    const phone = localStorage.getItem('telegram_phone');

    useEffect(() => {
        fetchGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(route('getMyGroups'), { phone });
            setGroups(res.data.groups || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load groups');
        } finally {
            setLoading(false);
        }
    };

    const openGroup = async (group) => {
        setSelectedGroup(group);
        setMembers([]);
        setMembersLoading(true);
        try {
            // request members; adjust payload according to your backend API
            const res = await axios.post(route('getMyGroups'), {
                phone,
                group: group.username || group.title || group.id,
                limit: 200, // optional
            });
            setMembers(res.data.members || []);
        } catch (err) {
            setMembers([
                {
                    id: 'error',
                    first_name: 'Error',
                    error:
                        err.response?.data?.error || 'Failed to fetch members',
                },
            ]);
        } finally {
            setMembersLoading(false);
        }
    };

    return (
        <AuthenticatedLayout title="گروه های شما">
            <Head title="گروه های شما" />
            <div className="mx-auto mt-12 max-w-4xl rounded bg-white p-6 shadow">
                <h1 className="mb-4 text-2xl font-bold">
                    گروه‌هایی که عضو هستید
                </h1>

                <div className="mb-4 flex items-center gap-2">
                    <button
                        onClick={fetchGroups}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>

                    <div className="text-sm text-gray-600">
                        شماره:{' '}
                        <span className="font-medium">{phone || '—'}</span>
                    </div>
                </div>

                {error && <div className="mb-4 text-red-600">{error}</div>}

                {!loading && groups.length === 0 && (
                    <p className="text-gray-500">هیچ گروهی یافت نشد.</p>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {groups.map((g) => (
                        <div
                            key={g.id}
                            className="flex flex-col justify-between rounded border p-4"
                        >
                            <div>
                                <div className="text-lg font-semibold">
                                    {g.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {g.username
                                        ? `@${g.username}`
                                        : `id: ${g.id}`}
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                                    onClick={() => openGroup(g)}
                                >
                                    View members
                                </button>

                                <button
                                    className="rounded bg-gray-200 px-3 py-1 text-gray-800"
                                    onClick={() => {
                                        // optional: navigate to group page or copy username
                                        const text = g.username || g.id;
                                        navigator.clipboard?.writeText(text);
                                        alert('Copied: ' + text);
                                    }}
                                >
                                    Copy id/username
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* members modal */}
                <MembersModal
                    open={!!selectedGroup}
                    onClose={() => {
                        setSelectedGroup(null);
                        setMembers([]);
                    }}
                    group={selectedGroup}
                    members={membersLoading ? [] : members}
                />

                {/* simple loader for members */}
                {membersLoading && (
                    <div className="fixed bottom-6 right-6 rounded bg-white p-3 shadow">
                        Loading members...
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
