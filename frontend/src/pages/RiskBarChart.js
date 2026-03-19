import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function RiskBarChart({ details }) {
  const counts = { Low: 0, Medium: 0, High: 0 };

  details.forEach(item => {
    if (item.level in counts) {
      counts[item.level]++;
    }
  });

  const data = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Number of Risks',
        data: [counts.Low, counts.Medium, counts.High],
        backgroundColor: ['green', 'orange', 'red']
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', marginBottom: '40px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
