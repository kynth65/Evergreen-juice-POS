import { Head } from '@inertiajs/react';

interface ProductSize {
    id: number;
    product_id: number;
    name: string;
    price: string;
    is_default: boolean;
    sort_order: number;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image_url: string | null;
    sizes: ProductSize[];
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
    const formatPrice = (price: string) => {
        return `₱${parseFloat(price).toFixed(2)}`;
    };

    return (
        <>
            <Head title="Menu Board" />

            <div className="h-screen overflow-hidden bg-[#f5f1e8] p-6">
                <div className="flex h-full flex-col">
                    {/* Minimal Header */}
                    <div className="mb-4 text-center">
                        <h1 className="font-afacad text-3xl font-bold tracking-wide text-gray-900">
                            EVERGREEN JUICE
                        </h1>
                        <p className="font-afacad text-sm tracking-widest text-green-700 uppercase">
                            Menu
                        </p>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-1 overflow-hidden">
                        {categories.length > 0 ? (
                            <div className="grid h-full grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex flex-col overflow-hidden rounded-lg bg-white p-4 shadow-sm"
                                    >
                                        {/* Category Header - Minimal */}
                                        <div className="mb-3 text-center">
                                            <h2 className="font-afacad text-xl font-bold tracking-wide text-green-700 uppercase">
                                                {category.name}
                                            </h2>
                                            <div className="mx-auto mt-1 h-0.5 w-16 bg-green-700"></div>
                                        </div>

                                        {/* Products List */}
                                        <div className="flex-1 space-y-3 overflow-y-auto">
                                            {category.products.map(
                                                (product) => (
                                                    <div
                                                        key={product.id}
                                                        className="border-b border-dotted border-gray-300 pb-3 last:border-0"
                                                    >
                                                        {/* Product Name */}
                                                        <h3 className="font-afacad mb-1 text-base leading-tight font-semibold text-gray-900">
                                                            {product.name}
                                                        </h3>

                                                        {product.description && (
                                                            <p className="mb-2 text-xs leading-relaxed text-gray-500">
                                                                {
                                                                    product.description
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Prices */}
                                                        {product.sizes &&
                                                        product.sizes.length >
                                                            0 ? (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <div className="flex flex-wrap gap-3">
                                                                    {product.sizes.map(
                                                                        (
                                                                            size,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    size.id
                                                                                }
                                                                            >
                                                                                <span className="text-gray-500">
                                                                                    {
                                                                                        size.name
                                                                                    }
                                                                                </span>
                                                                                <span className="font-afacad ml-1 font-bold text-green-700">
                                                                                    {formatPrice(
                                                                                        size.price,
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-afacad font-bold text-green-700">
                                                                    {formatPrice(
                                                                        product.price,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <p className="font-afacad text-xl font-medium text-gray-600">
                                        No menu items available
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                ::-webkit-scrollbar {
                    width: 4px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 2px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </>
    );
}
