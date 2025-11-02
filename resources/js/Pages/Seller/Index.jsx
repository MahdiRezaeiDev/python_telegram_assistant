import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
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

    const [showModal, setShowModal] = useState(false);

    // Toggle seller view
    const toggleView = async (sellerId) => {
        const newValue = !sellerViews[sellerId];
        setSellerViews((prev) => ({ ...prev, [sellerId]: newValue }));

        try {
            await axios.post(route('sellers.toggleView', sellerId), {
                view: newValue,
            });
            toast.success('وضعیت نمایش فروشنده با موفقیت تغییر یافت', {
                position: 'bottom-left',
            });
        } catch (err) {
            console.error(err);
            setSellerViews((prev) => ({ ...prev, [sellerId]: !newValue }));
            toast.error('خطا در تغییر وضعیت نمایش فروشنده!', {
                position: 'bottom-left',
            });
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        seller_name: '',
        phone: '',
    });

    const closeModal = () => {
        setShowModal(false);
    };

    const createSeller = (e) => {
        e.preventDefault();
        post(route('sellers.store'), {
            onSuccess: () => {
                alert('done');
            },
        });
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
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
                    >
                        افزودن فروشنده جدید
                    </button>
                </div>

                {/* Sellers Table */}
                <div className="overflow-x-auto rounded border border-gray-200 p-1 shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gradient-to-r from-cyan-700 to-blue-700 text-white">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sellers.map((seller) => (
                                <tr
                                    key={seller.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-gray-800">
                                        {seller.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        {seller.phone}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={
                                                sellerViews[seller.id] || false
                                            }
                                            onChange={() =>
                                                toggleView(seller.id)
                                            }
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Delete Modal */}
                <Modal show={showModal} onClose={closeModal}>
                    <div className="animate-fadeIn mx-3 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                ایجاد فروشنده جدید
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-xl font-bold leading-none text-gray-500 hover:text-red-600"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5">
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <form action="" onSubmit={createSeller}>
                                    <div className="flex flex-col">
                                        <InputLabel value="نام فروشنده" />
                                        <TextInput
                                            placeholder="مثلاً: علی رضایی"
                                            value={data.seller_name}
                                            onChange={(e) =>
                                                setData(
                                                    'seller_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            value={errors.seller_name}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <InputLabel value=" شماره تماس" />
                                        <TextInput
                                            placeholder="مثلاً: ۰۷۸۱۲۳۴۵۶۷"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                        />
                                        <InputError value={errors.phone} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-end gap-4 lg:col-span-2">
                                        <button
                                            disabled={processing}
                                            className="rounded-md bg-sky-600 px-5 py-2 font-semibold text-white transition-all hover:bg-sky-700"
                                        >
                                            {processing
                                                ? 'در حال ذخیره...'
                                                : 'ذخیره'}
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="rounded-md bg-gray-300 px-5 py-2 transition-all hover:bg-gray-400"
                                        >
                                            لغو
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
