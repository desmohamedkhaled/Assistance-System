import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartContainer = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.12);
    border-color: rgba(102, 126, 234, 0.2);
  }

  h3 {
    font-size: 19px;
    color: #333;
    margin-bottom: 24px;
    text-align: center;
    font-weight: 600;
    line-height: 1.3;
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  height: 320px;
  width: 100%;
`;

const MonthlyAssistanceChart: React.FC = () => {
  const { data } = useApp();

  // Generate last 6 months data
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }));
  }

  // Calculate monthly assistance data
  const monthlyData = months.map((month, index) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (5 - index), 1);
    const nextMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
    
    const assistances = data.assistances.filter(assistance => {
      const assistanceDate = new Date(assistance.date);
      return assistanceDate >= targetDate && assistanceDate < nextMonth;
    });

    const totalAmount = assistances.reduce((sum, a) => sum + a.amount, 0);
    const count = assistances.length;
    
    return {
      month,
      amount: totalAmount,
      count
    };
  });

  const chartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'المبلغ المدفوع (جنيه مصري)',
        data: monthlyData.map(item => item.amount),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#667eea',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'عدد المساعدات',
        data: monthlyData.map(item => item.count),
        borderColor: '#764ba2',
        backgroundColor: 'rgba(118, 75, 162, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#764ba2',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#764ba2',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label.includes('المبلغ')) {
              return `${label}: ${value.toLocaleString('ar-EG')} جنيه مصري`;
            } else {
              return `${label}: ${value}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          },
          callback: function(value: any) {
            return value.toLocaleString('ar-EG');
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11,
            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          }
        }
      },
    },
  };

  return (
    <ChartContainer>
      <h3>المساعدات الشهرية</h3>
      <ChartWrapper>
        <Line data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default MonthlyAssistanceChart;
