import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { EditIcon, PlusIcon, TrashIcon } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    color: string;
}

interface ProductSize {
    id?: number;
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
    sizes: ProductSize[];
    is_low_stock: boolean;
    is_out_of_stock: boolean;
}

interface ProductFormData {
    name: string;
    description: string;
    price: string;
    category_id: string;
    stock_quantity: string;
    low_stock_threshold: string;
    sku: string;
    image_url: string;
    is_active: boolean;
    track_inventory: boolean;
    sizes: ProductSize[];
}

const initialFormData: ProductFormData = {
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '0',
    low_stock_threshold: '10',
    sku: '',
    image_url: '',
    is_active: true,
    track_inventory: true,
    sizes: [],
};

interface Props {
    products: Product[];
    categories: Category[];
}

export function ProductManagement({ products, categories }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category.id.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleCreateProduct = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            alert('Product name is required');
            return;
        }
        if (!formData.category_id) {
            alert('Category is required');
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Valid price is required');
            return;
        }

        router.post('/products', {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity),
            low_stock_threshold: parseInt(formData.low_stock_threshold),
            category_id: parseInt(formData.category_id),
            sizes: formData.sizes.length > 0 ? JSON.stringify(formData.sizes) : undefined,
        }, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData(initialFormData);
            },
        });
    };

    const handleEditProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingProduct) return;

        // Validate required fields
        if (!formData.name.trim()) {
            alert('Product name is required');
            return;
        }
        if (!formData.category_id) {
            alert('Category is required');
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            alert('Valid price is required');
            return;
        }

        router.put(`/products/${editingProduct.id}`, {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity),
            low_stock_threshold: parseInt(formData.low_stock_threshold),
            category_id: parseInt(formData.category_id),
            sizes: formData.sizes.length > 0 ? JSON.stringify(formData.sizes) : undefined,
        }, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
                setFormData(initialFormData);
            },
        });
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category_id: product.category.id.toString(),
            stock_quantity: product.stock_quantity.toString(),
            low_stock_threshold: product.low_stock_threshold.toString(),
            sku: product.sku || '',
            image_url: product.image_url || '',
            is_active: product.is_active,
            track_inventory: product.track_inventory,
            sizes: product.sizes || [],
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteProduct = (product: Product) => {
        router.delete(`/products/${product.id}`, {
            onSuccess: () => {
                // Success handled by redirect
            },
        });
    };

    const getStockBadgeVariant = (product: Product) => {
        if (product.is_out_of_stock) return 'destructive';
        if (product.is_low_stock) return 'secondary';
        return 'outline';
    };

    const getStockBadgeText = (product: Product) => {
        if (product.is_out_of_stock) return 'Out of Stock';
        if (product.is_low_stock) return 'Low Stock';
        return 'In Stock';
    };

    const addSize = () => {
        const newSize: ProductSize = {
            name: '',
            price: 0,
            is_default: formData.sizes.length === 0,
            sort_order: formData.sizes.length,
        };
        setFormData({ ...formData, sizes: [...formData.sizes, newSize] });
    };

    const removeSize = (index: number) => {
        const updatedSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: updatedSizes });
    };

    const updateSize = (index: number, field: keyof ProductSize, value: any) => {
        const updatedSizes = [...formData.sizes];
        updatedSizes[index] = { ...updatedSizes[index], [field]: value };
        setFormData({ ...formData, sizes: updatedSizes });
    };

    const setDefaultSize = (index: number) => {
        const updatedSizes = formData.sizes.map((size, i) => ({
            ...size,
            is_default: i === index,
        }));
        setFormData({ ...formData, sizes: updatedSizes });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">

                <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                    setIsCreateModalOpen(open);
                    if (open) {
                        setFormData(initialFormData);
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>
                                Fill in the product details below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateProduct} className="flex flex-col overflow-hidden">
                            <div className="grid grid-cols-2 gap-4 py-4 overflow-y-auto pr-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name*</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category*</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price*</Label>
                                    <Input
                                        id="price"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow empty, digits, and one decimal point
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                setFormData({ ...formData, price: value });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                                    <Input
                                        id="low_stock_threshold"
                                        type="number"
                                        min="0"
                                        value={formData.low_stock_threshold}
                                        onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="image_url">Image URL</Label>
                                    <Input
                                        id="image_url"
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="track_inventory"
                                        checked={formData.track_inventory}
                                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, track_inventory: checked })}
                                    />
                                    <Label htmlFor="track_inventory">Track Inventory</Label>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Product Sizes (Optional)</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addSize}>
                                            <PlusIcon className="w-4 h-4 mr-1" />
                                            Add Size
                                        </Button>
                                    </div>
                                    {formData.sizes.length > 0 && (
                                        <div className="space-y-2 border rounded-md p-3">
                                            {formData.sizes.map((size, index) => (
                                                <div key={index} className="flex gap-2 items-end">
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs">Size Name</Label>
                                                        <Input
                                                            placeholder="e.g., Small, Medium"
                                                            value={size.name}
                                                            onChange={(e) => updateSize(index, 'name', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs">Price</Label>
                                                        <Input
                                                            type="text"
                                                            inputMode="decimal"
                                                            placeholder="0.00"
                                                            value={size.price}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                                    updateSize(index, 'price', value === '' ? 0 : parseFloat(value) || 0);
                                                                }
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant={size.is_default ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setDefaultSize(index)}
                                                            title="Set as default"
                                                        >
                                                            Default
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeSize(index)}
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Add different sizes with different prices. If no sizes are added, the base price will be used.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Product</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Products ({filteredProducts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[600px] overflow-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                {product.description && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {product.description}
                                                    </div>
                                                )}
                                                {product.sku && (
                                                    <div className="text-xs text-muted-foreground">
                                                        SKU: {product.sku}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge style={{ backgroundColor: product.category.color }}>
                                                {product.category.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>₱{Number(product.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {product.track_inventory ? (
                                                    <>
                                                        <span>{product.stock_quantity}</span>
                                                        <Badge variant={getStockBadgeVariant(product)}>
                                                            {getStockBadgeText(product)}
                                                        </Badge>
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground">Not tracked</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditModal(product)}
                                                >
                                                    <EditIcon className="w-4 h-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="sm">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteProduct(product)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Product Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) {
                    setFormData(initialFormData);
                    setEditingProduct(null);
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update the product details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditProduct} className="flex flex-col overflow-hidden">
                        <div className="grid grid-cols-2 gap-4 py-4 overflow-y-auto pr-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Product Name*</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category*</Label>
                                <Select
                                    value={formData.category_id}
                                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price*</Label>
                                <Input
                                    id="edit-price"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty, digits, and one decimal point
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            setFormData({ ...formData, price: value });
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-sku">SKU</Label>
                                <Input
                                    id="edit-sku"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
                                <Input
                                    id="edit-stock_quantity"
                                    type="number"
                                    min="0"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-low_stock_threshold">Low Stock Threshold</Label>
                                <Input
                                    id="edit-low_stock_threshold"
                                    type="number"
                                    min="0"
                                    value={formData.low_stock_threshold}
                                    onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="edit-image_url">Image URL</Label>
                                <Input
                                    id="edit-image_url"
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="edit-is_active">Active</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-track_inventory"
                                    checked={formData.track_inventory}
                                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, track_inventory: checked })}
                                />
                                <Label htmlFor="edit-track_inventory">Track Inventory</Label>
                            </div>
                            <div className="col-span-2 space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Product Sizes (Optional)</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addSize}>
                                        <PlusIcon className="w-4 h-4 mr-1" />
                                        Add Size
                                    </Button>
                                </div>
                                {formData.sizes.length > 0 && (
                                    <div className="space-y-2 border rounded-md p-3">
                                        {formData.sizes.map((size, index) => (
                                            <div key={index} className="flex gap-2 items-end">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-xs">Size Name</Label>
                                                    <Input
                                                        placeholder="e.g., Small, Medium"
                                                        value={size.name}
                                                        onChange={(e) => updateSize(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-xs">Price</Label>
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        placeholder="0.00"
                                                        value={size.price}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                                updateSize(index, 'price', value === '' ? 0 : parseFloat(value) || 0);
                                                            }
                                                        }}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={size.is_default ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setDefaultSize(index)}
                                                        title="Set as default"
                                                    >
                                                        Default
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeSize(index)}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Add different sizes with different prices. If no sizes are added, the base price will be used.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}