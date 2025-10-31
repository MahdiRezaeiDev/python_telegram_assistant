import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Verify() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const phone = localStorage.getItem('telegram_phone');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(route('verifyAccount'), {
                phone,
                code,
            });

            if (res.data.two_factor_required) {
                router.visit(route('passwordPage')); // فرم رمز دوم
            } else if (res.data?.message) {
                toast.success('ورود با موفقیت انجام شد!', {
                    position: 'top-center',
                    duration: 3000,
                });
            } else {
                toast.error(res.data.error || 'خطا رخ داد!', {
                    position: 'top-center',
                    duration: 3000,
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'خطا در اتصال به سرور!', {
                position: 'top-center',
                duration: 3000,
            });
        }

        setLoading(false);
    };

    return (
        <AuthenticatedLayout title="تایید کد ورود">
            <Head title="تایید کد ورود" />
            <Toaster richColors />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                    <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        تایید کد ورود
                    </h1>
                    <p className="mb-6 text-center text-gray-500">
                        لطفاً کد تایید ارسال شده به شماره {phone} را وارد کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                کد تایید
                            </label>
                            <input
                                type="text"
                                placeholder="کد را وارد کنید"
                                className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'در حال بررسی...' : 'تایید'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
