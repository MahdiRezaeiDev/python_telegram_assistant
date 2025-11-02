<?php

namespace App\Http\Controllers;

use App\Models\Price;
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

    /**
     * Store prices for sellers
     */
    public function store(Request $request)
    {
        $data = $request->input('data', []);

        // Loop through sellers
        foreach ($data as $sellerData) {
            $sellerId = $sellerData['seller_id'] ?? null;
            $codes = $sellerData['codes'] ?? [];

            // Skip if no seller ID or no codes with prices
            if (!$sellerId || empty($codes)) {
                continue;
            }

            foreach ($codes as $item) {
                $code = $item['code'] ?? null;
                $price = $item['price'] ?? null;

                // Only store if price is provided
                if ($code && $price !== null && $price !== '') {
                    // Either create new or update existing price
                    Price::create(
                        [
                            'seller_id' => $sellerId,
                            'code_name' => $code,
                            'price' => $price,
                            'user_id' => Auth::id(),
                        ]
                    );
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'قیمت‌ها با موفقیت ذخیره شدند.',
        ]);
    }
}
