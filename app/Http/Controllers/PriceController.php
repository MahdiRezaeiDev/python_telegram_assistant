<?php

namespace App\Http\Controllers;

use App\Models\Price;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PriceController extends Controller
{
    public function index()
    {
        // Fetch prices for the authenticated user, eager-load seller relationship
        $prices = Price::with('seller')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc') // optional: newest first
            ->paginate(30);

        // Map data if needed, but Inertia can handle models directly
        return Inertia::render('Prices/Index', [
            'prices' => $prices,
        ]);
    }

    public function create()
    {
        $sellers = Seller::where('user_id', Auth::id())->get();
        return inertia('Prices/Create', compact('sellers'));
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

    // --- Update a price ---
    public function update(Request $request, Price $price)
    {
        $request->validate([
            'code' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $price->update([
            'code_name' => $request->code,
            'price' => $request->price,
        ]);

        return response()->json([
            'updatedPrice' => $price->load('seller'),
        ]);
    }

    // --- Delete a price ---
    public function destroy(Price $price)
    {
        $price->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
