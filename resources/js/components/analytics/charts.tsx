import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions,
} from 'chart.js';
import {
    Line as ChartJSLine,
    Bar as ChartJSBar,
    Doughnut as ChartJSDoughnut,
} from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export interface ChartDataset {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

export interface LineChartProps {
    data: ChartData;
    options?: ChartOptions<'line'>;
    height?: string;
}

export interface BarChartProps {
    data: ChartData;
    options?: ChartOptions<'bar'>;
    height?: string;
}

export interface DoughnutChartProps {
    data: ChartData;
    options?: ChartOptions<'doughnut'>;
    size?: string;
}

const defaultChartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
        },
    },
};

const defaultDoughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
        },
    },
};

export function LineChart({
    data,
    options = defaultChartOptions,
    height = 'h-64 sm:h-80',
}: LineChartProps) {
    return (
        <div className={height}>
            <ChartJSLine data={data} options={options} />
        </div>
    );
}

export function BarChart({
    data,
    options = defaultChartOptions,
    height = 'h-64 sm:h-80',
}: BarChartProps) {
    return (
        <div className={height}>
            <ChartJSBar data={data} options={options} />
        </div>
    );
}

export function DoughnutChart({
    data,
    options = defaultDoughnutOptions,
    size = 'w-48 h-48 sm:w-64 sm:h-64',
}: DoughnutChartProps) {
    return (
        <div className="flex justify-center items-center h-64 sm:h-80">
            <div className={size}>
                <ChartJSDoughnut data={data} options={options} />
            </div>
        </div>
    );
}
