<?php

namespace App\Http\Controllers;

use App\Models\DefaultMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DefaultMessageController extends Controller
{

    public function create()
    {
        $reply = DefaultMessage::where('user_id', Auth::id())->first();
        return Inertia::render('Messages/Index', [
            'defaultReply' => $reply ? $reply : null,
        ]);
    }

    // ذخیره (ایجاد یا به‌روزرسانی) — فقط یک پیام
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'nullable|string|max:2000',
        ]);

        $reply = DefaultMessage::first();

        if ($reply) {
            $reply->update(['message' => $validated['content']]);
        } else {
            DefaultMessage::create(['user_id' => Auth::id(), 'message' => $validated['content']]);
        }

        return redirect()->back()->with('success', 'پیام پیش‌فرض ذخیره شد.');
    }

    // حذف (پاک کردن متن، ردیف می‌ماند اما content = null)
    public function destroy(String $id)
    {
        $message = DefaultMessage::find($id);
        $message->delete();
        return redirect()->back()->with('success', 'پیام پیش‌فرض حذف شد.');
    }
}
