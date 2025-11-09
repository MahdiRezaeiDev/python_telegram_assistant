<?php

namespace App\Http\Controllers;

use App\Models\IncomingMessage;
use App\Models\OutgoingMessage;
use App\Models\Product;
use App\Models\TelegramAccount;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Morilog\Jalali\Jalalian;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTodayMessages = $this->totalTodayMessages();
        $totalSavedGoods = $this->total_goods();
        $is_connected = $this->isConnected();
        $responseList = $this->responseList();
        $unrespondedMessages = $this->getUnrespondedMessages();


        // ---------- طول ماه‌های سال جاری جلالی ----------
        $jalaliYear = Jalalian::now()->format('Y');
        $jalaliMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

        // بررسی سال کبیسه جلالی
        $firstDayOfYear = Jalalian::fromFormat('Y-m-d', sprintf('%s-%02d-%02d', $jalaliYear, 1, 1));
        if ($firstDayOfYear->isLeapYear()) {
            $jalaliMonthDays[11] = 30; // ماه آخر = ۳۰ روز در سال کبیسه
        }

        $monthlyStats = [];
        $visitMonthlyStats = [];

        for ($m = 1; $m <= 12; $m++) {
            // تاریخ شروع و پایان ماه در جلالی با فرمت صحیح
            $startJalali = Jalalian::fromFormat('Y-m-d', sprintf('%s-%02d-01', $jalaliYear, $m));
            $endJalali = Jalalian::fromFormat('Y-m-d', sprintf('%s-%02d-%02d', $jalaliYear, $m, $jalaliMonthDays[$m - 1]));

            // تبدیل به میلادی
            $startGregorian = $startJalali->toCarbon();
            $endGregorian = $endJalali->toCarbon()->endOfDay();

            // محاسبه آمار مالی
            $incoming = IncomingMessage::whereBetween('created_at', [$startGregorian, $endGregorian])->sum('id');

            $outgoing = OutgoingMessage::whereBetween('created_at', [$startGregorian, $endGregorian])->where('user_id', Auth::id())->sum('id');

            $monthlyStats[] = [
                'month' => $startGregorian->translatedFormat('F'), // اسم ماه به فارسی
                'incoming' => $incoming,
                'outgoing' => $outgoing,
            ];
        }

        return Inertia::render('Dashboard', [
            'totalTodayMessages' => $totalTodayMessages,
            'totalSavedGoods' => $totalSavedGoods,
            'is_connected' => $is_connected,
            'responseList' => $responseList,
            'unrespondedMessages' => $unrespondedMessages,
            'monthlyStats' => $monthlyStats
        ]);
    }

    private function isConnected()
    {
        $account = TelegramAccount::where('user_id', Auth::id())->first();

        return $account['is_logged_in'];
    }

    private function total_goods()
    {
        $products = Product::with('simillars')
            ->where('user_id', Auth::id())
            ->get();

        $total = 0;

        foreach ($products as $product) {
            $total += 1 + $product->simillars->count();
        }

        return $total;
    }

    private function totalTodayMessages()
    {
        return IncomingMessage::whereDate('created_at', Carbon::today())->count();
    }

    private function responseList()
    {

        $responses = IncomingMessage::with(
            [
                'outgoing' => function ($query) {
                    $query->where('user_id', Auth::id());
                },
            ]
        )->with('sender')->get();

        return $responses;
    }

    private function getUnrespondedMessages()
    {
        $messages = IncomingMessage::with('sender')
            ->whereDoesntHave('outgoing', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();

        return $messages;
    }
}
