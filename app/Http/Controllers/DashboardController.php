<?php

namespace App\Http\Controllers;

use App\Models\IncomingMessage;
use App\Models\Product;
use App\Models\TelegramAccount;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTodayMessages = $this->totalTodayMessages();
        $totalSavedGoods = $this->total_goods();
        $is_connected = $this->isConnected();
        $responseList = $this->responseList();
        $unrespondedMessages = $this->getUnrespondedMessages();

        

        return Inertia::render('Dashboard', [
            'totalTodayMessages' => $totalTodayMessages,
            'totalSavedGoods' => $totalSavedGoods,
            'is_connected' => $is_connected,
            'responseList' => $responseList,
            'unrespondedMessages' => $unrespondedMessages,
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
