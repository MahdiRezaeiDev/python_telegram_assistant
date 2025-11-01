import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react';
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
            await axios.post(route('products.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('فایل با موفقیت بارگذاری شد!', {
                description: 'تمام داده‌ها به درستی در دیتابیس ذخیره شدند.',
                position: 'bottom-left',
                duration: 4000,
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
                duration: 4000,
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
                <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                    <h1 className="mb-3 text-center text-2xl font-bold text-gray-800">
                        بارگذاری فایل اکسل
                    </h1>
                    <p className="mb-6 text-center text-sm text-gray-500">
                        لطفاً فایل اکسل حاوی محصولات و کدهای مشابه را انتخاب
                        کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Custom File Input */}
                        <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-indigo-500 hover:bg-indigo-50">
                            <input
                                id="file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                            <Upload className="mb-2 h-10 w-10 text-indigo-500" />
                            <p className="text-gray-600">
                                {file ? (
                                    <span className="flex items-center justify-center gap-2 font-medium text-indigo-600">
                                        <FileSpreadsheet className="h-5 w-5" />
                                        {file.name}
                                    </span>
                                ) : (
                                    'برای انتخاب فایل کلیک کنید یا آن را اینجا بکشید'
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                فرمت‌های مجاز: .xlsx, .xls, .csv
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <PrimaryButton
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        در حال بارگذاری...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5" />
                                        بارگذاری فایل
                                    </>
                                )}
                            </PrimaryButton>

                            <Link
                                href={route('products.index')}
                                className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                برگشت
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
