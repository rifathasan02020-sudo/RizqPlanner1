import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from './Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartProps {
  income: number;
  expense: number;
  savings: number;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ income, expense, savings }) => {
  // Chart Configuration
  const data = {
    labels: ['আয়', 'ব্যয়', 'সঞ্চয়'],
    datasets: [
      {
        data: [income, expense, savings],
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          if (!ctx) return '#fff';
          
          // Gradient Height Approximation (Safe default)
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          
          // Colors: Emerald, Red, Cyan
          const colors = [
            ['#10b981', 'rgba(16, 185, 129, 0.1)'], // Emerald
            ['#ef4444', 'rgba(239, 68, 68, 0.1)'], // Red
            ['#06b6d4', 'rgba(6, 182, 212, 0.1)'], // Cyan
          ];
          
          const index = context.dataIndex;
          const [start, end] = colors[index] || colors[0];
          
          gradient.addColorStop(0, start); // Top (Solid)
          gradient.addColorStop(1, end);   // Bottom (Transparent-ish)
          return gradient;
        },
        borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 2,
            bottomRight: 2
        },
        borderWidth: 0,
        barPercentage: 0.8, // Increased for thicker bars
        categoryPercentage: 0.9, // Increased to reduce gap between bars
        // Disable hover changes to keep it clean
        hoverBackgroundColor: (context: any) => {
             const ctx = context.chart.ctx;
             if (!ctx) return '#fff';
             const gradient = ctx.createLinearGradient(0, 0, 0, 300);
             const colors = [
                ['#10b981', 'rgba(16, 185, 129, 0.2)'],
                ['#ef4444', 'rgba(239, 68, 68, 0.2)'],
                ['#06b6d4', 'rgba(6, 182, 212, 0.2)'],
             ];
             const index = context.dataIndex;
             const [start, end] = colors[index] || colors[0];
             gradient.addColorStop(0, start);
             gradient.addColorStop(1, end);
             return gradient;
        },
        hoverBorderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Slate 900
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        titleFont: {
            family: '"Hind Siliguri", sans-serif',
            size: 13
        },
        bodyFont: {
            family: '"Hind Siliguri", sans-serif',
            size: 16,
            weight: 'bold'
        },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        callbacks: {
            label: (context) => {
                return `৳ ${Number(context.raw).toLocaleString('en-US')}`;
            }
        },
        // Smooth animation for tooltip
        animation: {
            duration: 200
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        border: {
            display: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: '"Hind Siliguri", sans-serif',
            size: 14,
            weight: 600
          },
          padding: 10
        }
      },
      y: {
        display: true, // Show Y axis visually
        beginAtZero: true, // Ensure scaling starts from 0
        grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.05)', // Subtle grid lines
            drawTicks: false
        },
        border: {
            display: false // No border line on axis
        },
        ticks: {
            color: '#64748b', // Slate 500
            font: {
                family: '"Hind Siliguri", sans-serif',
                size: 11,
            },
            padding: 8,
            callback: (value) => {
                if (typeof value === 'number') {
                    // Shorten large numbers for cleanliness
                    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
                    return value;
                }
                return value;
            }
        },
        // Add grace to ensure the top bar doesn't touch the top of the chart area.
        grace: '10%'
      },
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    hover: {
        mode: 'nearest',
        intersect: true
    },
    layout: {
        padding: {
            top: 10,
            bottom: 5,
            left: 5,
            right: 5
        }
    }
  };

  return (
    <Card className="mt-8 border-cyan-500/10 shadow-lg shadow-cyan-900/5 bg-slate-900/60 backdrop-blur-xl relative overflow-hidden group">
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10 px-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                আর্থিক তুলনামূলক চিত্র
            </h3>
        </div>

        <div className="h-64 w-full relative z-10">
            <Bar data={data} options={options} />
        </div>
    </Card>
  );
};

export default FinancialChart;