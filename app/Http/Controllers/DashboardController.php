<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Use the application timezone for proper date calculations
        $now = Carbon::now(config('app.timezone'));
        $todayStart = $now->copy()->startOfDay()->utc();
        $todayEnd = $now->copy()->endOfDay()->utc();
        $weekStart = $now->copy()->startOfWeek()->utc();
        $weekEnd = $now->copy()->endOfWeek()->utc();
        $monthStart = $now->copy()->startOfMonth()->utc();
        $monthEnd = $now->copy()->endOfMonth()->utc();

        $stats = [
            'todaySales' => Order::completed()->whereBetween('created_at', [$todayStart, $todayEnd])->sum('total_amount'),
            'todayOrders' => Order::completed()->whereBetween('created_at', [$todayStart, $todayEnd])->count(),
            'thisWeekSales' => Order::completed()->whereBetween('created_at', [$weekStart, $weekEnd])->sum('total_amount'),
            'thisMonthSales' => Order::completed()->whereBetween('created_at', [$monthStart, $monthEnd])->sum('total_amount'),
            'lowStockProducts' => Product::active()->lowStock()->count(),
            'totalProducts' => Product::active()->count(),
        ];

        $recentOrders = Order::with(['user', 'items.product'])
            ->latest()
            ->take(5)
            ->get();

        $lowStockProducts = Product::with('category')
            ->active()
            ->lowStock()
            ->orderBy('stock_quantity')
            ->take(5)
            ->get();

        // Top selling products (last 30 days)
        $thirtyDaysAgo = $now->copy()->subDays(30)->startOfDay()->utc();
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->where('orders.created_at', '>=', $thirtyDaysAgo)
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.line_total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'topProducts' => $topProducts,
            'user' => $user,
        ]);
    }

    public function analytics()
    {
        // Use the application timezone for proper date calculations
        $now = Carbon::now(config('app.timezone'));
        $thirtyDaysAgo = $now->copy()->subDays(30)->startOfDay()->utc();
        $yearAgo = $now->copy()->subYear()->startOfDay()->utc();

        // Sales analytics for the last 30 days
        $salesData = Order::completed()
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top selling products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->where('orders.created_at', '>=', $thirtyDaysAgo)
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.line_total) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->take(10)
            ->get();

        // Payment method breakdown
        $paymentMethods = Order::completed()
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('payment_method')
            ->get();

        // Weekday analysis - best selling days
        $weekdayAnalysis = Order::completed()
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw("CASE CAST(strftime('%w', created_at) AS INTEGER)
                    WHEN 0 THEN 'Sunday'
                    WHEN 1 THEN 'Monday'
                    WHEN 2 THEN 'Tuesday'
                    WHEN 3 THEN 'Wednesday'
                    WHEN 4 THEN 'Thursday'
                    WHEN 5 THEN 'Friday'
                    WHEN 6 THEN 'Saturday'
                    END as day_name"),
                DB::raw("CAST(strftime('%w', created_at) AS INTEGER) as day_number"),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_revenue'),
                DB::raw('AVG(total_amount) as avg_order_value')
            )
            ->groupBy('day_name', 'day_number')
            ->orderBy('day_number')
            ->get();

        // Hourly patterns - busiest hours
        $hourlyAnalysis = Order::completed()
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw("CAST(strftime('%H', created_at) AS INTEGER) as hour"),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_revenue')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Monthly comparison (current vs previous)
        $currentMonth = Order::completed()
            ->whereBetween('created_at', [$now->copy()->startOfMonth()->utc(), $now->copy()->endOfMonth()->utc()])
            ->selectRaw('COUNT(*) as orders, SUM(total_amount) as revenue')
            ->first();

        $previousMonth = Order::completed()
            ->whereBetween('created_at', [
                $now->copy()->subMonth()->startOfMonth()->utc(),
                $now->copy()->subMonth()->endOfMonth()->utc(),
            ])
            ->selectRaw('COUNT(*) as orders, SUM(total_amount) as revenue')
            ->first();

        // Revenue trends by week (last 12 weeks)
        $weeklyTrends = Order::completed()
            ->where('created_at', '>=', $now->copy()->subWeeks(12)->startOfWeek()->utc())
            ->select(
                DB::raw("strftime('%Y%W', created_at) as year_week"),
                DB::raw("date(created_at, 'weekday 0', '-7 days') as week_start"),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy('year_week', 'week_start')
            ->orderBy('year_week')
            ->get();

        // Category performance
        $categoryPerformance = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->where('orders.created_at', '>=', $thirtyDaysAgo)
            ->select(
                'categories.name as category_name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.line_total) as total_revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as orders_with_category')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();

        return Inertia::render('analytics', [
            'salesData' => $salesData,
            'topProducts' => $topProducts,
            'paymentMethods' => $paymentMethods,
            'weekdayAnalysis' => $weekdayAnalysis,
            'hourlyAnalysis' => $hourlyAnalysis,
            'currentMonth' => $currentMonth,
            'previousMonth' => $previousMonth,
            'weeklyTrends' => $weeklyTrends,
            'categoryPerformance' => $categoryPerformance,
        ]);
    }

    public function salesByDate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        // Parse the date in the application timezone and convert to UTC for database query
        $date = Carbon::parse($request->date, config('app.timezone'));
        $dateStart = $date->copy()->startOfDay()->utc();
        $dateEnd = $date->copy()->endOfDay()->utc();

        $sales = Order::completed()
            ->whereBetween('created_at', [$dateStart, $dateEnd])
            ->sum('total_amount');

        $orders = Order::completed()
            ->whereBetween('created_at', [$dateStart, $dateEnd])
            ->count();

        return response()->json([
            'date' => $date->format('Y-m-d'),
            'sales' => $sales,
            'orders' => $orders,
        ]);
    }
}
