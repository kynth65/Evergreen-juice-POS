<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Fresh Juices',
                'description' => 'Freshly squeezed fruit and vegetable juices',
                'color' => '#10b981',
            ],
            [
                'name' => 'Smoothies',
                'description' => 'Blended fruit and vegetable smoothies',
                'color' => '#8b5cf6',
            ],
            [
                'name' => 'Green Juices',
                'description' => 'Healthy green vegetable juices',
                'color' => '#22c55e',
            ],
            [
                'name' => 'Protein Shakes',
                'description' => 'High-protein drinks and shakes',
                'color' => '#ef4444',
            ],
            [
                'name' => 'Wellness Shots',
                'description' => 'Concentrated health boosting shots',
                'color' => '#f59e0b',
            ],
            [
                'name' => 'Kombucha',
                'description' => 'Fermented probiotic drinks',
                'color' => '#ec4899',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
