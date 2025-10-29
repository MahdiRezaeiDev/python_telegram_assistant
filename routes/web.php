<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TelegramController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::prefix('telegram')->group(function () {
        Route::get('/me', [TelegramController::class, 'me'])->name('myAccount');
        Route::get('/register', [TelegramController::class, 'index'])->name('loginPage');
        Route::get('/verify', [TelegramController::class, 'verify'])->name('verifyPage');
        Route::get('/password', [TelegramController::class, 'password'])->name('passwordPage');


        Route::post('/me', [TelegramController::class, 'getAccountInfo'])->name('getAccountInfo');
        Route::post('/register', [TelegramController::class, 'register'])->name('registerAccount');
        Route::post('/verify', [TelegramController::class, 'verifyCode'])->name('verifyAccount');
        Route::post('/verifyPassword', [TelegramController::class, 'verifyPassword'])->name('verifyAccountPassword');
        Route::post('/send-message', [TelegramController::class, 'sendMessage'])->name('sendMessage');
    });
});


require __DIR__ . '/auth.php';
