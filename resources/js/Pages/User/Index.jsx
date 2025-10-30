import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';

export default function Index({ users }) {
    const [selectedUser, setSelectedUser] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { delete: destroy, processing, reset, errors } = useForm();

    const handleDelete = (id) => {
        setSelectedUser(id);
        setConfirmDelete(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('users.destroy', selectedUser), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => console.log(errors),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setSelectedUser(0);
        setConfirmDelete(false);
    };
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
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {++index}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.account
                                                        ? user.account.phone
                                                        : ''}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.email || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.role || '-'}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.account ? (
                                                        user.account
                                                            .profile_photo ? (
                                                            <img
                                                                src={
                                                                    'http://127.0.0.1:5000/' +
                                                                    user.account
                                                                        .profile_photo
                                                                }
                                                                alt={
                                                                    user.full_name
                                                                }
                                                                className="h-8 w-8 rounded-full border object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                بدون عکس
                                                            </span>
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-sm">
                                                    {user.account
                                                        ? user.account.api_id
                                                        : ''}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-2 text-center text-sm">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                'users.edit',
                                                                user.id,
                                                            )}
                                                            className="text-sky-700"
                                                            title="ویرایش"
                                                        >
                                                            <Edit className="h-5 w-5 cursor-pointer" />
                                                        </Link>
                                                        <Trash
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="h-5 w-5 cursor-pointer text-rose-800"
                                                        />
                                                    </div>
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
            {/* Delete Modal */}
            <Modal show={confirmDelete} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        آیا مطمئن هستید که می‌خواهید این پرسنل را حذف کنید؟
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        بعد از حذف پرسنل، اطلاعات مرتبط با آن دیگر در دسترس
                        نخواهد بود.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            انصراف
                        </SecondaryButton>
                        <DangerButton className="ms-3" disabled={processing}>
                            حذف
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
