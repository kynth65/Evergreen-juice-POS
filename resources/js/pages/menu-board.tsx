import { Head } from '@inertiajs/react';
import { Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image_url: string | null;
}

interface Category {
    id: number;
    name: string;
    description: string | null;
    products: Product[];
}

interface MenuBoardProps {
    categories: Category[];
}

export default function MenuBoard({ categories }: MenuBoardProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatPrice = (price: string) => {
        return `₱${parseFloat(price).toFixed(2)}`;
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Menu Board" />

            <div className="flex h-screen flex-col overflow-hidden bg-white">
                {/* Header */}
                <div className="flex-shrink-0 border-b-2 border-green-600 bg-white px-4 py-2 sm:px-6 sm:py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Leaf className="h-6 w-6 text-green-600 sm:h-8 sm:w-8" />
                            <div>
                                <h1 className="font-afacad text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                                    EvergreenJuice Menu
                                </h1>
                                <p className="text-xs font-medium text-gray-600 sm:text-sm">
                                    Fresh Squeezed Daily
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-afacad text-lg font-semibold text-gray-900 sm:text-xl md:text-2xl">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatDate(currentTime)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Content - No Scrolling */}
                <div className="flex flex-1 gap-3 overflow-hidden px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:gap-6 md:px-8">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex flex-1 flex-col"
                            >
                                {/* Category Header */}
                                <div className="mb-2 flex-shrink-0 border-b-2 border-green-600 pb-1.5 sm:mb-3 sm:pb-2">
                                    <h2 className="font-afacad text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                                            {category.description}
                                        </p>
                                    )}
                                </div>

                                {/* Products List - Fill available space */}
                                <div className="flex flex-1 flex-col justify-between">
                                    {category.products.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`flex-1 ${index < category.products.length - 1 ? 'border-b border-gray-100' : ''} py-2 sm:py-3`}
                                        >
                                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-afacad text-base font-bold leading-tight text-gray-900 sm:text-lg md:text-xl">
                                                        {product.name}
                                                    </h3>
                                                    {product.description && (
                                                        <p className="mt-0.5 text-xs leading-snug text-gray-600 sm:text-sm">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="font-afacad text-base font-bold text-green-600 sm:text-lg md:text-xl">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-1 items-center justify-center">
                            <div className="text-center">
                                <Leaf className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-4 text-lg font-medium text-gray-500">
                                    No menu items available at the moment
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-2 text-center sm:px-6">
                    <p className="text-xs font-medium text-gray-700 sm:text-sm">
                        Thank you for choosing EvergreenJuice • Fresh • Healthy
                        • Delicious
                    </p>
                </div>
            </div>
        </>
    );
}
