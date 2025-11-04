<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTodayMessages = 0;
        $totalSavedGoods = 0;

        return Inertia::render('Dashboard', [
            'totalTodayMessages' => $totalTodayMessages,
            'totalSavedGoods' => $totalSavedGoods,
        ]);
    }
}
