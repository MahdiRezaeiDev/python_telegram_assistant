import { useForm } from '@inertiajs/react';
import persian from 'react-date-object/calendars/persian';
import persian_en from 'react-date-object/locales/persian_en';
import { DateObject } from 'react-multi-date-picker';
import AfghanDatePicker from '../AfghanDatePicker';
import InputError from '../InputError';
import PrimaryButton from '../PrimaryButton';

export default function DrugSellCard() {
    const { data, setData, post, processing, errors, reset } = useForm({
        sale_date: new DateObject({
            calendar: persian,
            locale: persian_en,
        }).format('YYYY/MM/DD'),
        total_amount: '',
        description: '',
        sale_type: 'without_prescription',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('pharmacy.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    const inputClass =
        'peer block w-full rounded-sm border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400';

    return (
        <div className="h-full w-full rounded-lg border border-gray-100 bg-white shadow-xl">
            <div className="rounded-t-lg bg-teal-700 p-6">
                <h2 className="text-xl font-bold text-white">
                    فروش دارو بدون نسخه
                </h2>
            </div>

            <form onSubmit={submit} className="p-6">
                {/* Date */}
                <div className="relative mb-4">
                    <AfghanDatePicker
                        value={data.sale_date}
                        id="sale_date"
                        onChange={(value) =>
                            setData('sale_date', value.format('YYYY/MM/DD'))
                        }
                    />
                    <label
                        htmlFor="sale_date"
                        className="absolute left-3 top-2 bg-white px-2 text-sm text-gray-500 transition-all peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                    >
                        تاریخ فروش
                    </label>
                    <InputError message={errors.sale_date} />
                </div>

                {/* total_amount */}
                <div className="relative mb-4">
                    <input
                        type="number"
                        id="total_amount"
                        value={data.total_amount}
                        onChange={(e) =>
                            setData('total_amount', e.target.value)
                        }
                        className={inputClass}
                        required
                    />
                    <label
                        htmlFor="total_amount"
                        className="absolute left-3 top-2 bg-white px-2 text-sm text-gray-500 transition-all peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                    >
                        مبلغ (افغانی)
                    </label>
                    <InputError message={errors.total_amount} />
                </div>

                {/* Description */}
                <div className="relative mb-4">
                    <textarea
                        value={data.description}
                        id="description"
                        onChange={(e) => setData('description', e.target.value)}
                        rows={3}
                        className={inputClass}
                    />
                    <label
                        htmlFor="description"
                        className="absolute left-3 top-2 bg-white px-2 text-sm text-gray-500 transition-all peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500"
                    >
                        توضیحات
                    </label>
                    <InputError message={errors.description} />
                </div>

                {/* Submit */}
                <div className="flex justify-start">
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 font-semibold focus:ring-2 focus:ring-teal-300"
                    >
                        ثبت فروش
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
