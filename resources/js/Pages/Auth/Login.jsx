import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="رورد به حساب کاربری" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="w-full px-4 lg:w-4/12">
                <div className="bg-blueGray-200 relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 py-1 shadow-lg">
                    <div className="flex-auto p-10 px-4 lg:px-10">
                        <div className="text-blueGray-700 mb-3 text-center font-bold">
                            <h2 className="text-xl">ورود به حساب کاربری</h2>
                        </div>
                        <form onSubmit={submit}>
                            <div className="relative mb-3 w-full">
                                <InputLabel
                                    htmlFor="email"
                                    value="ایمیل آدرس"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="ایمیل آدرس"
                                    className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>
                            <div className="relative mb-3 w-full">
                                <InputLabel
                                    htmlFor="password"
                                    value="رمز عبور"
                                />
                                <div className="relative mb-3 w-full">
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="رمز عبور"
                                        className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        مرا به خاطر بسپار
                                    </span>
                                </label>
                            </div>
                            <div className="mt-6 text-center">
                                <PrimaryButton
                                    className="active:bg-blueGray-600 mb-1 mr-1 flex w-full justify-center rounded px-6 py-3 text-center text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
                                    disabled={processing}
                                >
                                    ورود به حساب
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
