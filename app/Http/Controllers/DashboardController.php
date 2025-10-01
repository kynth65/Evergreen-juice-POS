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

        // Calculate boundaries in local timezone, then format as strings for SQLite
        $todayStart = $now->copy()->startOfDay()->toDateTimeString();
        $todayEnd = $now->copy()->endOfDay()->toDateTimeString();
        $weekStart = $now->copy()->startOfWeek()->toDateTimeString();
        $weekEnd = $now->copy()->endOfWeek()->toDateTimeString();
        $monthStart = $now->copy()->startOfMonth()->toDateTimeString();
        $monthEnd = $now->copy()->endOfMonth()->toDateTimeString();

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
        $thirtyDaysAgo = $now->copy()->subDays(30)->startOfDay()->toDateTimeString();
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

    public function analytics(Request $request)
    {
        // Use the application timezone for proper date calculations
        $now = Carbon::now(config('app.timezone'));

        // Handle date range parameters with validation
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period' => 'nullable|in:7days,30days,3months,6months,1year,all',
        ]);

        // Determine date range based on period or custom dates
        if (!empty($validated['period'])) {
            $endDate = $now->copy()->endOfDay();
            $startDate = match ($validated['period']) {
                '7days' => $now->copy()->subDays(7)->startOfDay(),
                '30days' => $now->copy()->subDays(30)->startOfDay(),
                '3months' => $now->copy()->subMonths(3)->startOfDay(),
                '6months' => $now->copy()->subMonths(6)->startOfDay(),
                '1year' => $now->copy()->subYear()->startOfDay(),
                'all' => Carbon::parse('2000-01-01', config('app.timezone'))->startOfDay(),
            };
        } else {
            $startDate = !empty($validated['start_date'])
                ? Carbon::parse($validated['start_date'], config('app.timezone'))->startOfDay()
                : $now->copy()->subDays(30)->startOfDay();
            $endDate = !empty($validated['end_date'])
                ? Carbon::parse($validated['end_date'], config('app.timezone'))->endOfDay()
                : $now->copy()->endOfDay();
        }

        $thirtyDaysAgo = $startDate->toDateTimeString();
        $endDateTime = $endDate->toDateTimeString();
        $yearAgo = $now->copy()->subYear()->startOfDay()->toDateTimeString();

        // Sales analytics for the selected date range
        $salesData = Order::completed()
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
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
            ->whereBetween('orders.created_at', [$thirtyDaysAgo, $endDateTime])
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
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
            ->select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('payment_method')
            ->get();

        // Weekday analysis - best selling days
        $weekdayAnalysis = Order::completed()
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
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
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
            ->select(
                DB::raw("CAST(strftime('%H', created_at) AS INTEGER) as hour"),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_revenue')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Monthly comparison (current vs previous)
        // Ensure we're comparing full calendar months for accurate growth metrics
        $currentMonth = Order::completed()
            ->whereBetween('created_at', [
                $now->copy()->startOfMonth()->toDateTimeString(),
                $now->copy()->endOfMonth()->toDateTimeString()
            ])
            ->selectRaw('COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue')
            ->first();

        $previousMonth = Order::completed()
            ->whereBetween('created_at', [
                $now->copy()->subMonth()->startOfMonth()->toDateTimeString(),
                $now->copy()->subMonth()->endOfMonth()->toDateTimeString(),
            ])
            ->selectRaw('COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue')
            ->first();

        // Calculate average order value for current and previous month
        $currentMonthAvg = $currentMonth->orders > 0
            ? $currentMonth->revenue / $currentMonth->orders
            : 0;
        $previousMonthAvg = $previousMonth->orders > 0
            ? $previousMonth->revenue / $previousMonth->orders
            : 0;

        // Revenue trends by week (within selected date range)
        $weeklyTrends = Order::completed()
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
            ->select(
                DB::raw("strftime('%Y%W', created_at) as year_week"),
                DB::raw("date(created_at, 'weekday 0', '-7 days') as week_start"),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as orders_count')
            )
            ->groupBy('year_week', 'week_start')
            ->orderBy('year_week')
            ->get();

        // Monthly revenue trends (within selected date range)
        $monthlyTrends = Order::completed()
            ->whereBetween('created_at', [$thirtyDaysAgo, $endDateTime])
            ->select(
                DB::raw("strftime('%Y-%m', created_at) as year_month"),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('AVG(total_amount) as avg_order_value')
            )
            ->groupBy('year_month')
            ->orderBy('year_month')
            ->get();

        // Category performance
        $categoryPerformance = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->whereBetween('orders.created_at', [$thirtyDaysAgo, $endDateTime])
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
            'currentMonthAvgOrderValue' => $currentMonthAvg,
            'previousMonthAvgOrderValue' => $previousMonthAvg,
            'weeklyTrends' => $weeklyTrends,
            'monthlyTrends' => $monthlyTrends,
            'categoryPerformance' => $categoryPerformance,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'period' => $validated['period'] ?? '30days',
            ],
        ]);
    }

    public function salesByDate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        // Parse the date in the application timezone for database query
        $date = Carbon::parse($request->date, config('app.timezone'));
        $dateStart = $date->copy()->startOfDay()->toDateTimeString();
        $dateEnd = $date->copy()->endOfDay()->toDateTimeString();

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
