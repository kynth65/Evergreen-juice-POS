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
        <div className="bg-white p-4 sm:p-6 rounded-lg border">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
                    {change && (
                        <p
                            className={`text-sm mt-1 ${
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
                {icon && <div className="ml-4">{icon}</div>}
            </div>
        </div>
    );
}
