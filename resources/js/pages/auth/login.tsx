import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Log in to your account to continue"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-sm text-green-800">
                    {status}
                </div>
            )}

            <Form
                {...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm font-medium text-green-700 hover:text-green-800"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-gray-300 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="h-11 w-full bg-green-700 text-base font-medium hover:bg-green-800"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {processing ? 'Signing in...' : 'Sign in'}
                        </Button>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{' '}
                            </span>
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="text-sm font-medium text-green-700 hover:text-green-800"
                            >
                                Create account
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
