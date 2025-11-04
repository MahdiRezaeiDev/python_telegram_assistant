<?php

namespace App\Http\Controllers;

use App\Models\TelegramAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class TelegramController extends Controller
{

    public function me()
    {
        return Inertia::render('Telegram/MyAccount');
    }

    public function getAccountInfo()
    {
        $response = Http::post('http://127.0.0.1:5000/api/telegram/me', [
            'user_id' => Auth::id(),
        ]);

        return $response->json();
    }

    public function disconnect()
    {
        $account = TelegramAccount::where('user_id', Auth::id())->first();

        if (!$account) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'هیچ حساب تلگرامی برای کاربر فعلی یافت نشد.',
            ]);
        }

        $account->is_logged_in = 0;
        $account->save();

        return redirect()->back()->with([
            'status' => 'success',
            'message' => 'اتصال حساب تلگرام شما با موفقیت قطع گردید.',
        ]);
    }

    public function myGroups()
    {
        return Inertia::render('Telegram/MyGroups');
    }

    public function getMyGroups()
    {
        $response = Http::post('http://127.0.0.1:5000/api/telegram/my-groups', [
            'user_id' => Auth::id(),
        ]);

        return $response->json();
    }

    public function index()
    {
        return Inertia::render('Telegram/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^\+(98|93)[0-9]{8,12}$/'],
            'apiId' => ['required', 'integer'],
            'apiHash' => ['required', 'string'],
        ], [
            'phone.required' => 'شماره تلفن الزامی است.',
            'phone.string' => 'شماره تلفن باید رشته‌ای معتبر باشد.',
            'phone.regex' => 'شماره تلفن باید با +98 یا +93 شروع شود و فقط شامل اعداد انگلیسی باشد.',
            'apiId.required' => 'API ID الزامی است.',
            'apiId.integer' => 'API ID باید عدد صحیح باشد.',
            'apiHash.required' => 'API Hash الزامی است.',
            'apiHash.string' => 'API Hash باید رشته‌ای معتبر باشد.',
        ]);

        $response = Http::post('http://127.0.0.1:5000/api/telegram/register', [
            'phone' => $request->phone,
            'apiId' => $request->apiId,
            'apiHash' => $request->apiHash,
            'user_id' => Auth::id(),
        ]);

        return $response->json();
    }

    public function verify()
    {
        return Inertia::render('Telegram/Verify');
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^\+(98|93)[0-9]{8,12}$/'],
            'code' => ['required', 'string', 'min:4', 'max:8'],
        ], [
            'phone.required' => 'شماره تلفن الزامی است.',
            'phone.string' => 'شماره تلفن باید رشته‌ای معتبر باشد.',
            'phone.regex' => 'شماره تلفن باید با +98 یا +93 شروع شود و فقط شامل اعداد انگلیسی باشد.',
            'code.required' => 'کد تایید الزامی است.',
            'code.string' => 'کد تایید باید رشته‌ای معتبر باشد.',
            'code.min' => 'کد تایید حداقل ۴ رقم باید باشد.',
            'code.max' => 'کد تایید نمی‌تواند بیش از ۸ رقم باشد.',
        ]);

        $response = Http::post('http://127.0.0.1:5000/api/telegram/verify', [
            'phone' => $request->phone,
            'code' => $request->code,
        ]);

        return $response->json();
    }

    public function password()
    {
        return Inertia::render('Telegram/Password');
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string'
        ]);

        $response = Http::post('http://127.0.0.1:5000/api/telegram/verify-password', [
            'phone' => $request->phone,
            'password' => $request->password,
        ]);

        return $response->json();
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string'
        ]);

        // Call Python API
        $response = Http::post('http://127.0.0.1:5000/send_message', $request->all());
        return $response->json();
    }


    public function toggleConnection()
    {
        // Get the user's telegram account
        $account = TelegramAccount::where('user_id', Auth::id())->firstOrFail();

        // Toggle the is_logged_in field
        $account->is_logged_in = $account->is_logged_in ? 0 : 1;
        $account->save();

        // Optionally return a response (for AJAX/axios)
        return response()->json([
            'success' => true,
            'is_logged_in' => $account->is_logged_in,
            'status' => $account->is_logged_in
        ]);
    }
}
