import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function CategoryBarChart({ average, color }) {
  const data = {
    labels: ['Score'],
    datasets: [
      {
        label: 'Average',
        data: [average],
        backgroundColor: [color]
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { max: 15, beginAtZero: true },
      y: { ticks: { display: false } }
    }
  };

  return <Bar data={data} options={options} />;
}
