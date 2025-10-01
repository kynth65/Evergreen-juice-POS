import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2Icon,
    LayoutDashboard,
    MinusIcon,
    PlusIcon,
    ShoppingCartIcon,
    XIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '../../components/ui/sheet';

interface Category {
    id: number;
    name: string;
    description: string;
    color: string;
    products?: Product[];
}

interface ProductSize {
    id: number;
    name: string;
    price: number;
    is_default: boolean;
    sort_order: number;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: Category;
    is_active: boolean;
    track_inventory: boolean;
    sizes: ProductSize[];
}

interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: ProductSize;
}

interface Props {
    categories: Category[];
    products: Product[];
}

// Cart content component (reused in both desktop sidebar and mobile sheet)
function CartContent({
    cart,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getTotal,
}: {
    cart: CartItem[];
    updateQuantity: (index: number, quantity: number) => void;
    removeFromCart: (index: number) => void;
    getSubtotal: () => number;
    getTotal: () => number;
}) {
    return (
        <>
            {cart.length === 0 ? (
                <div className="flex h-48 items-center justify-center">
                    <p className="text-center text-sm text-gray-500">
                        Cart is empty
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {cart.map((item, index) => {
                        const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                        return (
                        <div
                            key={`${item.product.id}-${item.selectedSize?.id || 'no-size'}-${index}`}
                            className="flex flex-col gap-2 rounded-lg border-2 bg-white p-2.5 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:gap-0 sm:p-3"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                    {item.product.name}
                                    {item.selectedSize && (
                                        <span className="ml-1 text-xs font-normal text-gray-500">
                                            ({item.selectedSize.name})
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-600">
                                    ₱{Number(itemPrice).toFixed(2)} each
                                </p>
                            </div>

                            <div className="flex flex-shrink-0 items-center gap-1.5 sm:ml-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 transition-transform active:scale-90 sm:h-8 sm:w-8"
                                    onClick={() =>
                                        updateQuantity(
                                            index,
                                            item.quantity - 1,
                                        )
                                    }
                                >
                                    <MinusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </Button>
                                <span className="w-7 text-center text-sm font-bold sm:w-8">
                                    {item.quantity}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 p-0 transition-transform active:scale-90 sm:h-8 sm:w-8"
                                    onClick={() =>
                                        updateQuantity(
                                            index,
                                            item.quantity + 1,
                                        )
                                    }
                                >
                                    <PlusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 w-7 p-0 transition-transform active:scale-90 sm:h-8 sm:w-8"
                                    onClick={() =>
                                        removeFromCart(index)
                                    }
                                >
                                    <XIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </Button>
                            </div>
                        </div>
                    );})}
                </div>
            )}

            {cart.length > 0 && (
                <>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
                        <span className="text-base font-bold">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                            ₱{getTotal().toFixed(2)}
                        </span>
                    </div>
                </>
            )}
        </>
    );
}

// Payment form component (reused in both desktop and mobile)
function PaymentForm({
    paymentMethod,
    setPaymentMethod,
    cashAmount,
    setCashAmount,
    paymentReference,
    setPaymentReference,
    notes,
    setNotes,
    getTotal,
    getChange,
    handleOrderReview,
}: {
    paymentMethod: string;
    setPaymentMethod: (value: string) => void;
    cashAmount: string;
    setCashAmount: (value: string) => void;
    paymentReference: string;
    setPaymentReference: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    getTotal: () => number;
    getChange: () => number;
    handleOrderReview: () => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="payment-method" className="text-sm font-semibold">
                    Payment Method
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-1.5 h-11 border-2 font-medium">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="digital_wallet">
                            Digital Wallet
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {paymentMethod === 'cash' && (
                <div>
                    <Label htmlFor="cash-amount" className="text-sm font-semibold">
                        Cash Amount
                    </Label>
                    <Input
                        id="cash-amount"
                        type="number"
                        step="0.01"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Enter cash amount"
                        className="mt-1.5 h-11 border-2 text-base"
                    />
                    {cashAmount && parseFloat(cashAmount) >= getTotal() && (
                        <div className="mt-2 rounded-lg border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-green-800">
                                    Change:
                                </span>
                                <span className="text-lg font-bold text-green-700">
                                    ₱{getChange().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                    {cashAmount && parseFloat(cashAmount) < getTotal() && (
                        <div className="mt-2 rounded-lg border-2 border-red-300 bg-red-50 p-3">
                            <span className="font-semibold text-red-800">
                                Insufficient cash amount
                            </span>
                        </div>
                    )}
                </div>
            )}

            {paymentMethod !== 'cash' && (
                <div>
                    <Label
                        htmlFor="payment-reference"
                        className="text-sm font-semibold"
                    >
                        Reference Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="payment-reference"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Transaction reference (required)"
                        className="mt-1.5 h-11 border-2 text-base"
                        required
                    />
                </div>
            )}

            <div>
                <Label htmlFor="notes" className="text-sm font-semibold">
                    Notes (Optional)
                </Label>
                <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Order notes"
                    className="mt-1.5 h-11 border-2 text-base"
                />
            </div>

            <Button
                className="h-12 w-full text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
                onClick={handleOrderReview}
                disabled={
                    (paymentMethod === 'cash' &&
                        (!cashAmount || parseFloat(cashAmount) < getTotal())) ||
                    (paymentMethod !== 'cash' && !paymentReference)
                }
            >
                Review Order - ₱{getTotal().toFixed(2)}
            </Button>
        </div>
    );
}

export default function PosIndex({ categories, products }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [paymentReference, setPaymentReference] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [cashAmount, setCashAmount] = useState<string>('');
    const [showOrderReview, setShowOrderReview] = useState<boolean>(false);
    const [showMobileCart, setShowMobileCart] = useState<boolean>(false);
    const [showDesktopPayment, setShowDesktopPayment] = useState<boolean>(false);
    const [confirmationProduct, setConfirmationProduct] =
        useState<Product | null>(null);
    const confirmationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [sizeSelectionProduct, setSizeSelectionProduct] = useState<Product | null>(null);
    const [selectedSizeForProduct, setSelectedSizeForProduct] = useState<ProductSize | null>(null);
    const [sizeSelectionQuantity, setSizeSelectionQuantity] = useState<number>(1);

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category.id === selectedCategory)
        : products;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (confirmationTimeoutRef.current) {
                clearTimeout(confirmationTimeoutRef.current);
            }
        };
    }, []);

    const addToCart = (product: Product, size?: ProductSize, quantity: number = 1) => {
        // If product has sizes and no size is selected, show size selection dialog
        if (product.sizes && product.sizes.length > 0 && !size) {
            setSizeSelectionProduct(product);
            // Set default size if available
            const defaultSize = product.sizes.find(s => s.is_default) || product.sizes[0];
            setSelectedSizeForProduct(defaultSize);
            setSizeSelectionQuantity(1);
            return;
        }

        const existingItem = cart.find(
            (item) => item.product.id === product.id && item.selectedSize?.id === size?.id,
        );

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.product.id === product.id && item.selectedSize?.id === size?.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item,
                ),
            );
        } else {
            setCart([...cart, { product, quantity, selectedSize: size }]);
        }

        // Show confirmation toast
        // Clear any existing timeout to prevent stacking
        if (confirmationTimeoutRef.current) {
            clearTimeout(confirmationTimeoutRef.current);
        }

        setConfirmationProduct(product);

        // Auto-dismiss after 3 seconds
        confirmationTimeoutRef.current = setTimeout(() => {
            setConfirmationProduct(null);
            confirmationTimeoutRef.current = null;
        }, 3000);
    };

    const confirmSizeSelection = () => {
        if (sizeSelectionProduct && selectedSizeForProduct) {
            addToCart(sizeSelectionProduct, selectedSizeForProduct, sizeSelectionQuantity);
            setSizeSelectionProduct(null);
            setSelectedSizeForProduct(null);
            setSizeSelectionQuantity(1);
        }
    };

    const updateQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(index);
            return;
        }

        setCart(
            cart.map((item, i) =>
                i === index ? { ...item, quantity } : item,
            ),
        );
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const getSubtotal = () => {
        return cart.reduce(
            (total, item) => {
                const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                return total + Number(itemPrice) * item.quantity;
            },
            0,
        );
    };

    const getTotal = () => {
        return getSubtotal();
    };

    const getChange = () => {
        if (paymentMethod !== 'cash' || !cashAmount) return 0;
        const cash = parseFloat(cashAmount);
        const total = getTotal();
        return cash >= total ? cash - total : 0;
    };

    const handleOrderReview = () => {
        if (cart.length === 0) return;
        setShowMobileCart(false);
        setShowDesktopPayment(false);
        setShowOrderReview(true);
    };

    const handleCheckout = () => {
        const orderItems = cart.map((item) => ({
            product_id: item.product.id,
            product_size_id: item.selectedSize?.id || null,
            quantity: item.quantity,
        }));

        router.post(
            '/pos/checkout',
            {
                items: orderItems,
                payment_method: paymentMethod,
                payment_reference: paymentReference || null,
                notes: notes || null,
                cash_amount:
                    paymentMethod === 'cash'
                        ? parseFloat(cashAmount) || null
                        : null,
            },
            {
                onSuccess: () => {
                    setCart([]);
                    setPaymentReference('');
                    setNotes('');
                    setCashAmount('');
                    setShowOrderReview(false);
                },
            },
        );
    };

    const handleBackToEdit = () => {
        setShowOrderReview(false);
        // On desktop (lg and up), show payment sheet. On mobile, show cart.
        if (window.innerWidth >= 1024) {
            setShowDesktopPayment(true);
        } else {
            setShowMobileCart(true);
        }
    };

    return (
        <>
            <Head title="POS System" />

            <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
                {/* Fixed Header */}
                <div className="flex-shrink-0 border-b bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-[1800px] items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Point of Sale
                        </h1>
                        <Link href="/dashboard">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-[1800px] flex-1 overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
                    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
                        {/* Products Section */}
                        <div className="flex flex-col overflow-hidden">
                            {/* Category Filter */}
                            <div className="mb-4 flex flex-shrink-0 flex-wrap gap-2">
                                <Button
                                    variant={
                                        selectedCategory === null
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setSelectedCategory(null)}
                                    size="sm"
                                    className="h-9 px-4"
                                >
                                    All
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={
                                            selectedCategory === category.id
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            setSelectedCategory(category.id)
                                        }
                                        size="sm"
                                        className="h-9 px-4"
                                        style={{
                                            backgroundColor:
                                                selectedCategory === category.id
                                                    ? category.color
                                                    : undefined,
                                        }}
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Products Grid - Scrollable */}
                            <ScrollArea className="flex-1 pr-2">
                                <div className="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredProducts.map((product) => (
                                        <Card
                                            key={product.id}
                                            className="group cursor-pointer border-2 transition-all duration-200 hover:border-gray-400 hover:shadow-md active:scale-[0.98]"
                                            onClick={() => addToCart(product)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="line-clamp-2 text-base font-semibold leading-tight">
                                                            {product.name}
                                                        </h3>
                                                        <Badge
                                                            style={{
                                                                backgroundColor:
                                                                    product.category
                                                                        .color,
                                                            }}
                                                            className="flex-shrink-0 text-xs font-semibold text-white"
                                                        >
                                                            ₱
                                                            {Number(
                                                                product.price,
                                                            ).toFixed(2)}
                                                        </Badge>
                                                    </div>
                                                    <p className="line-clamp-2 text-xs leading-relaxed text-gray-600">
                                                        {product.description}
                                                    </p>

                                                    {product.track_inventory && (
                                                        <div className="mt-1 flex items-center justify-between border-t pt-2 text-xs">
                                                            <span className="text-gray-500">
                                                                Stock:{' '}
                                                                {product.stock_quantity}
                                                            </span>
                                                            {product.stock_quantity <=
                                                                10 && (
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="text-xs"
                                                                >
                                                                    Low
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Desktop Cart Section - Fixed Width */}
                        <div className="hidden flex-col gap-4 lg:flex">
                            <Card className="flex flex-col overflow-hidden shadow-lg">
                                <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-gray-50 to-gray-100 pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        Cart ({cart.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col p-4">
                                    <ScrollArea className="mb-4 h-[400px] pr-2">
                                        {cart.length === 0 ? (
                                            <div className="flex h-full items-center justify-center">
                                                <p className="text-center text-sm text-gray-500">
                                                    Cart is empty
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2.5">
                                                {cart.map((item, index) => {
                                                    const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                                                    return (
                                                    <div
                                                        key={`${item.product.id}-${item.selectedSize?.id || 'no-size'}-${index}`}
                                                        className="flex flex-col gap-2 rounded-lg border-2 bg-white p-2.5 transition-colors hover:bg-gray-50"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-semibold">
                                                                {item.product.name}
                                                                {item.selectedSize && (
                                                                    <span className="ml-1 text-xs font-normal text-gray-500">
                                                                        ({item.selectedSize.name})
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                ₱{Number(itemPrice).toFixed(2)} each
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-shrink-0 items-center justify-between gap-1.5">
                                                            <span className="text-sm font-bold text-gray-700">
                                                                Total: ₱{(Number(itemPrice) * item.quantity).toFixed(2)}
                                                            </span>
                                                            <div className="flex items-center gap-1.5">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 w-7 p-0 transition-transform active:scale-90"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            index,
                                                                            item.quantity - 1,
                                                                        )
                                                                    }
                                                                >
                                                                    <MinusIcon className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <span className="w-7 text-center text-sm font-bold">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 w-7 p-0 transition-transform active:scale-90"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            index,
                                                                            item.quantity + 1,
                                                                        )
                                                                    }
                                                                >
                                                                    <PlusIcon className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    className="h-7 w-7 p-0 transition-transform active:scale-90"
                                                                    onClick={() =>
                                                                        removeFromCart(index)
                                                                    }
                                                                >
                                                                    <XIcon className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );})}
                                            </div>
                                        )}
                                    </ScrollArea>

                                    {cart.length > 0 && (
                                        <>
                                            <Separator className="my-3" />
                                            <div className="mb-3 flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 shadow-sm">
                                                <span className="text-base font-bold">Total:</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₱{getTotal().toFixed(2)}
                                                </span>
                                            </div>
                                            <Button
                                                className="h-12 w-full text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                size="lg"
                                                onClick={() => setShowDesktopPayment(true)}
                                            >
                                                Payment
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Mobile Cart Button - Floating */}
                {cart.length > 0 && (
                    <Button
                        onClick={() => setShowMobileCart(true)}
                        className="fixed right-6 bottom-6 z-40 h-16 w-16 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 lg:hidden"
                        size="lg"
                    >
                        <div className="relative">
                            <ShoppingCartIcon className="h-7 w-7" />
                            <Badge className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 p-0 text-xs font-bold hover:bg-red-600">
                                {cart.length}
                            </Badge>
                        </div>
                    </Button>
                )}

                {/* Mobile Cart Sheet */}
                <Sheet open={showMobileCart} onOpenChange={setShowMobileCart}>
                    <SheetContent side="bottom" className="h-[90vh] p-0">
                        <div className="flex h-full flex-col">
                            <SheetHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 px-6 pt-6 pb-4 shadow-sm">
                                <SheetTitle className="flex items-center gap-2 text-xl">
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    Cart ({cart.length})
                                </SheetTitle>
                            </SheetHeader>

                            <ScrollArea className="flex-1 px-6 py-4">
                                <CartContent
                                    cart={cart}
                                    updateQuantity={updateQuantity}
                                    removeFromCart={removeFromCart}
                                    getSubtotal={getSubtotal}
                                    getTotal={getTotal}
                                />
                            </ScrollArea>

                            {cart.length > 0 && (
                                <div className="border-t bg-white px-6 py-4 shadow-lg">
                                    <PaymentForm
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                        cashAmount={cashAmount}
                                        setCashAmount={setCashAmount}
                                        paymentReference={paymentReference}
                                        setPaymentReference={setPaymentReference}
                                        notes={notes}
                                        setNotes={setNotes}
                                        getTotal={getTotal}
                                        getChange={getChange}
                                        handleOrderReview={handleOrderReview}
                                    />
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Payment Sheet */}
                <Sheet open={showDesktopPayment} onOpenChange={setShowDesktopPayment}>
                    <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl">
                        <div className="flex h-full flex-col">
                            <SheetHeader className="mb-8 border-b px-10 pb-6">
                                <SheetTitle className="text-2xl font-bold">Payment Details</SheetTitle>
                                <p className="mt-2 text-sm text-gray-600">
                                    Complete your payment information to proceed
                                </p>
                            </SheetHeader>

                            <ScrollArea className="flex-1 pr-2">
                                <div className="space-y-8 px-10 pb-6">
                                    {/* Order Total */}
                                    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">Order Total:</span>
                                            <span className="text-3xl font-bold text-green-600">
                                                ₱{getTotal().toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
                                        </p>
                                    </div>

                                    {/* Payment Form */}
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="desktop-payment-method" className="mb-2 text-base font-semibold">
                                                Payment Method
                                            </Label>
                                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                                <SelectTrigger id="desktop-payment-method" className="mt-2 h-12 border-2 text-base font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="digital_wallet">
                                                        Digital Wallet
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {paymentMethod === 'cash' && (
                                            <div>
                                                <Label htmlFor="desktop-cash-amount" className="mb-2 text-base font-semibold">
                                                    Cash Amount
                                                </Label>
                                                <Input
                                                    id="desktop-cash-amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={cashAmount}
                                                    onChange={(e) => setCashAmount(e.target.value)}
                                                    placeholder="Enter cash amount"
                                                    className="mt-2 h-12 border-2 text-base"
                                                />
                                                {cashAmount && parseFloat(cashAmount) >= getTotal() && (
                                                    <div className="mt-3 rounded-lg border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-base font-semibold text-green-800">
                                                                Change:
                                                            </span>
                                                            <span className="text-2xl font-bold text-green-700">
                                                                ₱{getChange().toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {cashAmount && parseFloat(cashAmount) < getTotal() && (
                                                    <div className="mt-3 rounded-lg border-2 border-red-300 bg-red-50 p-4">
                                                        <span className="text-base font-semibold text-red-800">
                                                            Insufficient cash amount
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {paymentMethod !== 'cash' && (
                                            <div>
                                                <Label
                                                    htmlFor="desktop-payment-reference"
                                                    className="mb-2 text-base font-semibold"
                                                >
                                                    Reference Number <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="desktop-payment-reference"
                                                    value={paymentReference}
                                                    onChange={(e) => setPaymentReference(e.target.value)}
                                                    placeholder="Enter transaction reference number"
                                                    className="mt-2 h-12 border-2 text-base"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="desktop-notes" className="mb-2 text-base font-semibold">
                                                Notes (Optional)
                                            </Label>
                                            <Input
                                                id="desktop-notes"
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Add any special instructions or notes"
                                                className="mt-2 h-12 border-2 text-base"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* Fixed Bottom Action */}
                            <div className="mt-6 border-t px-10 pt-6 pb-6">
                                <Button
                                    className="h-14 w-full text-lg font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    size="lg"
                                    onClick={handleOrderReview}
                                    disabled={
                                        (paymentMethod === 'cash' &&
                                            (!cashAmount || parseFloat(cashAmount) < getTotal())) ||
                                        (paymentMethod !== 'cash' && !paymentReference)
                                    }
                                >
                                    Review Order - ₱{getTotal().toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Order Review Modal - Modern Design */}
                {showOrderReview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
                        <Card className="flex h-[calc(100vh-16px)] max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden shadow-2xl sm:h-auto">
                            {/* Fixed Header */}
                            <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-gray-50 to-gray-100 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                                <CardTitle className="text-xl font-bold sm:text-2xl">
                                    Order Review
                                </CardTitle>
                                <p className="text-xs text-gray-600 sm:text-sm">
                                    Please review your order before completion
                                </p>
                            </CardHeader>

                            {/* Scrollable Content */}
                            <ScrollArea className="min-h-0 flex-1">
                                <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                                    {/* Order Items */}
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                                            Items ({cart.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {cart.map((item, index) => {
                                                const itemPrice = item.selectedSize ? item.selectedSize.price : item.product.price;
                                                return (
                                                <div
                                                    key={`${item.product.id}-${item.selectedSize?.id || 'no-size'}-${index}`}
                                                    className="flex items-center justify-between rounded-lg border-2 bg-gray-50 p-2.5 transition-colors hover:bg-gray-100 sm:p-3"
                                                >
                                                    <div className="min-w-0 flex-1 pr-2 sm:pr-3">
                                                        <p className="truncate text-sm font-medium sm:text-base">
                                                            {item.product.name}
                                                            {item.selectedSize && (
                                                                <span className="ml-1 text-xs font-normal text-gray-500">
                                                                    ({item.selectedSize.name})
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-600 sm:text-sm">
                                                            ₱
                                                            {Number(
                                                                itemPrice,
                                                            ).toFixed(2)}{' '}
                                                            × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="text-sm font-semibold sm:text-base">
                                                            ₱
                                                            {(
                                                                Number(
                                                                    itemPrice,
                                                                ) * item.quantity
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );})}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Order Summary */}
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                                            Order Summary
                                        </h3>
                                        <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-gray-900 sm:text-lg">Total:</span>
                                                <span className="text-xl font-bold text-green-600 sm:text-2xl">
                                                    ₱{getTotal().toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Payment Information */}
                                    <div>
                                        <h3 className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                                            Payment Details
                                        </h3>
                                        <div className="space-y-2 rounded-lg border-2 bg-gray-50 p-3 sm:p-4">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span className="font-medium text-gray-700">Payment Method:</span>
                                                <span className="font-semibold capitalize">
                                                    {paymentMethod.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </div>
                                            {paymentMethod === 'cash' &&
                                                cashAmount && (
                                                    <>
                                                        <Separator />
                                                        <div className="flex justify-between text-xs sm:text-sm">
                                                            <span className="font-medium text-gray-700">
                                                                Cash Amount:
                                                            </span>
                                                            <span className="font-semibold">
                                                                ₱
                                                                {parseFloat(
                                                                    cashAmount,
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between rounded-md bg-green-100 px-2 py-1.5 sm:px-3 sm:py-2">
                                                            <span className="text-sm font-semibold text-green-800 sm:text-base">Change:</span>
                                                            <span className="text-base font-bold text-green-700 sm:text-lg">
                                                                ₱
                                                                {getChange().toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            {paymentMethod !== 'cash' &&
                                                paymentReference && (
                                                    <>
                                                        <Separator />
                                                        <div className="flex justify-between gap-2 text-xs sm:text-sm">
                                                            <span className="font-medium text-gray-700">Reference:</span>
                                                            <span className="truncate font-mono font-semibold">
                                                                {paymentReference}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
                                            {notes && (
                                                <>
                                                    <Separator />
                                                    <div className="text-xs sm:text-sm">
                                                        <span className="block font-medium text-gray-700">
                                                            Notes:
                                                        </span>
                                                        <span className="mt-1 block text-gray-600">
                                                            {notes}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </ScrollArea>

                            {/* Fixed Footer with Action Buttons */}
                            <div className="flex-shrink-0 border-t bg-white p-4 sm:p-6">
                                <div className="flex gap-2 sm:gap-3">
                                    <Button
                                        variant="outline"
                                        className="h-11 flex-1 text-sm font-semibold sm:h-12 sm:text-base"
                                        onClick={handleBackToEdit}
                                    >
                                        Back to Edit
                                    </Button>
                                    <Button
                                        className="h-11 flex-1 text-sm font-semibold sm:h-12 sm:text-base"
                                        onClick={handleCheckout}
                                    >
                                        Complete Order
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Add to Cart Confirmation Toast */}
                {confirmationProduct && (
                    <div className="pointer-events-none fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 shadow-2xl">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                                <CheckCircle2Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-green-900">
                                    Added to cart
                                </p>
                                <p className="truncate text-sm text-green-700">
                                    {confirmationProduct.name}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Size Selection Dialog */}
                <Sheet open={!!sizeSelectionProduct} onOpenChange={(open) => !open && setSizeSelectionProduct(null)}>
                    <SheetContent className="px-6">
                        <SheetHeader>
                            <SheetTitle>Select Size</SheetTitle>
                        </SheetHeader>
                        {sizeSelectionProduct && (
                            <div className="mt-6 space-y-6">
                                <div>
                                    <p className="font-semibold text-lg">{sizeSelectionProduct.name}</p>
                                    <p className="text-sm text-gray-500">{sizeSelectionProduct.description}</p>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Choose a size:</Label>
                                    {sizeSelectionProduct.sizes.map((size) => (
                                        <Button
                                            key={size.id}
                                            variant={selectedSizeForProduct?.id === size.id ? "default" : "outline"}
                                            className="w-full justify-between h-16 px-5"
                                            onClick={() => setSelectedSizeForProduct(size)}
                                        >
                                            <span className="font-semibold text-base">{size.name}</span>
                                            <span className="text-lg font-bold">₱{Number(size.price).toFixed(2)}</span>
                                        </Button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Quantity:</Label>
                                    <div className="flex items-center justify-center gap-4 rounded-lg border-2 bg-gray-50 p-4">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="h-12 w-12 p-0"
                                            onClick={() => setSizeSelectionQuantity(Math.max(1, sizeSelectionQuantity - 1))}
                                            disabled={sizeSelectionQuantity <= 1}
                                        >
                                            <MinusIcon className="h-5 w-5" />
                                        </Button>
                                        <span className="min-w-[3rem] text-center text-2xl font-bold">
                                            {sizeSelectionQuantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="h-12 w-12 p-0"
                                            onClick={() => setSizeSelectionQuantity(sizeSelectionQuantity + 1)}
                                        >
                                            <PlusIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-14 text-base font-bold"
                                    onClick={confirmSizeSelection}
                                    disabled={!selectedSizeForProduct}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
