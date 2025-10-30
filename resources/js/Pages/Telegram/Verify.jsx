import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

export default function Verify() {
    const { data, setData, post, errors, processing } = useForm({
        code: '',
    });

    const phone = localStorage.getItem('telegram_phone');

    const handleSubmit = async (e) => {
        e.preventDefault();

        post(route('verifyAccount'), {
            preserveScroll: true,
            onSuccess: () => {
                if (res.data.two_factor_required) {
                    router.visit(route('passwordPage'));
                } else if (res.data?.message) {
                    toast.success('ورود با موفقیت انجام شد!', {
                        position: 'bottom-left',
                        duration: 3000,
                    });
                }
            },
            onError: () => {
                toast.error(
                    err.response?.data?.error || 'خطا در اتصال به سرور!',
                    {
                        position: 'bottom-left',
                        duration: 3000,
                    },
                );
            },
        });
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
                    <p className="mb-6 text-center text-xs text-gray-500">
                        لطفاً کد تایید ارسال شده به شماره {phone} را وارد کنید
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel message="کد تایید" />
                            <TextInput
                                placeholder="کد را وارد کنید"
                                value={data.code}
                                onChange={(e) =>
                                    setData('code', e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.code} />
                        </div>

                        <PrimaryButton
                            className="flex w-full justify-center"
                            disabled={processing}
                        >
                            {processing ? 'در حال بررسی...' : 'تایید'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
