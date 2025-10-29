import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

export default function TelegramDashboard() {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            phone: '',
            apiId: '',
            apiHash: '',
        });

    const handleRegister = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    console.log(errors);

    return (
        <div className="mx-auto mt-10 max-w-md rounded-md bg-white p-6 shadow-md">
            <h1 className="mb-4 text-2xl font-bold">Telegram Manager</h1>

            <div>
                <h2 className="mb-2 text-xl font-semibold">
                    Register Telegram
                </h2>
                <input
                    className="mb-2 w-full rounded border p-2"
                    placeholder="Phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                <InputError message={errors.phone} />
                <input
                    className="mb-2 w-full rounded border p-2"
                    placeholder="API ID"
                    value={data.apiId}
                    onChange={(e) => setData('apiId', e.target.value)}
                />
                <input
                    className="mb-2 w-full rounded border p-2"
                    placeholder="API Hash"
                    value={data.apiHash}
                    onChange={(e) => setData('apiHash', e.target.value)}
                />
                <button
                    onClick={handleRegister}
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    {processing ? 'Registering...' : 'Register'}
                </button>
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600">Saved.</p>
                </Transition>
            </div>
        </div>
    );
}
