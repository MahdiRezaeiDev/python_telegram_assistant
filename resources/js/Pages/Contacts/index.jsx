import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function Index({ contacts }) {
    const [contactList, setContactList] = useState(contacts || []);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [blockLoadingId, setBlockLoadingId] = useState(null);

    // 🔄 Load all contacts
    const loadContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.post(route('contacts.get'));
            if (res.data?.data) {
                setContactList(res.data.data);
                toast.success('عملیات موفقانه انجام شد.', {
                    description: 'اطلاعات مخاطبین به‌روزرسانی شد.',
                    position: 'bottom-left',
                    duration: 4000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('خطا در بارگیری مخاطبین');
        } finally {
            setLoading(false);
        }
    };

    // 🚫 Toggle block/unblock contact
    const toggleBlock = async (contactId) => {
        setBlockLoadingId(contactId);
        try {
            const res = await axios.post(route('contacts.toggleBlock'), {
                contact_id: contactId,
            });

            const updated = contactList.map((c) =>
                c.id === contactId ? { ...c, is_blocked: res.data.blocked } : c,
            );
            setContactList(updated);

            toast.success('وضعیت کاربر تغییر کرد.', {
                description: res.data.blocked
                    ? 'کاربر بلاک شد.'
                    : 'کاربر از بلاک خارج شد.',
                position: 'bottom-left',
                duration: 4000,
                style: {
                    backgroundColor: 'seagreen',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
        } catch (error) {
            console.error('Error toggling block:', error);
            toast.error('خطا در تغییر وضعیت کاربر');
        } finally {
            setBlockLoadingId(null);
        }
    };

    // 🔍 Filter contacts based on search
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
            <Toaster richColors />
            <div className="flex flex-wrap pt-8">
                <div className="mb-12 w-full px-4">
                    <div className="relative flex w-full min-w-0 flex-col overflow-auto break-words rounded bg-white pb-8 shadow-lg">
                        {/* Header */}
                        <div className="mb-0 flex items-center justify-between rounded-t border-b bg-gray-50 px-4 py-3">
                            <h3 className="text-blueGray-700 text-lg font-semibold">
                                لیست پرسنل ثبت شده
                            </h3>
                            <div className="relative w-96">
                                <input
                                    type="text"
                                    placeholder="جستجو بر اساس نام، شماره یا نام کاربری..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-cyan-400"
                                />
                                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                            </div>
                            <PrimaryButton
                                onClick={loadContacts}
                                disabled={loading}
                                className="flex items-center gap-2 rounded bg-cyan-700 px-4 py-2 text-xs font-bold text-white hover:shadow-md disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        در حال بارگیری...
                                    </>
                                ) : (
                                    'بارگیری مخاطبین'
                                )}
                            </PrimaryButton>
                        </div>

                        {/* Table */}
                        <div className="relative w-full overflow-x-auto overflow-y-visible rounded-b">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-cyan-700" />
                                    <span className="mr-3 text-gray-600">
                                        در حال بارگیری داده‌ها...
                                    </span>
                                </div>
                            ) : (
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
                                            <th className="px-6 py-3 text-center text-sm">
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
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                            {contact.full_name}
                                                        </td>
                                                        <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                            {contact.phone ||
                                                                '-'}
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
                                                            {blockLoadingId ===
                                                            contact.id ? (
                                                                <Loader2 className="mx-auto h-5 w-5 animate-spin text-cyan-700" />
                                                            ) : (
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
                                                            )}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
