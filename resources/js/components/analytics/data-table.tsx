import { type ReactNode } from 'react';

export interface Column<T = any> {
    header: string;
    accessor: keyof T | ((row: T) => ReactNode);
    className?: string;
}

export interface DataTableProps<T = any> {
    title: string;
    description?: string;
    columns: Column<T>[];
    data: T[];
    maxHeight?: string;
}

export function DataTable<T extends Record<string, any>>({
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
        <div className="bg-white rounded-lg border">
            <div className="p-4 sm:p-6 border-b">
                <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            <div className={`overflow-x-auto ${maxHeight}`}>
                <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${
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
