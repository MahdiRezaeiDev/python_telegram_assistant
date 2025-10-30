import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Index({ users }) {
    console.log(users.data);

    const [search, setSearch] = useState('');

    return (
        <AuthenticatedLayout title="لیست مخاطبین">
            <Head title="لیست مخاطبین" />

            <div className="flex flex-wrap pt-8">
                <div className="mb-12 w-full px-4">
                    <div className="relative flex w-full min-w-0 flex-col overflow-auto break-words rounded pb-8 shadow-lg">
                        {/* Header */}
                        <div className="mb-0 flex items-baseline justify-between rounded-t border-0 px-4 py-3">
                            <h3 className="text-blueGray-700 text-lg font-semibold">
                                لیست کاربران سیستم
                            </h3>
                            <div className="relative w-96">
                                {/* Search input */}
                                <input
                                    type="text"
                                    placeholder="جستجو بر اساس نام، شماره یا نام کاربری..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded border px-4 py-2 text-xs shadow-sm focus:outline-none focus:ring focus:ring-teal-400"
                                />
                                <Search className="absolute left-2 top-2 h-4 w-4" />
                            </div>
                            <Link
                                href={route('users.create')}
                                className="rounded bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:shadow-md"
                            >
                                ثبت کاربر جدید
                            </Link>
                        </div>

                        {/* Table */}
                        <div className="relative w-full overflow-x-auto overflow-y-visible rounded-b">
                            <table className="min-w-full border-collapse bg-transparent text-right">
                                <thead>
                                    <tr className="bg-teal-700 text-white">
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
                                            ایمیل آدرس
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            نقش
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
                                    {users.data.length ? (
                                        users.data.map((user, index) => (
                                            <tr
                                                key={user.id}
                                                className="odd:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {++index}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.account.phone}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.email || '-'}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.username || '-'}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.account
                                                        .profile_photo ? (
                                                        <img
                                                            src={
                                                                'http://127.0.0.1:5000/' +
                                                                user.account
                                                                    .profile_photo
                                                            }
                                                            alt={user.full_name}
                                                            className="h-10 w-10 rounded-full border object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            بدون عکس
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {user.api_bot_id || '-'}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            user.is_blocked
                                                        }
                                                        onChange={() =>
                                                            toggleBlock(user.id)
                                                        }
                                                        className="h-5 w-5 cursor-pointer accent-red-600"
                                                    />
                                                </td>
                                            </tr>
                                        ))
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
