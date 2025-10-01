<?php

use App\Http\Controllers\AccountManagementController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuBoardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('menu-board', [MenuBoardController::class, 'index'])->name('menu-board');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // POS Routes
    Route::get('pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('pos/checkout', [PosController::class, 'checkout'])
        ->middleware('throttle:30,1')
        ->name('pos.checkout');

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        // Category Management
        Route::resource('categories', CategoryController::class);

        // Product Management
        Route::resource('products', ProductController::class);

        // Order Management (viewing all orders)
        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');

        // Analytics
        Route::get('analytics', [DashboardController::class, 'analytics'])->name('analytics');
        Route::get('sales-by-date', [DashboardController::class, 'salesByDate'])->name('sales.by-date');

        // Order History - Admin only for now
        Route::get('history', [OrderController::class, 'history'])->name('orders.history');

        // Account Management (Admin only)
        Route::resource('account-management', AccountManagementController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->middleware('throttle:60,1');
    });

    // Cashier accessible routes
    Route::middleware('role:admin,cashier')->group(function () {
        // View own orders
        Route::get('my-orders', [OrderController::class, 'myOrders'])->name('orders.my');
    });

    // Receipt printing - accessible to any authenticated user for their own orders
    Route::get('orders/{order}/receipt', [OrderController::class, 'receipt'])->name('orders.receipt');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
