import { Head } from '@inertiajs/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { PrinterIcon, ArrowLeftIcon } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    size_name?: string;
    unit_price: number;
    quantity: number;
    line_total: number;
    product: {
        name: string;
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
    created_at: string;
    completed_at: string;
    user?: {
        name: string;
    };
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function Receipt({ order }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

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

    return (
        <>
            <Head title={`Receipt - ${order.order_number}`} />

            <div className="min-h-screen bg-gray-50 py-4 sm:py-8 print:bg-white print:py-0 px-4 sm:px-0">
                <div className="max-w-md mx-auto">
                    {/* Non-printable header */}
                    <div className="mb-4 sm:mb-6 print:hidden">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <Button
                                onClick={handleBack}
                                variant="outline"
                                className="gap-2 w-full sm:w-auto"
                                size="sm"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Back
                            </Button>
                            <Button onClick={handlePrint} className="gap-2 w-full sm:w-auto" size="sm">
                                <PrinterIcon className="w-4 h-4" />
                                Print Receipt
                            </Button>
                        </div>
                    </div>

                    {/* Receipt */}
                    <Card className="shadow-lg print:shadow-none print:border-none">
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-green-600 mb-2">EvergreenJuice</h1>
                                <p className="text-sm text-gray-600">Fresh. Healthy. Delicious.</p>
                                <p className="text-xs text-gray-500 mt-1">123 Juice Street, Healthy City</p>
                                <p className="text-xs text-gray-500">Phone: (555) 123-JUICE</p>
                            </div>

                            <Separator className="my-6" />

                            {/* Order Details */}
                            <div className="space-y-2 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="font-medium">Order #:</span>
                                    <span>{order.order_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Date:</span>
                                    <span>{formatDateTime(order.created_at)}</span>
                                </div>
                                {order.user && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Cashier:</span>
                                        <span>{order.user.name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="font-medium">Payment:</span>
                                    <span>{getPaymentMethodDisplay(order.payment_method)}</span>
                                </div>
                                {order.payment_reference && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Reference:</span>
                                        <span>{order.payment_reference}</span>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            {/* Items */}
                            <div className="space-y-3 mb-6">
                                <h3 className="font-semibold text-lg">Items</h3>
                                {order.items.map(item => (
                                    <div key={item.id} className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {item.product_name}
                                                    {item.size_name && (
                                                        <span className="ml-1 text-sm font-normal text-gray-500">
                                                            ({item.size_name})
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} × ₱{Number(item.unit_price).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold">₱{Number(item.line_total).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            {/* Totals */}
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
                                        <Separator className="my-2" />
                                    </>
                                )}
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>₱{Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            {order.notes && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <p className="font-medium text-sm mb-2">Notes:</p>
                                        <p className="text-sm text-gray-600">{order.notes}</p>
                                    </div>
                                </>
                            )}

                            <Separator className="my-6" />

                            {/* Footer */}
                            <div className="text-center space-y-2">
                                <p className="text-sm font-medium">Thank you for your order!</p>
                                <p className="text-xs text-gray-500">Have a healthy day!</p>
                                <p className="text-xs text-gray-500 mt-4">
                                    Follow us on social media @evergreenjuice
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}