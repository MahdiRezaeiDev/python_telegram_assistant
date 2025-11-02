import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ contacts }) {
    const [contactList, setContactList] = useState(contacts || []);
    const [search, setSearch] = useState('');

    const loadContacts = async () => {
        try {
            const res = await axios.post(route('contacts.get'));
            if (res.data?.data) {
                setContactList(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleBlock = async (contactId) => {
        try {
            const res = await axios.post(route('contacts.toggleBlock'), {
                contact_id: contactId,
            });

            const updated = contactList.map((c) =>
                c.id === contactId ? { ...c, is_blocked: res.data.blocked } : c,
            );
            setContactList(updated);
        } catch (error) {
            console.error('Error toggling block:', error);
        }
    };

    // ✅ Filtered contacts based on search
    const filteredContacts = useMemo(() => {
        return contactList.filter(
            (c) =>
                (c.full_name || '')
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (c.username || '')
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (c.phone || '').includes(search),
        );
    }, [contactList, search]);

    return (
        <AuthenticatedLayout title="لیست مخاطبین">
            <Head title="لیست مخاطبین" />

            <div className="flex flex-wrap pt-8">
                <div className="mb-12 w-full px-4">
                    <div className="relative flex w-full min-w-0 flex-col overflow-auto break-words rounded pb-8 shadow-lg">
                        {/* Header */}
                        <div className="mb-0 flex items-baseline justify-between rounded-t border-0 px-4 py-3">
                            <h3 className="text-blueGray-700 text-lg font-semibold">
                                لیست پرسنل ثبت شده
                            </h3>
                            <div className="relative w-96">
                                {/* Search input */}
                                <input
                                    type="text"
                                    placeholder="جستجو بر اساس نام، شماره یا نام کاربری..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-cyan-400"
                                />
                                <Search className="absolute left-2 top-2 h-4 w-4" />
                            </div>
                            <PrimaryButton
                                onClick={loadContacts}
                                className="rounded bg-cyan-700 px-4 py-2 text-xs font-bold text-white hover:shadow-md"
                            >
                                بارگیری مخاطبین
                            </PrimaryButton>
                        </div>

                        {/* Table */}
                        <div className="relative w-full overflow-x-auto overflow-y-visible rounded-b">
                            <table className="min-w-full border-collapse bg-transparent text-right">
                                <thead>
                                    <tr className="bg-cyan-700 text-white">
                                        <th className="px-6 py-3 text-right text-sm">
                                            #
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            نام و نام خانوادگی
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            شماره تماس
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            نام کاربری
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            پروفایل
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            شناسه یکتا
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            بلاک
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredContacts.length ? (
                                        filteredContacts.map(
                                            (contact, index) => (
                                                <tr
                                                    key={contact.id}
                                                    className={`odd:bg-gray-50 ${contact.is_blocked ? 'bg-red-50' : ''}`}
                                                >
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {++index}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {contact.full_name}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {contact.phone || '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {contact.username ||
                                                            '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {contact.profile_photo_path ? (
                                                            <img
                                                                src={
                                                                    'http://127.0.0.1:5000/' +
                                                                    contact.profile_photo_path
                                                                }
                                                                alt={
                                                                    contact.full_name
                                                                }
                                                                className="h-10 w-10 rounded-full border object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                بدون عکس
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                        {contact.api_bot_id ||
                                                            '-'}
                                                    </td>
                                                    <td className="whitespace-nowrap p-4 px-6 text-center text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                contact.is_blocked
                                                            }
                                                            onChange={() =>
                                                                toggleBlock(
                                                                    contact.id,
                                                                )
                                                            }
                                                            className="h-5 w-5 cursor-pointer accent-red-600"
                                                        />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="p-4 text-center text-sm"
                                            >
                                                هیچ پرسنلی یافت نشد.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
