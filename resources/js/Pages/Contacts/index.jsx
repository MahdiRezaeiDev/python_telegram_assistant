import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function index({ contacts }) {
    const loadContacts = async () => {
        const res = await axios.post(route('contacts.get'));

        console.log(res);
    };

    console.log(contacts);

    return (
        <AuthenticatedLayout title="لیست مخاطبین">
            <Head title="لیست مخاطبین" />

            <div className="flex flex-wrap pt-8">
                <div className="mb-12 w-full px-4">
                    <div className="relative flex w-full min-w-0 flex-col overflow-auto break-words rounded pb-8 shadow-lg">
                        {/* Header */}
                        <div className="mb-0 flex items-center justify-between rounded-t border-0 px-4 py-3">
                            <h3 className="text-blueGray-700 text-lg font-semibold">
                                لیست پرسنل ثبت شده
                            </h3>
                            <PrimaryButton
                                onClick={loadContacts}
                                className="rounded bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:shadow-md"
                            >
                                بارگیری مخاطبین
                            </PrimaryButton>
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
                                            نام کاربری
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            پروفایل
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            شناسه یکتا
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm">
                                            عملیات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.data.length ? (
                                        contacts.data.map((contact, index) => (
                                            <tr
                                                key={contact.id}
                                                className="odd:bg-gray-50"
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
                                                    {contact.username || '-'}
                                                </td>

                                                {/* ✅ Profile photo */}
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
                                                    {contact.api_bot_id || '-'}
                                                </td>
                                                <td className="whitespace-nowrap p-4 px-6 text-sm">
                                                    {/* Action buttons can go here */}
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
                        {/* Pagination */}
                        {contacts.links.length > 3 && (
                            <div className="mt-4 flex justify-center">
                                {contacts.links.map((link, idx) => {
                                    let label = link.label;

                                    // Convert pagination text to Persian
                                    if (label.includes('Next')) label = 'بعدی';
                                    else if (label.includes('Previous'))
                                        label = 'قبلی';

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            className={`mx-1 rounded px-3 py-1 text-sm ${
                                                link.active
                                                    ? 'bg-teal-700 text-white'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {/* <Modal show={confirmingStaffDeletion} onClose={closeModal}>
                <form onSubmit={deleteStaff} className="p-6">
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
            </Modal> */}

            {/* Success Toast */}
            {/* <Transition
                show={show}
                enter="transition ease-in-out duration-300"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-500"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                className="fixed bottom-6 left-6 z-50"
            >
                <div className="rounded bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                    {flash.success}
                </div>
            </Transition> */}
        </AuthenticatedLayout>
    );
}
