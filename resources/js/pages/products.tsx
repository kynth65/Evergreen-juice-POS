import AppLayout from '@/layouts/app-layout';
import { ProductManagement } from '@/components/dashboard/product-management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

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

interface Category {
    id: number;
    name: string;
    color: string;
}

interface Props {
    products: Product[];
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Product Management',
        href: '/products',
    },
];

export default function Products({ products, categories }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="container mx-auto p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Product Management</h1>
                    <p className="text-gray-600">Manage your product inventory</p>
                </div>

                <ProductManagement products={products} categories={categories} />
            </div>
        </AppLayout>
    );
}