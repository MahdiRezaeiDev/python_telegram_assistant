import SecondaryButton from '@/Components/SecondaryButton';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    MessageCircleHeart,
    MessageCircleReply,
    MessageSquare,
    Search,
} from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function Dashboard({
    totalTodayMessages,
    totalSavedGoods,
    is_connected,
    reports = {},
}) {
    const kpis = {
        totalTodayMessages: totalTodayMessages ?? 12456,
        totalSavedGoods: totalSavedGoods ?? 9843,
        is_connected: is_connected ?? 0,
        activeChats: 128,
    };

    const chartData = reports.trend ?? [
        { label: 'فروردین', msgs: 400 },
        { label: 'اردیبهشت', msgs: 700 },
        { label: 'خرداد', msgs: 600 },
        { label: 'تیر', msgs: 900 },
        { label: 'مرداد', msgs: 750 },
        { label: 'شهریور', msgs: 1050 },
    ];

    const recent = reports.recent ?? [
        {
            id: 1,
            chat: '@ali',
            message: 'درخواست قیمت 23300-2g410',
            status: 'reply_sent',
            time: '1h',
        },
        {
            id: 2,
            chat: '@sara',
            message: 'درخواست مشابه 209102gm00',
            status: 'no_price',
            time: '2h',
        },
        {
            id: 3,
            chat: '@reza',
            message: 'ارسال گزارش فروش',
            status: 'reply_sent',
            time: '3h',
        },
    ];

    const toggleAccountStatus = () => {
        console.log('Here');
    };

    return (
        <AuthenticatedLayout title="داشبورد">
            <Head title="داشبورد" />

            <main className="flex-1 p-6">
                {/* Header */}
                <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">داشبورد</h1>
                        <p className="text-sm text-muted-foreground">
                            نمای کلی وضعیت ربات و گزارش‌ها
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="جستجو در گزارش‌ها..."
                                className="w-56 rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-sky-200"
                            />
                        </div>
                        <SecondaryButton className="bg-teal-700">
                            توقف ارسال پیام
                        </SecondaryButton>
                    </div>
                </header>

                {/* KPI Cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard
                        className="bg-blue-500 text-white"
                        onClick={toggleAccountStatus}
                        icon={
                            <MessageCircleHeart className="h-6 w-6 text-green-700" />
                        }
                        title="وضعیت حساب تلگرام"
                        value={kpis.is_connected}
                        description="برای توقف و از سر گیری ارسال پیام خودکار روی آیکن کلیک کنید."
                    />
                    <KpiCard
                        icon={
                            <MessageSquare className="h-6 w-6 text-sky-500" />
                        }
                        title="کل پیام‌ها"
                        value={kpis.totalTodayMessages.toLocaleString()}
                        description="تمام پیام‌های پردازش‌شده"
                    />

                    <KpiCard
                        icon={
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        }
                        title="کد های ثبت شده"
                        value={kpis.totalSavedGoods.toLocaleString()}
                        description="مجموع کدهای ثبت شده شما"
                    />

                    <KpiCard
                        icon={
                            <MessageCircleReply className="h-6 w-6 text-cyan-500" />
                        }
                        title="پیام های امروز"
                        value={kpis.totalTodayMessages}
                        description="پیام‌های دریافتی امروز شما"
                    />
                </section>

                {/* Chart + Feed + Recent */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-sky-500" />
                                <CardTitle>روند پیام‌ها (ماهانه)</CardTitle>
                            </div>
                            <CardDescription>
                                آمار پیام‌های دریافتی و پاسخ‌ها در طول ماه‌های
                                اخیر
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="label" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="msgs"
                                            stroke="#0ea5e9"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Live feed */}
                    <Card>
                        <CardHeader>
                            <CardTitle>فید زنده</CardTitle>
                            <CardDescription>
                                آخرین پیام‌های دریافتی
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[260px] space-y-3 overflow-auto pr-1">
                                {recent.map((r) => (
                                    <div
                                        key={r.id}
                                        className="rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:bg-white"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium">
                                                {r.chat}
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                {r.time}
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-700">
                                            {r.message}
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            {r.status === 'reply_sent' ? (
                                                <span className="text-emerald-600">
                                                    ✅ پاسخ ارسال شد
                                                </span>
                                            ) : (
                                                <span className="text-orange-600">
                                                    ⚠️ بدون قیمت
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Table */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>گزارش‌های اخیر</CardTitle>
                            <CardDescription>
                                آخرین درخواست‌ها و وضعیت پاسخ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-right text-xs text-muted-foreground">
                                            <th className="py-2">#</th>
                                            <th className="py-2">چت</th>
                                            <th className="py-2">پیام</th>
                                            <th className="py-2">وضعیت</th>
                                            <th className="py-2">زمان</th>
                                            <th className="py-2">عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent.map((r, i) => (
                                            <tr
                                                key={r.id}
                                                className="border-t transition hover:bg-slate-50"
                                            >
                                                <td className="py-3 text-right">
                                                    {i + 1}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {r.chat}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {r.message}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {r.status ===
                                                    'reply_sent' ? (
                                                        <span className="font-medium text-emerald-600">
                                                            پاسخ ارسال شد
                                                        </span>
                                                    ) : (
                                                        <span className="font-medium text-orange-600">
                                                            بدون قیمت
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right">
                                                    {r.time}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            جزئیات
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            بازپخش
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </AuthenticatedLayout>
    );
}

/* --- KPI CARD COMPONENT --- */
function KpiCard({ icon, title, value, description }) {
    return (
        <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
