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
        $products = Product::with(['category', 'sizes'])
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
                    'sizes' => $product->sizes->map(function ($size) {
                        return [
                            'id' => $size->id,
                            'name' => $size->name,
                            'price' => $size->price,
                            'is_default' => $size->is_default,
                            'sort_order' => $size->sort_order,
                        ];
                    }),
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
            'sizes' => 'nullable|array',
            'sizes.*.name' => 'required|string|max:255',
            'sizes.*.price' => 'required|numeric|min:0',
            'sizes.*.is_default' => 'boolean',
        ]);

        $product = Product::create($validated);

        // Create sizes if provided
        if (isset($validated['sizes']) && is_array($validated['sizes'])) {
            foreach ($validated['sizes'] as $index => $sizeData) {
                $product->sizes()->create([
                    'name' => $sizeData['name'],
                    'price' => $sizeData['price'],
                    'is_default' => $sizeData['is_default'] ?? false,
                    'sort_order' => $index,
                ]);
            }
        }

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
            'sizes' => 'nullable|array',
            'sizes.*.id' => 'nullable|exists:product_sizes,id',
            'sizes.*.name' => 'required|string|max:255',
            'sizes.*.price' => 'required|numeric|min:0',
            'sizes.*.is_default' => 'boolean',
        ]);

        // Validate that all submitted size IDs belong to this product (IDOR protection)
        if (isset($validated['sizes']) && is_array($validated['sizes'])) {
            $submittedSizeIds = collect($validated['sizes'])->pluck('id')->filter();
            if ($submittedSizeIds->isNotEmpty()) {
                $validSizeIds = $product->sizes()->whereIn('id', $submittedSizeIds)->pluck('id');
                $invalidSizeIds = $submittedSizeIds->diff($validSizeIds);

                if ($invalidSizeIds->isNotEmpty()) {
                    abort(403, 'You can only update sizes that belong to this product.');
                }
            }
        }

        $product->update($validated);

        // Update sizes
        if (isset($validated['sizes']) && is_array($validated['sizes'])) {
            $submittedSizeIds = collect($validated['sizes'])->pluck('id')->filter();

            // Delete sizes that are no longer present
            $product->sizes()->whereNotIn('id', $submittedSizeIds)->delete();

            // Create or update sizes
            foreach ($validated['sizes'] as $index => $sizeData) {
                if (isset($sizeData['id'])) {
                    // Update existing size - find the actual model to use update() safely
                    $size = $product->sizes()->find($sizeData['id']);
                    if ($size) {
                        $size->update([
                            'name' => $sizeData['name'],
                            'price' => $sizeData['price'],
                            'is_default' => $sizeData['is_default'] ?? false,
                            'sort_order' => $index,
                        ]);
                    }
                } else {
                    // Create new size
                    $product->sizes()->create([
                        'name' => $sizeData['name'],
                        'price' => $sizeData['price'],
                        'is_default' => $sizeData['is_default'] ?? false,
                        'sort_order' => $index,
                    ]);
                }
            }
        } else {
            // If no sizes provided, delete all sizes
            $product->sizes()->delete();
        }

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
