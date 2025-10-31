import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Login() {
    const account = usePage().props.auth.user?.account;
    const [phone, setPhone] = useState(account?.phone ?? '');
    const [apiId, setApiId] = useState(account?.api_id ?? '');
    const [apiHash, setApiHash] = useState(account?.api_hash ?? '');
    const [loading, setLoading] = useState(false);

    const validatePhone = (number) => {
        const regex = /^\+(98|93)[0-9]{8,12}$/; // +98 یا +93 و 8 تا 12 رقم
        return regex.test(number);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // اعتبارسنجی شماره قبل از ارسال
        if (!validatePhone(phone)) {
            toast.error('شماره وارد شده معتبر نیست!', {
                description:
                    ' لطفاً با +98 یا +93 وارد کنید و فاصله میان اعداد را حذف نمایید.',
                position: 'bottom-left',
                duration: 3000,
                style: {
                    backgroundColor: 'red',
                    fontFamily: 'Vazir',
                    color: 'white',
                    fontWeight: 'bold',
                },
            });
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(route('registerAccount'), {
                phone,
                apiId: apiId,
                apiHash: apiHash,
            });

            if (res.data.message) {
                toast.success('عملیات موفقانه انجام شد.', {
                    description:
                        'درخواست ورود به حساب تلگرام شما موفقانه ثبت شد و کد تایید ارسال گردید.',
                    position: 'bottom-left',
                    duration: 3000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
                localStorage.setItem('telegram_phone', phone);
                router.visit(route('verifyPage'));
            } else {
                toast.error('خطا در اجرای عملیات', {
                    description: res.data.error || 'مشکل در ثبت درخواست',
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
        } catch (error) {
            toast.error('خطا در اتصال به سرور', {
                description:
                    'لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.',
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
        <AuthenticatedLayout title="ورود به حساب تلگرام">
            <Head title="ورود به حساب تلگرام" />
            <Toaster richColors />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
                    <h1 className="mb-3 text-center text-2xl font-bold text-gray-800">
                        ورود به تلگرام
                    </h1>
                    <p className="mb-6 text-center text-xs text-gray-500">
                        لطفاً اطلاعات حساب تلگرام خود را وارد کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel value="شماره تلفن" />
                            <TextInput
                                placeholder="+987XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full text-sm"
                            />
                        </div>

                        <div>
                            <InputLabel value="API ID" />
                            <TextInput
                                placeholder="API ID خود را وارد کنید"
                                value={apiId}
                                onChange={(e) => setApiId(e.target.value)}
                                className="w-full text-sm"
                            />
                        </div>

                        <div>
                            <InputLabel value="API Hash" />
                            <TextInput
                                placeholder="API Hash خود را وارد کنید"
                                value={apiHash}
                                onChange={(e) => setApiHash(e.target.value)}
                                className="w-full text-sm"
                            />
                        </div>

                        <PrimaryButton
                            className="flex w-full justify-center"
                            disabled={loading}
                        >
                            {loading ? 'در حال ثبت...' : 'ثبت حساب'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
