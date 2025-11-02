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

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto w-full max-w-6xl">
                    {/* Header */}
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            لیست فروشنده‌ها و قیمت‌ها
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('prices.index')}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                لیست قیمت‌ها
                            </Link>
                            <Link
                                href={route('sellers.index')}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                            >
                                لیست فروشنده‌ها
                            </Link>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="sticky top-0 border-b px-4 py-2 text-right font-medium">
                                        فروشنده
                                    </th>
                                    {codes.map((code, idx) => (
                                        <th
                                            key={code.id}
                                            className="border-b px-2 py-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="کد فنی"
                                                value={code.code}
                                                onChange={(e) =>
                                                    handleCodeChange(
                                                        idx,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                            />
                                        </th>
                                    ))}
                                    <th className="border-b px-2 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={addCodeColumn}
                                            title="افزودن کد جدید"
                                            className="rounded-full p-1 text-gray-600 transition hover:bg-gray-200"
                                        >
                                            <PlusCircle className="h-5 w-5" />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellers.map((seller) => (
                                    <tr
                                        key={seller.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="border-b px-4 py-2 font-medium text-gray-800">
                                            {seller.full_name}
                                        </td>
                                        {codes.map((code) => (
                                            <td
                                                key={code.id}
                                                className="border-b px-2 py-2"
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
                                                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-300"
                                                />
                                            </td>
                                        ))}
                                        <td className="border-b px-2 py-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={submit}
                            disabled={loading}
                            className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium text-white transition ${
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
