<?php

use App\Http\Controllers\ContactsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TelegramController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
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
        Route::get('/myGroups', [TelegramController::class, 'myGroups'])->name('myGroups');



        Route::get('/register', [TelegramController::class, 'index'])->name('loginPage');
        Route::get('/verify', [TelegramController::class, 'verify'])->name('verifyPage');
        Route::get('/password', [TelegramController::class, 'password'])->name('passwordPage');


        Route::post('/me', [TelegramController::class, 'getAccountInfo'])->name('getAccountInfo');
        Route::post('/myGroups', [TelegramController::class, 'getMyGroups'])->name('getMyGroups');


        Route::post('/register', [TelegramController::class, 'register'])->name('registerAccount');
        Route::post('/verify', [TelegramController::class, 'verifyCode'])->name('verifyAccount');
        Route::post('/verifyPassword', [TelegramController::class, 'verifyPassword'])->name('verifyAccountPassword');
        Route::post('/send-message', [TelegramController::class, 'sendMessage'])->name('sendMessage');
    });

    Route::post('contacts/get', [ContactsController::class, 'getContacts'])->name('contacts.get');
    Route::post('/contacts/toggle-block', [ContactsController::class, 'toggleBlock'])->name('contacts.toggleBlock');
    Route::resource('/contacts', ContactsController::class);
});


require __DIR__ . '/auth.php';
