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
    type Column,
    type ChartData,
} from '@/components/analytics';

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
    weeklyTrends: Array<{
        year_week: string;
        week_start: string;
        total: number;
        orders_count: number;
    }>;
    categoryPerformance: Array<{
        category_name: string;
        total_sold: number;
        total_revenue: number;
        orders_with_category: number;
    }>;
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
    weeklyTrends,
    categoryPerformance,
}: AnalyticsProps) {
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

    // Calculate growth percentages
    const revenueGrowth = previousMonth?.revenue
        ? ((currentMonth?.revenue - previousMonth.revenue) /
              previousMonth.revenue) *
          100
        : 0;

    // Calculate average order value
    const avgOrderValue =
        weekdayAnalysis.reduce(
            (sum, day) =>
                sum + parseFloat(day.avg_order_value?.toString() || '0'),
            0
        ) / (weekdayAnalysis.length || 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Comprehensive sales analytics and performance insights</p>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <StatCard
                        label="Current Month Revenue"
                        value={formatCurrency(currentMonth?.revenue || 0)}
                        change={{
                            value: revenueGrowth,
                            label: 'from last month',
                        }}
                    />

                    <StatCard
                        label="Average Order Value"
                        value={formatCurrency(avgOrderValue)}
                        change={{
                            value: 0,
                            label: 'Last 30 days average',
                        }}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <ChartCard title="Daily Sales Revenue">
                        <LineChart data={dailySalesChart} />
                    </ChartCard>

                    <ChartCard title="Payment Methods">
                        <DoughnutChart data={paymentMethodChart} />
                    </ChartCard>

                    <ChartCard title="Weekday Performance">
                        <BarChart data={weekdayChart} />
                    </ChartCard>

                    <ChartCard title="Hourly Order Patterns">
                        <BarChart data={hourlyChart} />
                    </ChartCard>
                </div>

                {/* Top Products Table */}
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

                {/* Category Performance Table */}
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
        </AppLayout>
    );
}