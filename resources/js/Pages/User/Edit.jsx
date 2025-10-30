import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Toaster, toast } from 'sonner';

export default function Edit({ user }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, processing, reset } = useForm({
        full_name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'user',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('users.update', user.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('password', 'password_confirmation');
                toast.success('عملیات موفقانه انجام شد.', {
                    description: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد.',
                    position: 'bottom-left',
                    duration: 2000,
                    style: {
                        backgroundColor: 'rgb(31, 41, 55)',
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
        <AuthenticatedLayout title="ویرایش حساب کاربری">
            <Head title="ویرایش حساب کاربری" />

            {/* 🔔 Sonner Toaster */}
            <Toaster richColors />

            <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 transition hover:shadow-2xl">
                <div className="border-b border-gray-100 px-8 py-5">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        ویرایش حساب کاربری
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        اطلاعات کاربر را ویرایش و سپس ذخیره کنید.
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
                        <InputLabel value="رمز عبور جدید" />
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
                        <p className="mt-1 text-xs text-gray-600">
                            در صورت عدم تغییر رمز، این فیلد را خالی بگذارید.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel value="تکرار رمز عبور جدید" />
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
                    <div className="col-span-1 flex justify-end pt-2 md:col-span-2">
                        <PrimaryButton
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700"
                        >
                            {processing
                                ? 'در حال ذخیره...'
                                : 'به‌روزرسانی کاربر'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
