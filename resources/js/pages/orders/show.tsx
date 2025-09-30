import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeftIcon, PrinterIcon, ReceiptIcon } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    product: {
        name: string;
        category?: {
            name: string;
        };
    };
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
    user?: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Order History',
            href: '/history',
        },
        {
            title: `Order ${order.order_number}`,
            href: '#',
        },
    ];

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
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
                return method;
        }
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order ${order.order_number}`} />

            <div className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Order {order.order_number}</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            Created on {formatDateTime(order.created_at)}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Link href="/history">
                            <Button variant="outline" className="gap-2 w-full sm:w-auto" size="sm">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back to Orders
                            </Button>
                        </Link>
                        <Link href={`/orders/${order.id}/receipt`}>
                            <Button className="gap-2 w-full sm:w-auto" size="sm">
                                <ReceiptIcon className="w-4 h-4" />
                                View Receipt
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                        {/* Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.product_name}</h4>
                                                {item.product.category && (
                                                    <p className="text-sm text-gray-600">
                                                        {item.product.category.name}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} × ₱{Number(item.unit_price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">₱{Number(item.line_total).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4 lg:space-y-6">
                        {/* Status & Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Order Number:</span>
                                        <span className="font-medium">{order.order_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Created:</span>
                                        <span>{formatDateTime(order.created_at)}</span>
                                    </div>
                                    {order.completed_at && (
                                        <div className="flex justify-between">
                                            <span>Completed:</span>
                                            <span>{formatDateTime(order.completed_at)}</span>
                                        </div>
                                    )}
                                    {order.user && (
                                        <div className="flex justify-between">
                                            <span>Cashier:</span>
                                            <span>{order.user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <span className="font-medium">{getPaymentMethodDisplay(order.payment_method)}</span>
                                    </div>
                                    {order.payment_reference && (
                                        <div className="flex justify-between">
                                            <span>Reference:</span>
                                            <span className="font-medium">{order.payment_reference}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    {order.discount_amount > 0 && (
                                        <>
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>₱{Number(order.subtotal).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount:</span>
                                                <span>-₱{Number(order.discount_amount).toFixed(2)}</span>
                                            </div>
                                            <Separator />
                                        </>
                                    )}
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>₱{Number(order.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}