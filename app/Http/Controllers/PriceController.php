<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PriceController extends Controller
{
    public function index()
    {
        $sellers = Seller::where('user_id', Auth::id())->get();
        return inertia('Prices/Index', compact('sellers'));
    }

    public function store(Request $request)
    {
        // اینجا می‌تونی داده‌ها رو در دیتابیس ذخیره کنی
        $prices = $request->input('prices');
        // ذخیره‌سازی در جدول مورد نظر...
        return response()->json(['success' => true]);
    }
}
