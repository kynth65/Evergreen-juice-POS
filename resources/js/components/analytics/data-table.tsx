import { type ReactNode } from 'react';

export interface Column<T = Record<string, unknown>> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
    title: string;
    description?: string;
    columns: Column<T>[];
    data: T[];
    maxHeight?: string;
}

export function DataTable<T extends Record<string, unknown>>({
    title,
    description,
    columns,
    data,
    maxHeight = 'max-h-96',
}: DataTableProps<T>) {
    const getCellValue = (row: T, column: Column<T>): ReactNode => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row);
        }
        return row[column.accessor];
    };

    return (
        <div className="bg-white rounded-lg border w-full">
            <div className="p-3 sm:p-4 md:p-6 border-b">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            <div className={`overflow-x-auto ${maxHeight}`}>
                <table className="w-full min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm ${
                                            column.className ||
                                            (colIndex === 0
                                                ? 'font-medium text-gray-900'
                                                : 'text-gray-600')
                                        }`}
                                    >
                                        {getCellValue(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
