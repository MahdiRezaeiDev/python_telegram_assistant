import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import moment from 'jalali-moment';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function PricesIndex({ prices: initialPrices }) {
    const [prices, setPrices] = useState(initialPrices.data);
    const [editingPrice, setEditingPrice] = useState(null);
    const [formData, setFormData] = useState({ code: '', price: '' });
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // For delete modal

    const { auth } = usePage().props;
    const user = auth.user;

    // --- Open edit modal ---
    const openEditModal = (price) => {
        setEditingPrice(price);
        setFormData({ code: price.code_name, price: price.price }); // use code_name
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    // --- Update price ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingPrice) return;
        setLoading(true);
        try {
            const response = await axios.put(
                route('prices.update', editingPrice.id),
                formData,
            );
            const updated = response.data.updatedPrice;

            setPrices((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p)),
            );

            toast.success('قیمت با موفقیت بروزرسانی شد', {
                position: 'bottom-left',
            });
            closeEditModal();
        } catch (err) {
            console.error(err);
            toast.error('خطا در بروزرسانی قیمت', { position: 'bottom-left' });
        } finally {
            setLoading(false);
        }
    };

    // --- Delete price ---
    const openDeleteModal = (price) => setDeleteTarget(price);
    const closeDeleteModal = () => setDeleteTarget(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await axios.delete(route('prices.destroy', deleteTarget.id));
            setPrices((prev) => prev.filter((p) => p.id !== deleteTarget.id));
            toast.success('قیمت حذف شد', { position: 'bottom-left' });
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error('خطا در حذف قیمت', { position: 'bottom-left' });
        }
    };

    return (
        <AuthenticatedLayout title="لیست قیمت‌ها">
            <Head title="لیست قیمت‌ها" />
            <Toaster richColors />

            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        لیست قیمت‌ها
                    </h1>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100 font-medium text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-right">#</th>
                                <th className="px-4 py-3 text-right">
                                    فروشنده
                                </th>
                                <th className="px-4 py-3 text-right">
                                    کد فنی قطعه
                                </th>
                                <th className="px-4 py-3 text-right">قیمت</th>
                                <th className="px-4 py-3 text-right">زمان</th>
                                <th className="px-4 py-3 text-right">کاربر</th>
                                <th className="px-4 py-3 text-center">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {prices.length > 0 ? (
                                prices.map((price, index) => (
                                    <tr
                                        key={price.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {(initialPrices.current_page - 1) *
                                                initialPrices.per_page +
                                                (index + 1)}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {price.seller.full_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {price.code_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {price.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {moment(price.created_at).format(
                                                'jYYYY/jMM/jDD HH:mm',
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {user.name}
                                        </td>
                                        <td className="flex justify-center gap-2 px-4 py-3 text-center">
                                            <button
                                                onClick={() =>
                                                    openEditModal(price)
                                                }
                                                className="text-yellow-500 hover:text-yellow-600"
                                                title="ویرایش"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(price)
                                                }
                                                className="text-red-600 hover:text-red-700"
                                                title="حذف"
                                            >
                                                <Trash className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="py-4 text-center text-gray-500"
                                    >
                                        هیچ قیمتی یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {initialPrices.links.length > 3 && (
                        <div className="my-4 flex justify-center">
                            {initialPrices.links.map((link, idx) => {
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
                                                ? 'bg-cyan-700 text-white'
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

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="animate-fadeIn w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h2 className="mb-4 text-xl font-bold text-gray-800">
                                ویرایش قیمت
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        کد فنی قطعه
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        قیمت
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="mt-4 flex justify-start gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
                                    >
                                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                    >
                                        لغو
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="animate-fadeIn w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <h2 className="mb-4 text-lg font-bold text-gray-800">
                                حذف قیمت
                            </h2>
                            <p className="mb-4 text-gray-700">
                                آیا مطمئن هستید که می‌خواهید قیمت قطعه{' '}
                                <span className="font-medium">
                                    {deleteTarget.code_name}
                                </span>{' '}
                                را حذف کنید؟
                            </p>
                            <div className="flex justify-start gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    حذف
                                </button>
                                <button
                                    onClick={closeDeleteModal}
                                    className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                >
                                    لغو
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
