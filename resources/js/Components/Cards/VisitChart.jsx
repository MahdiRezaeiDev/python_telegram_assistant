import moment from 'moment-jalaali';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

moment.loadPersian({ dialect: 'persian-modern' });

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

export default function MonthlyVisitsBarChart({ data = [] }) {
    // Map data to Afghan months
    const chartData = afghanMonths.map((monthName, idx) => {
        const item = data[idx] || { visits: 0 };
        return {
            name: monthName,
            visits: item.visits,
        };
    });

    return (
        <div className="font-vazirmatn h-full rounded-2xl bg-white text-right shadow">
            <div className="rounded-t-lg bg-teal-700 p-6">
                <h3 className="text-center text-lg font-bold text-white">
                    راپور ماهانه ویزیت‌ها
                </h3>
            </div>

            <div className="w-full p-4">
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            reversed={true} // Right-to-left month display
                            tick={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                fontSize: 13,
                            }}
                            axisLine={false}
                            tickLine={false}
                            interval={0} // Show all months
                        />
                        <YAxis
                            tick={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                fontSize: 13,
                            }}
                            orientation="right"
                            tickFormatter={(v) => v.toLocaleString()}
                        />
                        <Tooltip
                            formatter={(value) => `${value} ویزیت`}
                            contentStyle={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                direction: 'rtl',
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontFamily: 'Vazir, Tahoma, sans-serif',
                                direction: 'rtl',
                                fontSize: 13,
                            }}
                        />
                        <Bar
                            dataKey="visits"
                            name="ویزیت‌ها"
                            fill="#2563eb"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
