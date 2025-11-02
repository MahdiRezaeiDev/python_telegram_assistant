<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function index()
    {
        $sellers = Seller::where('user_id', Auth::id())->get();
        return Inertia::render('Seller/Index', [
            'sellers' => $sellers
        ]);
    }

    public function store(Request $request)
    {
        $seller = new Seller();
    }
}
