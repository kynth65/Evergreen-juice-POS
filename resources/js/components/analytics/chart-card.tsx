import { type ReactNode } from 'react';

export interface ChartCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function ChartCard({
    title,
    description,
    children,
    className = '',
}: ChartCardProps) {
    return (
        <div className={`bg-white p-4 sm:p-6 rounded-lg border ${className}`}>
            <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
}
