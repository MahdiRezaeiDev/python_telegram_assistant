import 'moment/locale/fa';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

// Afghan (Jalali) months
const afghanMonths = [
    'حمل',
    'ثور',
    'جوزا',
    'سرطان',
    'اسد',
    'سنبله',
    'میزان',
    'عقرب',
    'قوس',
    'جدی',
    'دلو',
    'حوت',
];

export default function FinanceChart({ data = [] }) {
    const chartData = afghanMonths.map((monthName, idx) => {
        const item = data[idx] || { income: 0, expense: 0 };
        return {
            name: monthName,
            income: item.income,
            expense: item.expense,
        };
    });

    return (
        <div
            className="font-vazirmatn w-full rounded-2xl bg-white text-right shadow"
            dir="rtl"
        >
            <div className="rounded-t-lg bg-teal-700 p-6">
                <h3 className="text-center text-lg font-bold text-white">
                    راپور ماهانه عایدات و مصارف
                </h3>
            </div>

            <div className="w-full p-4 focus:outline-none">
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            reversed={true} // Right-to-left
                            tick={{
                                fontSize: 13,
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                textAnchor: 'middle', // center ticks
                            }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            tickFormatter={(v) => v.toLocaleString()}
                            tick={{
                                fontSize: 13,
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                textAnchor: 'end',
                            }}
                            orientation="right"
                        />
                        <Tooltip
                            formatter={(value) =>
                                `${value.toLocaleString()} افغانی`
                            }
                            contentStyle={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                fontSize: '13px',
                                direction: 'rtl',
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                fontSize: '13px',
                                direction: 'rtl',
                                textAlign: 'center',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            name="عایدات"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            name="مصارف"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <style>
                {`
                    /* Remove focus outline for charts */
                    .recharts-wrapper:focus,
                    .recharts-wrapper svg:focus {
                        outline: none !important;
                    }
                `}
            </style>
        </div>
    );
}
