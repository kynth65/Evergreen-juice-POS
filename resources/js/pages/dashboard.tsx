import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { DataTable } from '@/components/analytics';
import { useState } from 'react';
import {
    AlertTriangleIcon,
    PlusIcon
} from 'lucide-react';

interface Stats {
    todaySales: number;
    todayOrders: number;
    thisWeekSales: number;
    thisMonthSales: number;
    lowStockProducts: number;
    totalProducts: number;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    user?: {
        name: string;
    };
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    low_stock_threshold: number;
    sku: string | null;
    image_url: string | null;
    is_active: boolean;
    track_inventory: boolean;
    category: {
        id: number;
        name: string;
        color: string;
    };
    is_low_stock: boolean;
    is_out_of_stock: boolean;
}

interface User {
    id: number;
    name: string;
    role: string;
    email?: string;
    is_active?: boolean;
    created_at?: string;
}

interface TopProduct {
    name: string;
    total_sold: number;
    total_revenue: number;
}

interface Props {
    stats: Stats;
    recentOrders: Order[];
    lowStockProducts: Product[];
    topProducts: TopProduct[];
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

export default function Dashboard({ stats, recentOrders, lowStockProducts, topProducts, user }: Props) {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [customSales, setCustomSales] = useState<{ date: string; sales: number; orders: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (!date) {
            setCustomSales(null);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/sales-by-date?date=${date}`);
            const data = await response.json();
            setCustomSales(data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user.name}!</p>
                    </div>
                    <Link href="/pos">
                        <Button size="lg" className="gap-2">
                            <PlusIcon className="w-5 h-5" />
                            New Sale
                        </Button>
                    </Link>
                </div>

                {/* Sales Analytics Section */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Today's Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg sm:text-2xl font-bold text-green-900">₱{stats.todaySales.toFixed(2)}</div>
                                <p className="text-xs text-green-600">{stats.todayOrders} orders</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">This Week</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg sm:text-2xl font-bold text-blue-900">₱{stats.thisWeekSales.toFixed(2)}</div>
                                <p className="text-xs text-blue-600">Week sales</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">This Month</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg sm:text-2xl font-bold text-purple-900">₱{stats.thisMonthSales.toFixed(2)}</div>
                                <p className="text-xs text-purple-600">Month sales</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50 border-orange-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg sm:text-2xl font-bold text-orange-900">{stats.totalProducts}</div>
                                <p className="text-xs text-red-600">{stats.lowStockProducts} low stock</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Date Picker Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Custom Date Sales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <DatePicker
                                    label="Select Date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="w-48"
                                />
                                {loading && <div className="text-sm text-gray-500">Loading...</div>}
                            </div>

                            {customSales && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Sales</div>
                                        <div className="text-xl font-bold">₱{customSales.sales.toFixed(2)}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Orders</div>
                                        <div className="text-xl font-bold">{customSales.orders}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recentOrders.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No orders yet today</p>
                                ) : (
                                    recentOrders.map(order => (
                                        <Link key={order.id} href={`/orders/${order.id}`}>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                                <div>
                                                    <p className="font-medium text-sm">{order.order_number}</p>
                                                    <p className="text-xs text-gray-600">
                                                        {order.user?.name || 'Guest'} • {new Date(order.created_at).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">₱{Number(order.total_amount).toFixed(2)}</p>
                                                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-1">
                        <DataTable
                            title="Top Selling Products"
                            description="Last 30 days"
                            columns={[
                                { header: 'Product Name', accessor: 'name' },
                                { header: 'Units Sold', accessor: 'total_sold' },
                                {
                                    header: 'Revenue',
                                    accessor: (row) =>
                                        formatCurrency(
                                            parseFloat(row.total_revenue.toString())
                                        ),
                                },
                            ]}
                            data={topProducts}
                            maxHeight="max-h-80"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
