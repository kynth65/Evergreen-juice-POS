<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'stock_quantity' => $product->stock_quantity,
                    'low_stock_threshold' => $product->low_stock_threshold,
                    'sku' => $product->sku,
                    'image_url' => $product->image_url,
                    'is_active' => $product->is_active,
                    'track_inventory' => $product->track_inventory,
                    'category' => [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                        'color' => $product->category->color,
                    ],
                    'is_low_stock' => $product->isLowStock(),
                    'is_out_of_stock' => $product->isOutOfStock(),
                ];
            });

        $categories = Category::active()->orderBy('name')->get([
            'id', 'name', 'color',
        ]);

        return Inertia::render('products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock_quantity' => 'integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'sku' => 'nullable|string|unique:products,sku',
            'image_url' => 'nullable|url',
            'is_active' => 'boolean',
            'track_inventory' => 'boolean',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock_quantity' => 'integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'sku' => ['nullable', 'string', Rule::unique('products', 'sku')->ignore($product->id)],
            'image_url' => 'nullable|url',
            'is_active' => 'boolean',
            'track_inventory' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
