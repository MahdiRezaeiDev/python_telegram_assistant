import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function SellersView({ sellers: initialSellers = [] }) {
    const [sellers, setSellers] = useState(initialSellers);
    const [sellerViews, setSellerViews] = useState(
        initialSellers.reduce(
            (acc, seller) => ({ ...acc, [seller.id]: seller.view }),
            {},
        ),
    );
    const [loadingViews, setLoadingViews] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingSeller, setEditingSeller] = useState(null);
    const [formData, setFormData] = useState({ full_name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    // --- Delete modal ---
    const [deleteTarget, setDeleteTarget] = useState(null);

    // --- Toggle seller view ---
    const toggleView = async (sellerId) => {
        const newValue = !sellerViews[sellerId];
        setSellerViews((prev) => ({ ...prev, [sellerId]: newValue }));
        setLoadingViews((prev) => ({ ...prev, [sellerId]: true }));

        try {
            const response = await axios.post(
                route('sellers.toggleView', sellerId),
                { view: newValue },
            );
            const updatedSeller = response.data.updatedSeller;

            if (updatedSeller) {
                setSellers((prev) =>
                    prev.map((s) => (s.id === sellerId ? updatedSeller : s)),
                );
            }

            toast.success('وضعیت نمایش فروشنده تغییر یافت', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
        } catch (error) {
            console.error(error);
            setSellerViews((prev) => ({ ...prev, [sellerId]: !newValue }));
            toast.error('خطا در تغییر وضعیت فروشنده!', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
        } finally {
            setLoadingViews((prev) => ({ ...prev, [sellerId]: false }));
        }
    };

    // --- Open/close modal ---
    const openModal = (seller = null) => {
        setEditingSeller(seller);
        setFormData(
            seller
                ? { full_name: seller.full_name, phone: seller.phone }
                : { full_name: '', phone: '' },
        );
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    // --- Save (create/update) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (editingSeller) {
                response = await axios.post(
                    route('sellers.update', editingSeller.id),
                    { ...formData, _method: 'PUT' },
                );
            } else {
                response = await axios.post(route('sellers.store'), formData);
            }

            const data = response.data;
            const updatedSeller = data.updatedSeller || data.newSeller;

            setSellers((prev) =>
                editingSeller
                    ? prev.map((s) =>
                          s.id === editingSeller.id ? updatedSeller : s,
                      )
                    : [...prev, updatedSeller],
            );

            setSellerViews((prev) => ({
                ...prev,
                [updatedSeller.id]: updatedSeller.view,
            }));

            toast.success(data.message, {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error('خطا در ذخیره فروشنده!', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Delete seller ---
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await axios.delete(route('sellers.destroy', deleteTarget.id));
            setSellers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
            setDeleteTarget(null);

            toast.success('فروشنده با موفقیت حذف شد', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
        } catch (err) {
            console.error(err);
            toast.error('خطا در حذف فروشنده!', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                    fontFamily: 'Vazir',
                },
            });
        }
    };

    return (
        <AuthenticatedLayout title="لیست فروشنده‌ها">
            <Head title="مدیریت فروشنده‌ها" />
            <Toaster richColors />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        مدیریت فروشنده‌ها
                    </h1>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 rounded bg-cyan-700 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-cyan-900"
                    >
                        افزودن فروشنده جدید
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded border border-gray-200 p-1 shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-cyan-700 text-white">
                            <tr>
                                <th className="px-4 py-3 text-right font-semibold">
                                    نام فروشنده
                                </th>
                                <th className="px-4 py-3 text-right font-semibold">
                                    شماره تماس
                                </th>
                                <th className="px-4 py-3 text-center font-semibold">
                                    نمایش
                                </th>
                                <th className="px-4 py-3 text-center font-semibold">
                                    عملیات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sellers.length > 0 ? (
                                sellers.map((seller) => (
                                    <tr
                                        key={seller.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 text-gray-800">
                                            {seller.full_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">
                                            {seller.phone}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {loadingViews[seller.id] ? (
                                                <Loader2 className="mx-auto h-5 w-5 animate-spin text-blue-600" />
                                            ) : (
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        sellerViews[
                                                            seller.id
                                                        ] || false
                                                    }
                                                    onChange={() =>
                                                        toggleView(seller.id)
                                                    }
                                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            )}
                                        </td>
                                        <td className="mx-auto space-x-2 space-x-reverse px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(seller)
                                                    }
                                                    className="flex items-center gap-1 rounded bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
                                                >
                                                    <Edit size={14} /> ویرایش
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(seller)
                                                    }
                                                    className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                >
                                                    <Trash2 size={14} /> حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-4 text-center text-gray-500"
                                    >
                                        هیچ فروشنده‌ای یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="animate-fadeIn mx-3 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingSeller
                                    ? 'ویرایش فروشنده'
                                    : 'ایجاد فروشنده جدید'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-xl font-bold leading-none text-gray-500 hover:text-red-600"
                            >
                                ×
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-gray-700">
                                            نام فروشنده
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    full_name: e.target.value,
                                                })
                                            }
                                            placeholder="مثلاً: علی رضایی"
                                            className="rounded-md border border-gray-300 px-3 py-2 text-right outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 text-sm font-medium text-gray-700">
                                            شماره تماس
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            placeholder="مثلاً: 09123456789"
                                            className="rounded-md border border-gray-300 px-3 py-2 text-right outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-400"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-center justify-end gap-4 lg:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="rounded-md bg-sky-600 px-5 py-2 font-semibold text-white transition-all hover:bg-sky-700 disabled:opacity-60"
                                        >
                                            {loading
                                                ? 'در حال ذخیره...'
                                                : 'ذخیره'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-md bg-gray-300 px-5 py-2 transition-all hover:bg-gray-400"
                                        >
                                            لغو
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="animate-fadeIn mx-3 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="mb-2 text-center text-lg font-bold text-gray-800">
                            حذف فروشنده
                        </h2>
                        <p className="mb-6 text-center text-sm text-gray-600">
                            آیا از حذف فروشنده{' '}
                            <span className="font-semibold text-red-600">
                                {deleteTarget.full_name}
                            </span>{' '}
                            مطمئن هستید؟
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                            >
                                انصراف
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                حذف کن
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
