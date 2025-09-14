import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useApp } from '@/context/AppContext';
import styled from 'styled-components';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

interface StatusDistributionChartProps {
  type: 'pie' | 'bar';
}

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ type }) => {
  const { data } = useApp();

  // Calculate status distribution
  const statuses = ['معلق', 'قيد المراجعة', 'معتمد', 'مدفوع', 'مرفوض'];
  
  const statusData = statuses.map(status => {
    const assistances = data.assistances.filter(a => a.status === status);
    const count = assistances.length;
    const totalAmount = assistances.reduce((sum, a) => sum + a.amount, 0);
    
    return {
      status,
      count,
      amount: totalAmount
    };
  });

  const colors = {
    'معلق': '#ffc107',
    'قيد المراجعة': '#17a2b8',
    'معتمد': '#28a745',
    'مدفوع': '#007bff',
    'مرفوض': '#dc3545'
  };

  const chartData = {
    labels: statusData.map(item => item.status),
    datasets: [
      {
        label: type === 'bar' ? 'عدد المساعدات' : 'توزيع الحالات',
        data: type === 'bar' 
          ? statusData.map(item => item.count)
          : statusData.map(item => item.count),
        backgroundColor: statusData.map(item => colors[item.status as keyof typeof colors]),
        borderColor: statusData.map(item => colors[item.status as keyof typeof colors]),
        borderWidth: 2,
        borderRadius: type === 'bar' ? 8 : 0,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: type === 'bar' ? {
      x: {
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
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          }
        }
      },
    } : undefined,
  };

  return (
    <ChartContainer>
      <h3>
        {type === 'pie' ? 'توزيع المساعدات حسب الحالة' : 'عدد المساعدات حسب الحالة'}
      </h3>
      <ChartWrapper>
        {type === 'pie' ? (
          <Pie data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default StatusDistributionChart;
