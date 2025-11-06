<?php

namespace App\Http\Controllers;

use App\Models\IncomingMessage;
use App\Models\OutgoingMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResponseController extends Controller
{
    public function index()
    {
        return Inertia::render('Response/Index');
    }


    public function getResponse()
    {
        $response = IncomingMessage::with([
            'outgoing' => function ($query) {
                $query->where('user_id', Auth::id());
            },
        ])->with('sender')
            ->get();
        return response()->json($response);
    }
}
