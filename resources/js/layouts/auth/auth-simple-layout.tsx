import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Leaf, Sparkles } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form */}
            <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-12">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo */}
                    <Link
                        href={home()}
                        className="mb-8 flex items-center gap-2"
                    >
                        <Leaf className="h-8 w-8 text-green-700" />
                        <span className="font-afacad text-2xl font-bold text-green-900">
                            EvergreenJuice
                        </span>
                    </Link>

                    {/* Title & Description */}
                    <div className="mb-8">
                        <h1 className="font-afacad text-3xl font-bold text-green-900">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-900">
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Floating Circles */}
                        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-green-500/20 blur-3xl" />
                        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="relative flex h-full flex-col items-center justify-center p-12 text-white">
                        <div className="max-w-lg text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                <Sparkles className="h-4 w-4" />
                                <span>Modern POS System</span>
                            </div>

                            <h2 className="font-afacad text-5xl font-bold leading-tight">
                                Streamline Your
                                <br />
                                Juice Business
                            </h2>

                            <p className="mt-6 text-lg leading-relaxed text-green-50">
                                Powerful point of sale system designed
                                specifically for juice shops. Manage inventory,
                                track sales, and grow your business with ease.
                            </p>

                            {/* Features List */}
                            <div className="mt-12 space-y-4 text-left">
                                {[
                                    'Real-time inventory tracking',
                                    'Comprehensive sales analytics',
                                    'Multi-user role management',
                                    'Fast checkout process',
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <svg
                                                className="h-4 w-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-green-50">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
