import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Receipt, Search, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface OrderItem {
    id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
}

interface User {
    id: number;
    name: string;
    role: string;
}

interface Order {
    id: number;
    order_number: string;
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_reference?: string;
    notes?: string;
    status: string;
    created_at: string;
    completed_at?: string;
    user: User;
    items: OrderItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface HistoryProps {
    orders: PaginatedOrders;
    cashiers: User[];
    paymentMethods: string[];
    filters: {
        date_from?: string;
        date_to?: string;
        cashier_id?: string;
        payment_method?: string;
        status?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Order History',
        href: '/history',
    },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
        case 'cash':
            return 'Cash';
        case 'card':
            return 'Card';
        case 'digital_wallet':
            return 'Digital Wallet';
        default:
            return method.charAt(0).toUpperCase() + method.slice(1);
    }
};

const getTodayDate = () => {
    const today = new Date();
    const phDate = new Date(today.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
    return phDate.toISOString().split('T')[0];
};

export default function OrderHistory({
    orders,
    cashiers,
    paymentMethods,
    filters,
}: HistoryProps) {
    const [localFilters, setLocalFilters] = useState({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        cashier_id: filters.cashier_id || 'all',
        payment_method: filters.payment_method || 'all',
        status: filters.status || 'all',
        search: filters.search || '',
    });

    const hasActiveFilters = useMemo(() => {
        return Object.values(localFilters).some(value => value !== '' && value !== 'all');
    }, [localFilters]);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilters = () => {
        const params = Object.fromEntries(
            Object.entries(localFilters).filter(([, value]) => value !== '' && value !== 'all')
        );
        router.get('/history', params, { preserveState: true });
    };

    const clearFilters = () => {
        setLocalFilters({
            date_from: '',
            date_to: '',
            cashier_id: 'all',
            payment_method: 'all',
            status: 'all',
            search: '',
        });
        router.get('/history', {}, { preserveState: true });
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            applyFilters();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order History" />
            <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Order History</h1>
                    <p className="text-gray-600 text-sm sm:text-base">View and search all order records with detailed information</p>
                </div>

                {/* Filters Section */}
                <Card className="p-4 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">From Date</label>
                            <Input
                                type="date"
                                value={localFilters.date_from}
                                max={getTodayDate()}
                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">To Date</label>
                            <Input
                                type="date"
                                value={localFilters.date_to}
                                max={getTodayDate()}
                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cashier</label>
                            <Select
                                value={localFilters.cashier_id}
                                onValueChange={(value) => handleFilterChange('cashier_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All cashiers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All cashiers</SelectItem>
                                    {cashiers.map((cashier) => (
                                        <SelectItem key={cashier.id} value={cashier.id.toString()}>
                                            {cashier.name} ({cashier.role})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Method</label>
                            <Select
                                value={localFilters.payment_method}
                                onValueChange={(value) => handleFilterChange('payment_method', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All methods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All methods</SelectItem>
                                    {paymentMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {getPaymentMethodDisplay(method)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={localFilters.status}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Order #, cashier, product..."
                                    value={localFilters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="gap-2"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                        <Button onClick={applyFilters} className="gap-2" size="sm">
                            <Filter className="h-4 w-4" />
                            Apply Filters
                        </Button>
                    </div>
                </Card>

                {/* Results Summary */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing {orders.data.length} of {orders.total} orders
                    </p>
                </div>

                {/* Orders Display */}
                {orders.data.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No orders found matching your criteria.</p>
                    </Card>
                ) : (
                    <>
                        {/* Responsive Table Views */}

                        {/* Large Desktop Table View (xl and up) */}
                        <div className="hidden xl:block bg-white rounded-lg border">
                            <div className="overflow-auto max-h-[500px]">
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cashier
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Payment
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </p>
                                                        <p className="text-xs text-gray-500">ID: {order.id}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {formatDate(order.created_at)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDateTime(order.created_at)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 capitalize">
                                                            {order.user.role}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-gray-900 mb-1">
                                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                        </p>
                                                        <div className="space-y-1">
                                                            {order.items.slice(0, 2).map((item) => (
                                                                <p key={item.id} className="text-xs text-gray-600">
                                                                    {item.quantity}× {item.product_name}
                                                                </p>
                                                            ))}
                                                            {order.items.length > 2 && (
                                                                <p className="text-xs text-gray-400">
                                                                    +{order.items.length - 2} more...
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {getPaymentMethodDisplay(order.payment_method)}
                                                        </p>
                                                        {order.payment_reference && (
                                                            <p className="text-xs text-gray-500">
                                                                Ref: {order.payment_reference}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(order.total_amount)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Subtotal: {formatCurrency(order.subtotal)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/orders/${order.id}/receipt`}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="View Receipt"
                                                        >
                                                            <Receipt className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tablet Compact Table View (lg to xl) */}
                        <div className="hidden lg:block xl:hidden bg-white rounded-lg border">
                            <div className="overflow-auto max-h-[500px]">
                                <table className="w-full min-w-[600px]">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Cashier
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {getPaymentMethodDisplay(order.payment_method)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-900">
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-900">
                                                        {order.user.name}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(order.total_amount)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                            </div>
                        </div>

                        {/* Medium Device Table View (md to lg) */}
                        <div className="hidden md:block lg:hidden bg-white rounded-lg border">
                            <div className="overflow-auto max-h-[500px]">
                                <table className="w-full min-w-[400px]">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(order.created_at)} • {getPaymentMethodDisplay(order.payment_method)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(order.total_amount)}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Table View (sm and below) */}
                        <div className="md:hidden bg-white rounded-lg border">
                            <div className="overflow-auto max-h-[500px]">
                                <table className="w-full min-w-[300px]">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(order.created_at)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {getPaymentMethodDisplay(order.payment_method)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatCurrency(order.total_amount)}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex flex-wrap justify-center gap-1">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-md min-w-[32px] text-center ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}