<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AccountManagementController extends Controller
{
    public function index()
    {
        $users = User::orderBy('role')
            ->orderBy('name')
            ->get();

        return Inertia::render('account-management', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|in:admin,cashier',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
        ]);

        return redirect()->route('account-management.index')
            ->with('success', 'User account created successfully!');
    }

    public function update(Request $request, User $account_management)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$account_management->id,
            'is_active' => 'boolean',
            'role' => 'required|in:admin,cashier',
        ]);

        $account_management->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->boolean('is_active'),
            'role' => $request->role,
        ]);

        return redirect()->route('account-management.index')
            ->with('success', 'User account updated successfully!');
    }

    public function destroy(User $account_management)
    {
        $account_management->delete();

        return redirect()->route('account-management.index')
            ->with('success', 'User account deleted successfully!');
    }
}
