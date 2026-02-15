import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from './Card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DistributionChartProps {
  income: number;
  expense: number;
  savings: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ income, expense, savings }) => {
  const data = {
    labels: ['আয়', 'ব্যয়', 'সঞ্চয়'],
    datasets: [
      {
        data: [income, expense, savings],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald (Income)
          'rgba(239, 68, 68, 0.8)',   // Red (Expense)
          'rgba(6, 182, 212, 0.8)',   // Cyan (Savings)
        ],
        borderColor: [
           'rgba(16, 185, 129, 0)', // Transparent border to ensure no white strokes
           'rgba(239, 68, 68, 0)',
           'rgba(6, 182, 212, 0)',
        ],
        borderWidth: 0,
        hoverOffset: 20, // Scale effect on hover
        hoverBorderWidth: 0, // No border on hover
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Creates the Doughnut hole
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 25,
            color: '#94a3b8',
            font: {
                family: '"Hind Siliguri", sans-serif',
                size: 14,
                weight: 500
            }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Dark Slate
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        titleFont: { family: '"Hind Siliguri", sans-serif', size: 13 },
        bodyFont: { family: '"Hind Siliguri", sans-serif', size: 16, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        borderColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        callbacks: {
            label: (context) => {
                const value = Number(context.raw);
                return ` ${context.label}: ৳ ${value.toLocaleString('en-US')}`;
            }
        }
      },
    },
    layout: {
        padding: 20
    },
    elements: {
        arc: {
            borderWidth: 0 // Global setting to remove borders
        }
    },
    hover: {
        mode: 'nearest',
        intersect: true
    }
  };

  // Prevent rendering an empty chart if all values are 0 to avoid confusion, 
  // or let Chart.js handle it (it usually shows empty). 
  // For a better UI, we can show a placeholder if total is 0.
  const total = income + expense + savings;

  return (
    <Card className="mt-8 border-cyan-500/10 shadow-lg shadow-cyan-900/5 bg-slate-900/60 backdrop-blur-xl relative overflow-hidden group">
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10 px-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                বিভাগভিত্তিক বণ্টন
            </h3>
        </div>

        <div className="h-80 w-full relative z-10 flex flex-col items-center justify-center">
            {total > 0 ? (
                <Doughnut data={data} options={options} />
            ) : (
                <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-dashed animate-pulse"></div>
                    <p>কোনো ডেটা পাওয়া যায়নি</p>
                </div>
            )}
            
            {/* Center Text Effect (Optional, purely visual) */}
            {total > 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] pointer-events-none text-center">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">মোট</span>
                    <p className="text-xl font-bold text-white">৳ {total.toLocaleString()}</p>
                </div>
            )}
        </div>
    </Card>
  );
};

export default DistributionChart;