import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { PlusCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function SellersTable({ sellers = [] }) {
    const [codes, setCodes] = useState([{ id: 1, code: '' }]);
    const [prices, setPrices] = useState(
        sellers.reduce((acc, s) => ({ ...acc, [s.id]: {} }), {}),
    );
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout title="لیست فروشنده‌ها و قیمت‌ها">
            <Head title="قیمت‌ها" />
            <Toaster richColors />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-gray-200 backdrop-blur">
                    {/* Header */}
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">
                            لیست فروشنده‌ها و قیمت‌ها
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('prices.index')}
                                className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                            >
                                لیست قیمت‌ها
                            </Link>
                            <Link
                                href={route('sellers.index')}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                            >
                                لیست فروشنده‌ها
                            </Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-gradient-to-l from-cyan-700 to-sky-700 text-white">
                                <tr>
                                    <th className="w-64 px-4 py-3 text-right font-semibold">
                                        فروشنده
                                    </th>
                                    {codes.map((code, idx) => (
                                        <th
                                            key={code.id}
                                            className="px-1 py-3 text-right"
                                        >
                                            <input
                                                type="text"
                                                placeholder="کد فنی قطعه"
                                                value={code.code}
                                                onChange={(e) =>
                                                    handleCodeChange(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                            />
                                        </th>
                                    ))}
                                    <th className="px-2 text-center">
                                        <button
                                            type="button"
                                            onClick={addCodeColumn}
                                            className="rounded-full p-1.5 text-white transition hover:bg-white/10 active:scale-95"
                                            title="افزودن کد جدید"
                                        >
                                            <PlusCircle className="h-6 w-6" />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {sellers.map((seller) => (
                                    <tr
                                        key={seller.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {seller.name}
                                        </td>
                                        {codes.map((code) => (
                                            <td
                                                key={code.id}
                                                className="px-2 py-2"
                                            >
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
                                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 transition focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-300"
                                                />
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={submit}
                            disabled={loading}
                            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow transition ${
                                loading
                                    ? 'cursor-not-allowed bg-green-400'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'در حال ذخیره...' : 'ذخیره قیمت‌ها'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
