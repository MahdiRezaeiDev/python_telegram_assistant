import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function MonthlyStatsChart({ data = [], usePersian = false }) {
    const persianMonths = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ];

    // Reverse and map data for RTL display
    const chartData = [...data].map((item, index) => ({
        label: usePersian
            ? persianMonths[(index + (12 - (data.length % 12))) % 12]
            : item.month,
        incoming: Number(item.incoming),
        outgoing: Number(item.outgoing),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    reversed={true} // For RTL timeline
                    tick={{ textAnchor: 'end' }}
                />
                <YAxis />
                <Tooltip
                    formatter={(value, name) => {
                        return [value, name];
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="incoming"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="دریافتی"
                />
                <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    name="ارسالی"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
