import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

interface SettingsPageProps {
    title: string;
    description?: string;
    breadcrumbs: BreadcrumbItem[];
    children: ReactNode;
}

export default function SettingsPage({
    title,
    description,
    breadcrumbs,
    children,
}: SettingsPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <SettingsLayout>
                <div className="space-y-6">
                    {description && (
                        <HeadingSmall title={title} description={description} />
                    )}
                    {children}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
