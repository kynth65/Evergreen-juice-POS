<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class MenuBoardController extends Controller
{
    public function index(): Response
    {
        $categories = Category::active()
            ->with(['products' => function ($query) {
                $query->active()->orderBy('name');
            }])
            ->orderBy('name')
            ->get()
            ->filter(fn($category) => $category->products->count() > 0);

        return Inertia::render('menu-board', [
            'categories' => $categories,
        ]);
    }
}
