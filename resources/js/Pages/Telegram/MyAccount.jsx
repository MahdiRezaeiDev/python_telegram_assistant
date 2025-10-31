import DangerButton from '@/Components/DangerButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function MyAccount() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const phone = localStorage.getItem('telegram_phone');
    const account = usePage().props.auth.user?.account;

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.post(route('getAccountInfo'), {
                    phone,
                });

                if (res.data?.error) {
                    setConnected(false);
                } else {
                    setMe(res.data);
                    setConnected(true);
                }
            } catch (err) {
                setConnected(false);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    const handleReconnect = () => {
        localStorage.setItem('telegram_phone', phone);
        router.visit(route('loginPage'));
    };

    const handleDisconnect = () => {
        localStorage.removeItem('telegram_phone');
        toast.info('حساب شما با موفقیت حذف شد.', {
            description:
                'اتصال حساب کاربری شما با حساب تلگرام به صورت کامل قطع گردید و در هرگونه فعالیت های سیستم سهیم نیست.',
            position: 'bottom-left',
            duration: 4000,
            style: {
                backgroundColor: 'red',
                fontFamily: 'Vazir',
                color: 'white',
                fontWeight: 'bold',
            },
        });
        setMe(null);
        setConnected(false);
        axios.post(route('disconnect'), {
            onerror: (error) => {
                console.log(error);
            },
        });
    };

    return (
        <AuthenticatedLayout title="حساب کاربری تلگرام">
            <Head title="حساب کاربری تلگرام" />
            <Toaster richColors />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                            <p className="text-sm text-gray-600">
                                در حال دریافت اطلاعات حساب...
                            </p>
                        </div>
                    ) : !connected ? (
                        <div className="space-y-4 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                🚫 حساب شما متصل نیست
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-600">
                                به نظر می‌رسد حساب تلگرام شما قطع شده یا هنوز
                                ثبت نشده است. لطفاً یکی از گزینه‌های زیر را
                                انتخاب کنید.
                            </p>
                            <div className="mt-4 flex justify-center gap-3">
                                <button
                                    onClick={handleReconnect}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                >
                                    🔄 ثبت مجدد حساب
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="mb-3 text-2xl font-bold text-gray-800">
                                حساب تلگرام شما
                            </h1>
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
                                {account.profile_photo ? (
                                    <img
                                        src={
                                            'http://127.0.0.1:5000/' +
                                            account.profile_photo
                                        }
                                        alt={account.full_name}
                                        className="h-20 w-20 rounded-full border object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">
                                        بدون عکس
                                    </span>
                                )}
                            </div>
                            <p className="text-lg font-semibold text-gray-700">
                                {me.first_name} {me.last_name || ''}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                @{me.username || 'بدون نام کاربری'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {me.phone}
                            </p>

                            <DangerButton
                                onClick={handleDisconnect}
                                className="mt-6 flex w-full justify-center rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                            >
                                قطع اتصال حساب
                            </DangerButton>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
