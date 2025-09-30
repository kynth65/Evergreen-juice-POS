<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->with(['activeProducts'])
            ->orderBy('name')
            ->get();

        $products = Product::active()
            ->with('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/index', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,card,digital_wallet',
            'payment_reference' => 'nullable|required_unless:payment_method,cash|string',
            'notes' => 'nullable|string|max:500',
            'cash_amount' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'subtotal' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'payment_method' => $request->payment_method,
                'payment_reference' => $request->payment_reference,
                'cash_amount' => $request->cash_amount,
                'notes' => $request->notes,
            ]);

            $subtotal = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock availability
                if ($product->track_inventory && $product->stock_quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                $lineTotal = $product->price * $item['quantity'];
                $subtotal += $lineTotal;

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ]);

                // Update stock
                if ($product->track_inventory) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'total_amount' => $subtotal,
            ]);

            // Mark order as completed
            $order->markAsCompleted();

            return redirect()->route('orders.receipt', $order)
                ->with('success', 'Order completed successfully!');
        });
    }
}
