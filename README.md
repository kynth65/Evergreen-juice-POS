# EvergreenJuice POS System

A fully functional Point of Sale system for juice shops built with Laravel 12 and React 19.

## Overview

EvergreenJuice is a modern POS application that provides comprehensive order processing, inventory management, sales analytics, and user management for juice shop businesses. The system features role-based access control, real-time stock tracking, and detailed reporting capabilities.

## Features

### Core POS Functionality
- Multi-item order processing with automatic order numbering
- Multiple payment methods (cash, card, digital wallet)
- Receipt generation and printing
- Real-time inventory tracking with automatic stock deduction
- Cash change calculation for cash payments

### Product & Inventory Management
- Product and category CRUD operations
- Stock quantity tracking with low stock alerts
- SKU support and product images
- Active/inactive product states
- Optional inventory tracking per product

### User Management & Security
- Role-based access control (Admin/Cashier)
- User account management (create, update, activate/deactivate)
- Email verification support
- Two-factor authentication (TOTP)
- Password reset functionality
- Recovery codes for 2FA

### Analytics & Reporting
- Daily sales trends with interactive charts
- Top selling products by quantity and revenue
- Payment method breakdown
- Weekday and hourly sales analysis
- Monthly and weekly comparisons
- Category performance metrics
- Advanced order filtering (date range, cashier, payment method, status)

### Settings & Personalization
- Profile management
- Password change
- Two-factor authentication setup
- Theme customization

## Tech Stack

**Backend:**
- Laravel 12 (PHP 8.4)
- SQLite database
- Laravel Fortify (authentication)
- Laravel Sanctum (API tokens)
- Pest PHP (testing)

**Frontend:**
- React 19 with TypeScript
- Inertia.js (Laravel-React bridge)
- TailwindCSS v4
- Radix UI components
- Chart.js for analytics
- Lucide React icons

**Development Tools:**
- Vite (bundling)
- Laravel Wayfinder (TypeScript route generation)
- ESLint & Prettier
- Laravel Pint (PHP code formatting)

## Prerequisites

- PHP 8.4 or higher
- Composer
- Node.js 18+ and npm
- SQLite extension enabled

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evergreen-juice
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Create SQLite database:
```bash
touch database/database.sqlite
```

7. Run migrations and seeders:
```bash
php artisan migrate --seed
```

8. Build frontend assets:
```bash
npm run build
```

## Development

### Start All Services
```bash
composer dev
```
This starts Laravel server, queue worker, and Vite dev server concurrently.

### Individual Commands

**Backend:**
```bash
php artisan serve              # Start Laravel server
php artisan test               # Run tests
vendor/bin/pint                # Format PHP code
```

**Frontend:**
```bash
npm run dev                    # Start Vite dev server
npm run build                  # Build production assets
npm run lint                   # Run ESLint
npm run format                 # Format with Prettier
npm run types                  # TypeScript type checking
```

**Database:**
```bash
php artisan migrate            # Run migrations
php artisan migrate:fresh --seed  # Fresh migration with sample data
```

## Default User Accounts

After running seeders, the following accounts are available:

- **Admin**: admin@example.com / password
- **Cashier**: cashier@example.com / password
- **Test User**: test@example.com / password

## Project Structure

```
app/
├── Http/Controllers/     # Application controllers
├── Models/              # Eloquent models
└── Middleware/          # Custom middleware

resources/
├── js/
│   ├── pages/          # Inertia.js page components
│   ├── components/     # Reusable React components
│   ├── actions/        # Auto-generated form actions
│   └── hooks/          # Custom React hooks
└── css/                # Stylesheets

database/
├── migrations/         # Database schema
└── seeders/           # Sample data seeders

routes/
├── web.php            # Web routes
├── auth.php           # Authentication routes
└── settings.php       # Settings routes
```

## User Roles & Permissions

### Admin
- Full access to all features
- Product and category management
- User account management
- Analytics and reporting
- Order history (all orders)

### Cashier
- POS interface
- Dashboard access
- View own orders
- Receipt printing

## Data Models

**User**: name, email, role (admin/cashier), is_active

**Product**: name, description, price, stock_quantity, low_stock_threshold, sku, image_url, is_active, track_inventory

**Category**: name, description, is_active

**Order**: order_number, user_id, status, subtotal, discount_amount, total_amount, payment_method, cash_amount, completed_at

**OrderItem**: product_name, unit_price, quantity, line_total

## Testing

Run backend tests with Pest:
```bash
composer test
# or
php artisan test
```

## Code Quality

The project uses automated code formatting and linting:
- **PHP**: Laravel Pint (PSR-12 standard)
- **TypeScript/React**: ESLint + Prettier
- **TypeScript**: Strict mode enabled

Format code:
```bash
vendor/bin/pint        # PHP
npm run format         # JavaScript/TypeScript
```

## License

This project is open-source software.
