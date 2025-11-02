<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PriceController extends Controller
{
    public function index()
    {
        $sellers = [
            ['id' => 1, 'name' => 'علی رضایی'],
            ['id' => 2, 'name' => 'مهدی حسینی'],
            ['id' => 3, 'name' => 'رضا احمدی'],
        ];

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
