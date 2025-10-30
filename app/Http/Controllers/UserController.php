<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('account')->paginate(25);
        return Inertia::render('User/Index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => ['required', 'string', 'min:3', 'max:30'],
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,user'],
            'password' => ['required', 'string', 'min:4', 'confirmed'],
        ], [
            'full_name.required' => 'نام کامل الزامی است.',
            'full_name.min' => 'نام کامل باید حداقل ۳ کاراکتر باشد.',
            'full_name.max' => 'نام کامل نمی‌تواند بیش از ۳۰ کاراکتر باشد.',

            'email.required' => 'ایمیل الزامی است.',
            'email.email' => 'فرمت ایمیل وارد شده معتبر نیست.',

            'role.required' => 'نقش کاربر الزامی است.',
            'role.in' => 'نقش انتخاب‌شده معتبر نیست.',

            'password.required' => 'رمز عبور الزامی است.',
            'password.min' => 'رمز عبور باید حداقل ۴ کاراکتر باشد.',
            'password.confirmed' => 'تکرار رمز عبور با رمز عبور مطابقت ندارد.',
        ]);

        $user = new User();
        $user->name = $request->full_name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->back()->with(['status' => 'success', 'message' => 'کاربر جدید موفقانه ایجاد گردید.']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('User/Edit', ['user' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Validation rules
        $request->validate([
            'full_name' => ['required', 'string', 'min:3', 'max:30'],
            'email' => ['required', 'email', "unique:users,email,{$user->id}"], // ignore current user email
            'role' => ['required', 'in:admin,user'],
            'password' => ['nullable', 'string', 'min:4', 'confirmed'], // optional
        ], [
            'full_name.required' => 'نام کامل الزامی است.',
            'full_name.min' => 'نام کامل باید حداقل ۳ کاراکتر باشد.',
            'full_name.max' => 'نام کامل نمی‌تواند بیش از ۳۰ کاراکتر باشد.',

            'email.required' => 'ایمیل الزامی است.',
            'email.email' => 'فرمت ایمیل وارد شده معتبر نیست.',
            'email.unique' => 'این ایمیل قبلاً استفاده شده است.',

            'role.required' => 'نقش کاربر الزامی است.',
            'role.in' => 'نقش انتخاب‌شده معتبر نیست.',

            'password.min' => 'رمز عبور باید حداقل ۴ کاراکتر باشد.',
            'password.confirmed' => 'تکرار رمز عبور با رمز عبور مطابقت ندارد.',
        ]);

        // Update fields
        $user->name = $request->full_name;
        $user->email = $request->email;
        $user->role = $request->role;

        // Update password only if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->back()->with([
            'status' => 'success',
            'message' => 'اطلاعات کاربر با موفقیت به‌روزرسانی شد.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with([
            'status' => 'success',
            'message' => 'کاربر با موفقیت حذف شد.'
        ]);
    }
}
