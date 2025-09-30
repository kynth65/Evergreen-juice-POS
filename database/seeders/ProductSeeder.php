<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $freshJuicesId = Category::where('name', 'Fresh Juices')->first()->id;
        $smoothiesId = Category::where('name', 'Smoothies')->first()->id;
        $greenJuicesId = Category::where('name', 'Green Juices')->first()->id;
        $proteinShakesId = Category::where('name', 'Protein Shakes')->first()->id;
        $wellnessShotsId = Category::where('name', 'Wellness Shots')->first()->id;
        $kombuchaId = Category::where('name', 'Kombucha')->first()->id;

        $products = [
            // Fresh Juices
            [
                'category_id' => $freshJuicesId,
                'name' => 'Orange Juice',
                'description' => 'Fresh squeezed orange juice',
                'price' => 120.00,
                'stock_quantity' => 50,
                'sku' => 'FJ001',
            ],
            [
                'category_id' => $freshJuicesId,
                'name' => 'Apple Juice',
                'description' => 'Crisp apple juice',
                'price' => 110.00,
                'stock_quantity' => 45,
                'sku' => 'FJ002',
            ],
            [
                'category_id' => $freshJuicesId,
                'name' => 'Carrot Ginger Juice',
                'description' => 'Fresh carrot juice with ginger kick',
                'price' => 130.00,
                'stock_quantity' => 30,
                'sku' => 'FJ003',
            ],

            // Smoothies
            [
                'category_id' => $smoothiesId,
                'name' => 'Berry Blast Smoothie',
                'description' => 'Mixed berry smoothie with banana',
                'price' => 140.00,
                'stock_quantity' => 25,
                'sku' => 'SM001',
            ],
            [
                'category_id' => $smoothiesId,
                'name' => 'Tropical Paradise',
                'description' => 'Mango, pineapple, and coconut smoothie',
                'price' => 145.00,
                'stock_quantity' => 20,
                'sku' => 'SM002',
            ],
            [
                'category_id' => $smoothiesId,
                'name' => 'Chocolate Peanut Butter',
                'description' => 'Rich chocolate and peanut butter smoothie',
                'price' => 150.00,
                'stock_quantity' => 22,
                'sku' => 'SM003',
            ],

            // Green Juices
            [
                'category_id' => $greenJuicesId,
                'name' => 'Green Machine',
                'description' => 'Kale, spinach, cucumber, and apple',
                'price' => 135.00,
                'stock_quantity' => 35,
                'sku' => 'GJ001',
            ],
            [
                'category_id' => $greenJuicesId,
                'name' => 'Detox Green',
                'description' => 'Celery, cucumber, lemon, and parsley',
                'price' => 130.00,
                'stock_quantity' => 28,
                'sku' => 'GJ002',
            ],

            // Protein Shakes
            [
                'category_id' => $proteinShakesId,
                'name' => 'Vanilla Protein Shake',
                'description' => 'Vanilla protein with almond milk',
                'price' => 150.00,
                'stock_quantity' => 40,
                'sku' => 'PS001',
            ],
            [
                'category_id' => $proteinShakesId,
                'name' => 'Chocolate Recovery',
                'description' => 'Post-workout chocolate protein shake',
                'price' => 150.00,
                'stock_quantity' => 35,
                'sku' => 'PS002',
            ],

            // Wellness Shots
            [
                'category_id' => $wellnessShotsId,
                'name' => 'Ginger Shot',
                'description' => 'Pure ginger wellness shot',
                'price' => 100.00,
                'stock_quantity' => 60,
                'sku' => 'WS001',
            ],
            [
                'category_id' => $wellnessShotsId,
                'name' => 'Turmeric Shot',
                'description' => 'Anti-inflammatory turmeric shot',
                'price' => 110.00,
                'stock_quantity' => 55,
                'sku' => 'WS002',
            ],

            // Kombucha
            [
                'category_id' => $kombuchaId,
                'name' => 'Ginger Lemon Kombucha',
                'description' => 'Probiotic fermented tea with ginger and lemon',
                'price' => 120.00,
                'stock_quantity' => 30,
                'sku' => 'KB001',
            ],
            [
                'category_id' => $kombuchaId,
                'name' => 'Berry Kombucha',
                'description' => 'Mixed berry flavored kombucha',
                'price' => 125.00,
                'stock_quantity' => 25,
                'sku' => 'KB002',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
