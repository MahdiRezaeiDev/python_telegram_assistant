import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

export default function Login() {
    const validatePhone = (number) => {
        const regex = /^\+(98|93)[0-9]{8,12}$/; // +98 یا +93 و 8 تا 12 رقم
        return regex.test(number);
    };

    const { data, setData, post, errors, processing } = useForm({
        phone: '',
        apiId: '',
        apiHash: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // اعتبارسنجی شماره قبل از ارسال
        if (!validatePhone(data.phone)) {
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

        post(route('registerAccount'), {
            preserveScroll: true,
            onSuccess: () => {
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
            },
            onError: () => {
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
            },
        });
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
                                placeholder="+98 7XX XXX XXX"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <InputLabel value="API ID" />
                            <TextInput
                                placeholder="123456"
                                value={data.apiId}
                                onChange={(e) =>
                                    setData('apiId', e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.apiId} />
                        </div>

                        <div>
                            <InputLabel value="API Hash" />
                            <TextInput
                                placeholder="############"
                                value={data.apiHash}
                                onChange={(e) =>
                                    setData('apiHash', e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.apiHash} />
                        </div>

                        <PrimaryButton
                            disabled={processing}
                            className="flex w-full justify-center text-center"
                        >
                            {processing ? 'در حال ثبت...' : 'ثبت حساب'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
