import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, PlusCircle, Save, Search } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function SellersTable({ sellers = [] }) {
    const [codes, setCodes] = useState([]);
    const [prices, setPrices] = useState(
        sellers.reduce((acc, s) => ({ ...acc, [s.id]: {} }), {}),
    );
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const addCodeColumn = () => {
        setCodes((prev) => [...prev, { id: prev.length + 1, code: '' }]);
    };

    const handleCodeChange = (index, value) => {
        const updated = [...codes];
        updated[index].code = value.toUpperCase();
        setCodes(updated);
    };

    const handlePriceChange = (sellerId, codeId, value) => {
        value = value.toUpperCase();
        setPrices((prev) => ({
            ...prev,
            [sellerId]: { ...prev[sellerId], [codeId]: value },
        }));
    };

    const submit = async () => {
        try {
            setLoading(true);

            const payload = sellers
                .map((s) => ({
                    seller_id: s.id,
                    codes: codes
                        .filter(
                            (c) =>
                                c.code?.trim() && // code is not empty
                                prices[s.id]?.[c.id] !== undefined &&
                                prices[s.id][c.id] !== '', // price is not empty
                        )
                        .map((c) => ({
                            code: c.code,
                            price: prices[s.id][c.id],
                        })),
                }))
                .filter((s) => s.codes.length > 0); // remove sellers with no valid codes

            if (payload.length === 0) {
                toast.error('لطفا حداقل یک کد و قیمت معتبر وارد نمایید.', {
                    position: 'bottom-left',
                    style: {
                        backgroundColor: 'orange',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
                return;
            }

            await axios.post(route('prices.store'), { data: payload });

            toast.success('عملیات موفقانه انجام شد.', {
                description: 'قیمت های گرفته شما موفقانه ثبت سیستم گردید.',
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
            setCodes([]);
            setPrices(sellers.reduce((acc, s) => ({ ...acc, [s.id]: {} }), {}));
        } catch (err) {
            console.error(err);
            toast.error('خطا در انجام عملیات', {
                description:
                    'عملیات ثبت قیمت های بازار ناموفق بود، لطفا بعدا تلاش نمایید.',
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const removeCodeColumn = (codeId) => {
        setCodes((prev) => prev.filter((c) => c.id !== codeId));
        setPrices((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((sellerId) => {
                delete updated[sellerId][codeId];
            });
            return updated;
        });
    };

    // Filter sellers by search
    const filteredSellers = sellers.filter((s) =>
        s.full_name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AuthenticatedLayout title="ثبت قیمت های بازار">
            <Head title="قیمت‌ها" />
            <Toaster richColors />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto w-full space-y-4">
                    {/* Header & Search */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            ثبت قیمت های بازار
                        </h1>
                        <div className="relative flex items-center gap-2">
                            <Search className="absolute left-2 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="جستجوی فروشنده..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-300 md:w-64"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full border-collapse text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="sticky top-0 w-52 border-b px-4 py-2 text-right font-semibold">
                                        فروشنده
                                    </th>
                                    {codes.map((code, idx) => (
                                        <th
                                            key={code.id}
                                            className="px-2 py-2 text-right"
                                        >
                                            <div className="relative flex gap-1">
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
                                                    style={{ direction: 'ltr' }}
                                                    className="w-32 rounded border border-gray-300 p-2 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCodeColumn(
                                                            code.id,
                                                        )
                                                    }
                                                    className="absolute right-2 top-[6px] text-xl text-red-600 hover:text-red-800"
                                                    title="حذف کد"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="border-b px-2 py-2 text-center">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={addCodeColumn}
                                                title="افزودن کد جدید"
                                                className="rounded-full p-1 text-gray-600 transition hover:bg-gray-200"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                            </button>
                                            <span
                                                onClick={submit}
                                                disabled={loading}
                                                title="ثبت کد ها"
                                            >
                                                {loading ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Save className="h-5 w-5 cursor-pointer" />
                                                )}
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSellers.map((seller, idx) => (
                                    <tr
                                        key={seller.id}
                                        className={`transition hover:bg-gray-50 ${
                                            idx % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-gray-50'
                                        }`}
                                    >
                                        <td className="border-b px-4 py-2 font-medium text-gray-800">
                                            {seller.full_name}
                                        </td>
                                        {codes.map((code) => (
                                            <td
                                                key={code.id}
                                                className="w-32 border-b px-2 py-2"
                                            >
                                                <input
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
                                                    style={{ direction: 'ltr' }}
                                                    className="w-32 rounded border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-300"
                                                />
                                            </td>
                                        ))}
                                        <td className="border-b px-2 py-2"></td>
                                    </tr>
                                ))}
                                {filteredSellers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={codes.length + 2}
                                            className="py-4 text-center text-gray-500"
                                        >
                                            فروشنده‌ای پیدا نشد.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-start">
                        <button
                            onClick={submit}
                            disabled={loading}
                            className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium text-white transition ${
                                loading
                                    ? 'cursor-not-allowed bg-cyan-400'
                                    : 'bg-cyan-600 hover:bg-cyan-700'
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
