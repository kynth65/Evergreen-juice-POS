<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->paginate(20);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product.category']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function receipt(Order $order)
    {
        $user = auth()->user();

        // Allow admins and cashiers to view any receipt
        // Allow users to view their own order receipts
        if (! $user->isAdmin() && ! $user->isCashier() && $order->user_id !== $user->id) {
            abort(403, 'You can only view your own order receipts.');
        }

        $order->load(['user', 'items.product']);

        return Inertia::render('orders/receipt', [
            'order' => $order,
        ]);
    }

    public function myOrders()
    {
        $orders = Order::with(['items.product'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        return Inertia::render('orders/my-orders', [
            'orders' => $orders,
        ]);
    }

    public function history(Request $request)
    {
        $query = Order::with(['user', 'items.product'])
            ->latest();

        // Apply filters
        if ($request->filled('date_from')) {
            $dateFrom = Carbon::parse($request->date_from)->setTimezone('Asia/Manila')->startOfDay();
            $query->where('created_at', '>=', $dateFrom);
        }

        if ($request->filled('date_to')) {
            $dateTo = Carbon::parse($request->date_to)->setTimezone('Asia/Manila')->endOfDay();
            $query->where('created_at', '<=', $dateTo);
        }

        if ($request->filled('cashier_id')) {
            $query->where('user_id', $request->cashier_id);
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('items', function ($itemQuery) use ($search) {
                      $itemQuery->where('product_name', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->paginate(25);

        // Get cashiers for filter dropdown
        $cashiers = User::where('role', 'cashier')
            ->orWhere('role', 'admin')
            ->select('id', 'name', 'role')
            ->get();

        // Get payment methods that exist in orders
        $paymentMethods = Order::select('payment_method')
            ->distinct()
            ->whereNotNull('payment_method')
            ->pluck('payment_method')
            ->unique()
            ->values();

        return Inertia::render('orders/history', [
            'orders' => $orders,
            'cashiers' => $cashiers,
            'paymentMethods' => $paymentMethods,
            'filters' => $request->only(['date_from', 'date_to', 'cashier_id', 'payment_method', 'status', 'search']),
        ]);
    }
}
