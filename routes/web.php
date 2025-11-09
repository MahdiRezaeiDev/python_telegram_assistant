<?php

use App\Http\Controllers\ContactsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DefaultMessageController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/products/downloadSample', [ProductController::class, 'downloadSample'])->name('products.downloadSample');


Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:admin')->resource('/users', UserController::class)->except('show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    // Telegram connection and information related routes
    Route::prefix('telegram')->group(function () {
        Route::get('/me', [TelegramController::class, 'me'])->name('myAccount');
        Route::post('/disconnect', [TelegramController::class, 'disconnect'])->name('disconnect');
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

        Route::post('/toggle-connection', [TelegramController::class, 'toggleConnection'])->name('toggleConnection');
    });

    // Group contacts related routes
    Route::post('contacts/get', [ContactsController::class, 'getContacts'])->name('contacts.get');
    Route::post('/contacts/toggle-block', [ContactsController::class, 'toggleBlock'])->name('contacts.toggleBlock');
    Route::resource('/contacts', ContactsController::class);


    // Products Related controllers
    Route::post('/products/{product}/field', [ProductController::class, 'fieldUpdate'])->name('field.update');
    Route::resource('/products', ProductController::class)->except('show');

    // Robot Default message Routes
    Route::resource('/default/messages', DefaultMessageController::class)->except(['index', 'show', 'edit']);

    Route::get('/prices', [PriceController::class, 'index'])->name('prices.index');
    Route::get('/prices/create', [PriceController::class, 'create'])->name('prices.create');
    Route::post('/prices', [PriceController::class, 'store'])->name('prices.store');
    Route::put('/prices/{price}', [PriceController::class, 'update'])->name('prices.update');
    Route::delete('/prices/{price}', [PriceController::class, 'destroy'])->name('prices.destroy');

    Route::get('/sellers', [SellerController::class, 'index'])->name('sellers.index');
    Route::post('/sellers', [SellerController::class, 'store'])->name('sellers.store');
    Route::put('/sellers/{seller}', [SellerController::class, 'update'])->name('sellers.update');
    Route::delete('/sellers/{seller}', [SellerController::class, 'destroy'])->name('sellers.destroy');
    Route::post('/sellers/{seller}/toggle-view', [SellerController::class, 'toggleView'])->name('sellers.toggleView');


    Route::get('/responses', [ResponseController::class, 'index'])->name('response.index');
    Route::post('/responses', [ResponseController::class, 'getResponse'])->name('response.get');
});


require __DIR__ . '/auth.php';
