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
import { Bar, Doughnut } from 'react-chartjs-2';
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

interface AssistanceTypeChartProps {
  type: 'bar' | 'doughnut';
}

const AssistanceTypeChart: React.FC<AssistanceTypeChartProps> = ({ type }) => {
  const { data } = useApp();

  // Calculate assistance data by type
  const assistanceTypes = [
    'طبية', 'أيتام', 'أرامل', 'ذوي الاحتياجات', 
    'تعليمية', 'أسر السجناء', 'مالية'
  ];

  const assistanceData = assistanceTypes.map(type => {
    const assistances = data.assistances.filter(a => a.type === type);
    const totalAmount = assistances.reduce((sum, a) => sum + a.amount, 0);
    const count = assistances.length;
    
    return {
      type,
      amount: totalAmount,
      count
    };
  });

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
  ];

  const chartData = {
    labels: assistanceData.map(item => item.type),
    datasets: [
      {
        label: type === 'bar' ? 'المبلغ (جنيه مصري)' : 'عدد المساعدات',
        data: type === 'bar' 
          ? assistanceData.map(item => item.amount)
          : assistanceData.map(item => item.count),
        backgroundColor: colors,
        borderColor: colors.map(color => color + '80'),
        borderWidth: 2,
        borderRadius: 8,
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
            if (type === 'bar') {
              return `${label}: ${value.toLocaleString('ar-EG')} جنيه مصري`;
            } else {
              return `${label}: ${value} مساعدة`;
            }
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
          },
          callback: function(value: any) {
            return value.toLocaleString('ar-EG');
          }
        }
      },
    } : undefined,
  };

  return (
    <ChartContainer>
      <h3>
        {type === 'bar' ? 'توزيع المساعدات حسب النوع (المبلغ)' : 'توزيع المساعدات حسب النوع (العدد)'}
      </h3>
      <ChartWrapper>
        {type === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </ChartWrapper>
    </ChartContainer>
  );
};

export default AssistanceTypeChart;
