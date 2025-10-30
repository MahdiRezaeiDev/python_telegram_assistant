import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Toaster, toast } from 'sonner';

export default function Create() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, post, processing, reset } = useForm({
        full_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('عملیات موفقانه انجام شد.', {
                    description: 'کاربر مد نظر با موفقیت ایجاد گردید.',
                    position: 'bottom-left',
                    duration: 4000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            },
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout title="ایجاد حساب کاربری جدید">
            <Head title="ایجاد حساب کاربری جدید" />

            {/* 🔔 Sonner Toaster */}
            <Toaster richColors />

            <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition hover:shadow-lg">
                <div className="border-b border-gray-100 px-8 py-5">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        ایجاد حساب کاربری جدید
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        لطفاً اطلاعات کاربر جدید را وارد کنید.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2"
                >
                    {/* Full Name */}
                    <div>
                        <InputLabel value="نام و نام خانوادگی" />
                        <TextInput
                            value={data.full_name}
                            onChange={(e) =>
                                setData('full_name', e.target.value)
                            }
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.full_name} />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel value="ایمیل آدرس" />
                        <TextInput
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Role */}
                    <div>
                        <InputLabel value="نوعیت حساب" />
                        <select
                            className="mt-1 w-full rounded-md border-gray-300 bg-white text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="user">کاربر</option>
                            <option value="admin">ادمین</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel value="رمز عبور" />
                        <TextInput
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel value="تکرار رمز عبور" />
                        <TextInput
                            type="password"
                            ref={currentPasswordInput}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className="mt-1 w-full"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 flex justify-start gap-2 pt-2 md:col-span-2">
                        <PrimaryButton
                            disabled={processing}
                            className="rounded px-6 py-2 font-medium text-white transition"
                        >
                            {processing ? 'در حال ذخیره...' : 'ذخیره کاربر'}
                        </PrimaryButton>
                        <Link
                            href={route('users.index')}
                            className="border-blueGray-300 text-blueGray-600 hover:bg-blueGray-50 rounded border px-4 py-2 text-xs font-semibold transition"
                        >
                            بازگشت
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
