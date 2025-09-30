import AppLayout from '@/layouts/app-layout';
import { AccountManagement } from '@/components/dashboard/account-management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

interface User {
    id: number;
    name: string;
    role: string;
    email?: string;
    is_active?: boolean;
    created_at?: string;
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Account Management',
        href: '/account-management',
    },
];

export default function AccountManagementPage({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Management" />
            <div className="container mx-auto p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Account Management</h1>
                    <p className="text-gray-600">Manage user accounts</p>
                </div>

                <AccountManagement users={users} />
            </div>
        </AppLayout>
    );
}