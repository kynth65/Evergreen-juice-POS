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
        <div className={`bg-white p-3 sm:p-4 md:p-6 rounded-lg border ${className}`}>
            <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            <div className="w-full overflow-x-auto">
                {children}
            </div>
        </div>
    );
}
