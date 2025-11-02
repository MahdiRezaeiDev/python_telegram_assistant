<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerController extends Controller
{
    /**
     * Display the list of sellers for the current user
     */
    public function index()
    {
        $sellers = Seller::where('user_id', Auth::id())->get();

        return Inertia::render('Seller/Index', [
            'sellers' => $sellers
        ]);
    }

    /**
     * Store a newly created seller
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|min:3|max:100',
            'phone' => [
                'required',
                'string',
                'regex:/^(?:\+98|0)?9\d{9}$|^(?:\+98|0)?(?:21|26|25|31|41|51|44|45|11|13|17|23|24|38|54|61|71|77|81|83|84)\d{7}$/'
            ],
        ], [
            'full_name.required' => 'نام الزامی است.',
            'full_name.string' => 'نام باید شامل حروف باشد.',
            'full_name.min' => 'نام باید حداقل ۳ حرف باشد.',
            'full_name.max' => 'نام نباید بیش از ۱۰۰ حرف باشد.',
            'phone.required' => 'شماره تماس الزامی است.',
            'phone.string' => 'شماره تماس باید به صورت رشته‌ای وارد شود.',
            'phone.regex' => 'شماره تماس وارد شده معتبر نیست.',
        ]);

        $seller = Seller::create([
            'user_id' => Auth::id(),
            'full_name' => $request->full_name,
            'phone' => $request->phone,
        ]);

        // ✅ Return JSON instead of redirect
        return response()->json([
            'newSeller' => $seller->fresh(),
            'message' => 'فروشنده با موفقیت اضافه شد.'
        ]);
    }

    public function update(Request $request, Seller $seller)
    {
        if ($seller->user_id !== Auth::id()) {
            abort(403, 'دسترسی غیرمجاز');
        }

        $request->validate([
            'full_name' => 'required|string|min:3|max:100',
            'phone' => [
                'required',
                'string',
                'regex:/^(?:\+98|0)?9\d{9}$|^(?:\+98|0)?(?:21|26|25|31|41|51|44|45|11|13|17|23|24|38|54|61|71|77|81|83|84)\d{7}$/'
            ],
        ], [
            'full_name.required' => 'نام الزامی است.',
            'full_name.min' => 'نام باید حداقل ۳ کاراکتر باشد.',
            'phone.required' => 'شماره تماس الزامی است.',
            'phone.regex' => 'شماره تماس وارد شده معتبر نیست.',
        ]);

        $seller->update([
            'full_name' => $request->full_name,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'updatedSeller' => $seller->fresh(),
            'message' => 'فروشنده با موفقیت ویرایش شد.'
        ]);
    }


    public function toggleView(Request $request, Seller $seller)
    {
        $seller->view = $request->view;
        $seller->save();

        return redirect()->back()->with([
            'status' => 'success',
            'message' => 'عملیات موفقانه انجام شد.'
        ]);
    }

    /**
     * Delete a seller
     */
    public function destroy(Seller $seller)
    {
        // Ensure the seller belongs to the authenticated user
        if ($seller->user_id !== Auth::id()) {
            abort(403, 'دسترسی غیرمجاز');
        }

        $seller->delete();

        return response()->json(['success' => true]);
    }
}
