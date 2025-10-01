import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

interface DateRangeFilterProps {
    initialStartDate?: string;
    initialEndDate?: string;
    initialPeriod?: string;
}

const PERIODS = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
] as const;

export function DateRangeFilter({
    initialStartDate,
    initialEndDate,
    initialPeriod = '30days',
}: DateRangeFilterProps) {
    const [period, setPeriod] = useState(initialPeriod);
    const [startDate, setStartDate] = useState(initialStartDate || '');
    const [endDate, setEndDate] = useState(initialEndDate || '');
    const [showCustomRange, setShowCustomRange] = useState(false);

    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod);
        setShowCustomRange(false);

        // Immediately apply the filter
        router.get('/analytics', { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCustomRangeApply = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        router.get('/analytics', {
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <Card className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
                <h3 className="text-base sm:text-lg font-semibold">Date Range</h3>
            </div>

            {/* Quick Period Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3 sm:mb-4">
                {PERIODS.map((p) => (
                    <Button
                        key={p.value}
                        variant={period === p.value && !showCustomRange ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePeriodChange(p.value)}
                        className={`text-xs sm:text-sm ${
                            period === p.value && !showCustomRange
                                ? 'bg-green-700 hover:bg-green-800'
                                : ''
                        }`}
                    >
                        {p.label}
                    </Button>
                ))}
                <Button
                    variant={showCustomRange ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowCustomRange(!showCustomRange)}
                    className={`text-xs sm:text-sm col-span-2 sm:col-span-1 ${
                        showCustomRange ? 'bg-green-700 hover:bg-green-800' : ''
                    }`}
                >
                    Custom Range
                </Button>
            </div>

            {/* Custom Date Range */}
            {showCustomRange && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                        />
                    </div>
                    <Button
                        onClick={handleCustomRangeApply}
                        className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
                    >
                        Apply Custom Range
                    </Button>
                </div>
            )}
        </Card>
    );
}
