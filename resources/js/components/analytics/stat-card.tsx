import { type ReactNode } from 'react';

export interface StatCardProps {
    label: string;
    value: string | number;
    change?: {
        value: number;
        label: string;
    };
    icon?: ReactNode;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
    return (
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">{value}</p>
                    {change && (
                        <p
                            className={`text-xs sm:text-sm mt-1 ${
                                change.value >= 0
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {change.value >= 0 ? '+' : ''}
                            {change.value.toFixed(1)}% {change.label}
                        </p>
                    )}
                </div>
                {icon && <div className="ml-3 sm:ml-4">{icon}</div>}
            </div>
        </div>
    );
}
