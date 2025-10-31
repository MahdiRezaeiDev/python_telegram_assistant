import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Import() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('لطفاً یک فایل اکسل انتخاب کنید.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(route('products.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('فایل با موفقیت بارگذاری شد!', {
                description: 'تمام داده‌ها به درستی در دیتابیس ذخیره شدند.',
                position: 'bottom-left',
                duration: 3000,
                style: {
                    backgroundColor: 'seagreen',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });

            setFile(null);
        } catch (err) {
            toast.error('خطا در بارگذاری فایل', {
                description:
                    err.response?.data?.message || 'مشکلی در سرور رخ داده است.',
                position: 'bottom-left',
                duration: 3000,
                style: {
                    backgroundColor: 'red',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
        }

        setLoading(false);
    };

    return (
        <AuthenticatedLayout title="بارگذاری فایل اکسل">
            <Head title="بارگذاری فایل اکسل" />
            <Toaster richColors />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                    <h1 className="mb-3 text-center text-2xl font-bold text-gray-800">
                        بارگذاری فایل اکسل
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-500">
                        لطفاً فایل اکسل حاوی محصولات و کدهای مشابه را انتخاب
                        کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                انتخاب فایل
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'در حال بارگذاری...' : 'بارگذاری فایل'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
