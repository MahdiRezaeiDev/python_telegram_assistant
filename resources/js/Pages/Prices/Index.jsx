import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function SellersTable({ sellers = [] }) {
    const [codes, setCodes] = useState([{ id: 1, code: '' }]);
    const [prices, setPrices] = useState(
        sellers.reduce((acc, s) => ({ ...acc, [s.id]: {} }), {}),
    );

    const addCodeColumn = () => {
        setCodes((prev) => [...prev, { id: prev.length + 1, code: '' }]);
    };

    const handleCodeChange = (index, value) => {
        const updated = [...codes];
        updated[index].code = value;
        setCodes(updated);
    };

    const handlePriceChange = (sellerId, codeId, value) => {
        setPrices((prev) => ({
            ...prev,
            [sellerId]: { ...prev[sellerId], [codeId]: value },
        }));
    };

    const submit = async () => {
        try {
            const payload = sellers.map((s) => ({
                seller_id: s.id,
                codes: codes
                    .filter((c) => prices[s.id][c.id])
                    .map((c) => ({
                        code: c.code,
                        price: prices[s.id][c.id],
                    })),
            }));

            await axios.post(route('prices.store'), { data: payload });

            toast.success('قیمت‌ها با موفقیت ذخیره شدند.', {
                position: 'bottom-left',
                duration: 4000,
            });
        } catch (err) {
            console.error(err);
            toast.error('خطا در ذخیره قیمت‌ها!', { position: 'bottom-left' });
        }
    };

    return (
        <AuthenticatedLayout title="لیست فروشنده‌ها و قیمت‌ها">
            <Head title="قیمت‌ها" />
            <Toaster richColors />
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        لیست فروشنده‌ها
                    </h1>
                    <button
                        onClick={addCodeColumn}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                    >
                        افزودن کد
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-cyan-700 text-white">
                            <tr>
                                <th className="w-64 px-4 py-3 text-right font-semibold">
                                    فروشنده
                                </th>
                                {codes.map((code) => (
                                    <th
                                        key={code.id}
                                        className="w-40 px-4 py-3 text-right"
                                    >
                                        <input
                                            type="text"
                                            placeholder="کد فنی قطعه"
                                            value={code.code}
                                            onChange={(e) =>
                                                handleCodeChange(
                                                    code.id - 1,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sellers.map((seller) => (
                                <tr
                                    key={seller.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {seller.name}
                                    </td>
                                    {codes.map((code) => (
                                        <td key={code.id} className="px-4 py-3">
                                            <input
                                                type="number"
                                                placeholder="قیمت"
                                                value={
                                                    prices[seller.id][
                                                        code.id
                                                    ] || ''
                                                }
                                                onChange={(e) =>
                                                    handlePriceChange(
                                                        seller.id,
                                                        code.id,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-green-500 focus:outline-none focus:ring focus:ring-green-200"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={submit}
                        className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white shadow transition hover:bg-green-700"
                    >
                        ذخیره قیمت‌ها
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
