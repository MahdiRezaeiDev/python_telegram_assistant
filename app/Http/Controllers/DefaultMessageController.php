<?php

namespace App\Http\Controllers;

use App\Models\DefaultMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DefaultMessageController extends Controller
{
    // صفحه را برمی‌گرداند (Inertia) با دادهٔ فعلی
    public function create()
    {
        $reply = DefaultMessage::first(); // تنها یک ردیف فرض می‌کنیم
        return Inertia::render('Messages/Index', [
            'defaultReply' => $reply ? $reply->content : null,
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
            $reply->update(['content' => $validated['content']]);
        } else {
            DefaultMessage::create(['content' => $validated['content']]);
        }

        return redirect()->back()->with('success', 'پیام پیش‌فرض ذخیره شد.');
    }

    // حذف (پاک کردن متن، ردیف می‌ماند اما content = null)
    public function destroy()
    {
        $reply = DefaultMessage::first();

        if ($reply) {
            $reply->update(['content' => null]);
        }

        return redirect()->back()->with('success', 'پیام پیش‌فرض حذف شد.');
    }
}
