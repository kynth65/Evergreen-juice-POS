<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@evergreenjuice.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create demo cashier user
        User::create([
            'name' => 'Cashier One',
            'email' => 'cashier@evergreenjuice.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create additional cashier
        User::create([
            'name' => 'Cashier Two',
            'email' => 'cashier2@evergreenjuice.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
