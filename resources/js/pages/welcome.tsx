import { Button } from '@/components/ui/button';
import { dashboard, login, menuBoard, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf, Monitor } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <meta
                    name="description"
                    content="EvergreenJuice POS System"
                />
            </Head>

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 via-white to-green-50">
                <div className="text-center">
                    {/* Logo and Title */}
                    <div className="mb-8 flex flex-col items-center gap-4">
                        <Leaf className="h-20 w-20 text-green-700" />
                        <h1 className="font-afacad text-5xl font-bold text-green-900 md:text-6xl">
                            EvergreenJuice
                        </h1>
                        <p className="text-xl text-gray-600">
                            Point of Sale System
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {auth.user ? (
                            <Button
                                asChild
                                size="lg"
                                className="h-12 px-8 text-base font-medium"
                            >
                                <Link href={dashboard()}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 px-8 text-base font-medium"
                                >
                                    <Link href={login()}>Sign In</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-12 px-8 text-base font-medium"
                                >
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Menu Board Button */}
                    <div className="mt-8">
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 gap-3 border-2 border-green-600 px-10 text-base font-semibold text-green-700 hover:bg-green-50 hover:text-green-800"
                        >
                            <Link href={menuBoard()}>
                                <Monitor className="h-5 w-5" />
                                View Digital Menu Board
                            </Link>
                        </Button>
                        <p className="mt-2 text-sm text-gray-500">
                            Perfect for TV displays
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="absolute bottom-8">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} EvergreenJuice POS
                    </p>
                </footer>
            </div>
        </>
    );
}
