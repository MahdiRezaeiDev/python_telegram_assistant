import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Password() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const phone = localStorage.getItem('telegram_phone');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(route('verifyAccountPassword'), {
                phone,
                password,
            });

            if (res.data.message) {
                toast.error('ورود موفقیت آمیز انجام شد.', {
                    description:
                        'شما موفقانه حساب تلگرام خویش را به حساب کاربری خود متصل کردید.',
                    position: 'bottom-left',
                    duration: 3000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
                router.visit(route('myAccount'));
            } else {
                toast.error('خطا در اتصال به سرور', {
                    description: res.data.error,
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
        } catch (err) {
            toast.error('خطا در اتصال به سرور', {
                description:
                    'لطفا از درستی کد خویش اطمینان حاصل نموده دوباره تلاش نمایید.',
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
        <AuthenticatedLayout title="رمز دوم حساب تلگرام">
            <Head title="رمز دوم حساب تلگرام" />
            <Toaster richColors />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                    <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
                        وارد کردن رمز دوم
                        <span className="px-1 text-xs">(2FA)</span>
                    </h1>
                    <p className="mb-6 text-center text-xs text-gray-500">
                        لطفاً رمز دوم تلگرام خود را وارد کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel value="رمز دوم" />
                            <TextInput
                                type="password"
                                placeholder="رمز دوم تلگرام"
                                className="w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <PrimaryButton
                            disabled={loading}
                            className="flex w-full justify-center rounded px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? 'در حال بررسی...' : 'تایید رمز'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
