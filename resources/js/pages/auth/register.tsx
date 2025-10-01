import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Create your account"
            description="Get started with EvergreenJuice today"
        >
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Full name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError message={errors.name} />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Create a password"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                    className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="h-11 w-full bg-green-700 text-base font-medium hover:bg-green-800"
                            tabIndex={5}
                            data-test="register-user-button"
                        >
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {processing ? 'Creating account...' : 'Create account'}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                Already have an account?{' '}
                            </span>
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-sm font-medium text-green-700 hover:text-green-800"
                            >
                                Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
