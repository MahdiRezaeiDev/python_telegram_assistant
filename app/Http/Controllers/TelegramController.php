<?php

namespace App\Http\Controllers;

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

    public function getAccountInfo(Request $request)
    {
        $response = Http::post('http://127.0.0.1:5000/api/telegram/me', [
            'phone' => $request->phone,
        ]);

        return $response->json();
    }

    public function myGroups()
    {
        return Inertia::render('Telegram/MyGroups');
    }


    public function getMyGroups(Request $request)
    {
        $response = Http::post('http://127.0.0.1:5000/api/telegram/my-groups', [
            'phone' => $request->phone,
        ]);

        return $response->json();
    }

    public function index()
    {
        return Inertia::render('Telegram/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'api_id' => 'required|integer',
            'api_hash' => 'required|string',
        ]);

        $response = Http::post('http://127.0.0.1:5000/api/telegram/register', [
            'phone' => $request->phone,
            'apiId' => $request->api_id,
            'apiHash' => $request->api_hash,
            'user_id' => Auth::id()
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
            'phone' => 'required|string',
            'code' => 'required|string'
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
}
