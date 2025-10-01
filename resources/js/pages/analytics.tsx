import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    StatCard,
    ChartCard,
    LineChart,
    BarChart,
    DoughnutChart,
    DataTable,
    DateRangeFilter,
    type ChartData,
} from '@/components/analytics';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AnalyticsProps {
    salesData: Array<{
        date: string;
        total: number;
        orders_count: number;
    }>;
    topProducts: Array<{
        name: string;
        total_sold: number;
        total_revenue: number;
    }>;
    paymentMethods: Array<{
        payment_method: string;
        count: number;
        total: number;
    }>;
    weekdayAnalysis: Array<{
        day_name: string;
        day_number: number;
        orders_count: number;
        total_revenue: number;
        avg_order_value: number;
    }>;
    hourlyAnalysis: Array<{
        hour: number;
        orders_count: number;
        total_revenue: number;
    }>;
    currentMonth: {
        orders: number;
        revenue: number;
    };
    previousMonth: {
        orders: number;
        revenue: number;
    };
    currentMonthAvgOrderValue: number;
    previousMonthAvgOrderValue: number;
    weeklyTrends: Array<{
        year_week: string;
        week_start: string;
        total: number;
        orders_count: number;
    }>;
    monthlyTrends: Array<{
        year_month: string;
        total: number;
        orders_count: number;
        avg_order_value: number;
    }>;
    categoryPerformance: Array<{
        category_name: string;
        total_sold: number;
        total_revenue: number;
        orders_with_category: number;
    }>;
    filters: {
        start_date: string;
        end_date: string;
        period: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

export default function Analytics({
    salesData,
    topProducts,
    paymentMethods,
    weekdayAnalysis,
    hourlyAnalysis,
    currentMonth,
    previousMonth,
    currentMonthAvgOrderValue,
    previousMonthAvgOrderValue,
    weeklyTrends,
    monthlyTrends,
    categoryPerformance,
    filters,
}: AnalyticsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'customers'>('overview');
    // Process data for charts
    const dailySalesChart: ChartData = {
        labels: salesData.map((item) => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Sales Revenue',
                data: salesData.map((item) => parseFloat(item.total.toString())),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.3,
            },
        ],
    };

    const weekdayChart: ChartData = {
        labels: weekdayAnalysis.map((item) => item.day_name),
        datasets: [
            {
                label: 'Revenue',
                data: weekdayAnalysis.map((item) =>
                    parseFloat(item.total_revenue.toString())
                ),
                backgroundColor: 'rgba(168, 85, 247, 0.6)',
                borderColor: 'rgb(168, 85, 247)',
                borderWidth: 1,
            },
        ],
    };

    const hourlyChart: ChartData = {
        labels: hourlyAnalysis.map((item) => `${item.hour}:00`),
        datasets: [
            {
                label: 'Orders',
                data: hourlyAnalysis.map((item) => item.orders_count),
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1,
            },
        ],
    };

    const paymentMethodChart: ChartData = {
        labels: paymentMethods.map(
            (item) =>
                item.payment_method.charAt(0).toUpperCase() +
                item.payment_method.slice(1)
        ),
        datasets: [
            {
                data: paymentMethods.map((item) =>
                    parseFloat(item.total.toString())
                ),
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthlyTrendsChart: ChartData = {
        labels: monthlyTrends.map((item) => {
            const [year, month] = item.year_month.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
            });
        }),
        datasets: [
            {
                label: 'Monthly Revenue',
                data: monthlyTrends.map((item) => parseFloat(item.total.toString())),
                borderColor: 'rgb(21, 128, 61)',
                backgroundColor: 'rgba(21, 128, 61, 0.1)',
                tension: 0.3,
            },
        ],
    };

    const weeklyTrendsChart: ChartData = {
        labels: weeklyTrends.map((item) => {
            const date = new Date(item.week_start);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }),
        datasets: [
            {
                label: 'Weekly Revenue',
                data: weeklyTrends.map((item) => parseFloat(item.total.toString())),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.3,
            },
        ],
    };

    // Calculate growth percentages with proper null/zero handling
    const revenueGrowth =
        previousMonth?.revenue && previousMonth.revenue > 0
            ? ((currentMonth?.revenue - previousMonth.revenue) /
                  previousMonth.revenue) *
              100
            : null; // null indicates no comparison data available

    // Calculate average order value growth
    const avgOrderValueGrowth =
        previousMonthAvgOrderValue && previousMonthAvgOrderValue > 0
            ? ((currentMonthAvgOrderValue - previousMonthAvgOrderValue) /
                  previousMonthAvgOrderValue) *
              100
            : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 md:space-y-8">
                <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base">Comprehensive sales analytics and performance insights</p>
                </div>

                {/* Date Range Filter */}
                <DateRangeFilter
                    initialStartDate={filters.start_date}
                    initialEndDate={filters.end_date}
                    initialPeriod={filters.period}
                />

                {/* Separator */}
                <div className="border-t border-gray-200"></div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg border p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        <Button
                            variant={activeTab === 'overview' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('overview')}
                            className={`text-xs sm:text-sm ${
                                activeTab === 'overview' ? 'bg-green-700 hover:bg-green-800' : ''
                            }`}
                        >
                            Overview
                        </Button>
                        <Button
                            variant={activeTab === 'sales' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('sales')}
                            className={`text-xs sm:text-sm ${
                                activeTab === 'sales' ? 'bg-green-700 hover:bg-green-800' : ''
                            }`}
                        >
                            Sales Trends
                        </Button>
                        <Button
                            variant={activeTab === 'products' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('products')}
                            className={`text-xs sm:text-sm ${
                                activeTab === 'products' ? 'bg-green-700 hover:bg-green-800' : ''
                            }`}
                        >
                            Products
                        </Button>
                        <Button
                            variant={activeTab === 'customers' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveTab('customers')}
                            className={`text-xs sm:text-sm ${
                                activeTab === 'customers' ? 'bg-green-700 hover:bg-green-800' : ''
                            }`}
                        >
                            Customer Insights
                        </Button>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Key Performance Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <StatCard
                                label="Current Month Revenue"
                                value={formatCurrency(currentMonth?.revenue || 0)}
                                change={
                                    revenueGrowth !== null
                                        ? {
                                              value: revenueGrowth,
                                              label: 'from last month',
                                          }
                                        : {
                                              value: 0,
                                              label: 'No previous month data',
                                          }
                                }
                            />

                            <StatCard
                                label="Average Order Value"
                                value={formatCurrency(currentMonthAvgOrderValue)}
                                change={
                                    avgOrderValueGrowth !== null
                                        ? {
                                              value: avgOrderValueGrowth,
                                              label: 'from last month',
                                          }
                                        : {
                                              value: 0,
                                              label: 'No previous month data',
                                          }
                                }
                            />
                        </div>

                        {/* Quick Overview Charts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <ChartCard title="Daily Sales Revenue">
                                <LineChart data={dailySalesChart} />
                            </ChartCard>

                            <ChartCard title="Payment Methods Distribution">
                                <DoughnutChart data={paymentMethodChart} />
                            </ChartCard>
                        </div>
                    </div>
                )}

                {/* Sales Trends Tab */}
                {activeTab === 'sales' && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <ChartCard title="Monthly Revenue Trends (Last 12 Months)">
                                <LineChart data={monthlyTrendsChart} />
                            </ChartCard>

                            <ChartCard title="Weekly Revenue Trends (Last 12 Weeks)">
                                <LineChart data={weeklyTrendsChart} />
                            </ChartCard>

                            <ChartCard title="Daily Sales Revenue">
                                <LineChart data={dailySalesChart} />
                            </ChartCard>

                            <ChartCard title="Weekday Performance">
                                <BarChart data={weekdayChart} />
                            </ChartCard>
                        </div>

                        {/* Monthly Breakdown Table */}
                        <DataTable
                            title="Monthly Performance Breakdown"
                            columns={[
                                {
                                    header: 'Month',
                                    accessor: (row) => {
                                        const [year, month] = row.year_month.split('-');
                                        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                        });
                                    },
                                },
                                { header: 'Orders', accessor: 'orders_count' },
                                {
                                    header: 'Revenue',
                                    accessor: (row) =>
                                        formatCurrency(parseFloat(row.total.toString())),
                                },
                                {
                                    header: 'Avg Order Value',
                                    accessor: (row) =>
                                        formatCurrency(parseFloat(row.avg_order_value.toString())),
                                },
                            ]}
                            data={monthlyTrends}
                        />
                    </div>
                )}

                {/* Products & Categories Tab */}
                {activeTab === 'products' && (
                    <div className="space-y-4 sm:space-y-6">
                        <DataTable
                            title="Top Selling Products"
                            columns={[
                                { header: 'Product Name', accessor: 'name' },
                                { header: 'Units Sold', accessor: 'total_sold' },
                                {
                                    header: 'Total Revenue',
                                    accessor: (row) =>
                                        formatCurrency(
                                            parseFloat(row.total_revenue.toString())
                                        ),
                                },
                            ]}
                            data={topProducts}
                        />

                        <DataTable
                            title="Category Performance"
                            columns={[
                                { header: 'Category', accessor: 'category_name' },
                                { header: 'Units Sold', accessor: 'total_sold' },
                                {
                                    header: 'Revenue',
                                    accessor: (row) =>
                                        formatCurrency(
                                            parseFloat(row.total_revenue.toString())
                                        ),
                                },
                                { header: 'Orders', accessor: 'orders_with_category' },
                            ]}
                            data={categoryPerformance}
                        />
                    </div>
                )}

                {/* Customer Insights Tab */}
                {activeTab === 'customers' && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            <ChartCard title="Payment Methods Distribution">
                                <DoughnutChart data={paymentMethodChart} />
                            </ChartCard>

                            <ChartCard title="Weekday Performance">
                                <BarChart data={weekdayChart} />
                            </ChartCard>

                            <ChartCard title="Hourly Order Patterns">
                                <BarChart data={hourlyChart} />
                            </ChartCard>
                        </div>

                        {/* Weekday Analysis Table */}
                        <DataTable
                            title="Weekday Analysis"
                            columns={[
                                { header: 'Day', accessor: 'day_name' },
                                { header: 'Orders', accessor: 'orders_count' },
                                {
                                    header: 'Revenue',
                                    accessor: (row) =>
                                        formatCurrency(
                                            parseFloat(row.total_revenue.toString())
                                        ),
                                },
                                {
                                    header: 'Avg Order Value',
                                    accessor: (row) =>
                                        formatCurrency(
                                            parseFloat(row.avg_order_value.toString())
                                        ),
                                },
                            ]}
                            data={weekdayAnalysis}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}