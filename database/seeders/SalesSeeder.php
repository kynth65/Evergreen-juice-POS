<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\User;
use Illuminate\Database\Seeder;

class SalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('role', ['admin', 'cashier'])->get();
        $products = Product::with('sizes')->active()->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Please run UserSeeder and ProductSeeder first.');

            return;
        }

        $paymentMethods = ['cash', 'card', 'digital_wallet'];

        // Generate 300 orders over the past 90 days for realistic month-over-month comparison
        // This ensures we have data for current month, previous month, and historical trends
        for ($i = 0; $i < 300; $i++) {
            $daysAgo = rand(0, 90);
            $hoursAgo = rand(8, 20); // Business hours 8AM-8PM
            $minutesAgo = rand(0, 59);

            $createdAt = now()
                ->subDays($daysAgo)
                ->setHour($hoursAgo)
                ->setMinute($minutesAgo);

            // Calculate order totals first
            $itemCount = rand(1, 5);
            $subtotal = 0;
            $orderItems = [];

            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $productSize = $product->sizes->random();
                $quantity = rand(1, 3);
                $lineTotal = $productSize->price * $quantity;

                $orderItems[] = [
                    'product' => $product,
                    'productSize' => $productSize,
                    'quantity' => $quantity,
                    'lineTotal' => $lineTotal,
                ];

                $subtotal += $lineTotal;
            }

            // Apply discount randomly (10% of orders)
            $discountAmount = rand(0, 10) === 0 ? round($subtotal * 0.1, 2) : 0;
            $totalAmount = $subtotal - $discountAmount;

            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

            // Add cash amount if payment method is cash
            $cashAmount = null;
            if ($paymentMethod === 'cash') {
                // Random cash amounts that would make sense
                $roundAmounts = [100, 200, 500, 1000];
                $cashAmount = $roundAmounts[array_rand($roundAmounts)];
                while ($cashAmount < $totalAmount) {
                    $cashAmount += 100;
                }
            }

            // Create order with all calculated values
            $order = Order::create([
                'user_id' => $users->random()->id,
                'status' => 'completed',
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'payment_reference' => rand(1000, 9999),
                'cash_amount' => $cashAmount,
                'notes' => rand(0, 10) > 7 ? 'Customer requested extra ice' : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
                'completed_at' => $createdAt->copy()->addMinutes(rand(2, 10)),
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product']->id,
                    'product_size_id' => $item['productSize']->id,
                    'product_name' => $item['product']->name,
                    'size_name' => $item['productSize']->name,
                    'unit_price' => $item['productSize']->price,
                    'quantity' => $item['quantity'],
                    'line_total' => $item['lineTotal'],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }

        $this->command->info('Created 300 sample sales orders over 90 days for realistic analytics.');
    }
}
