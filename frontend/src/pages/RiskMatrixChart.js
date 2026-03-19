// src/pages/RiskMatrixChart.js
import React from 'react';

const likelihoodLabels = ['RARE (1)', 'UNLIKELY (2)', 'POSSIBLE (3)', 'LIKELY (4)', 'ALMOST CERTAIN (5)'];
const impactLabels = ['HIGH (3)', 'MEDIUM (2)', 'LOW (1)'];

const getRiskLevelColor = (impact, likelihood) => {
  const score = impact * likelihood;
  if (score <= 5) return 'green';
  if (score <= 10) return 'orange';
  return 'red';
};

export default function RiskMatrixChart({ details }) {
  const matrix = Array(3).fill(null).map(() => Array(5).fill(0));

  // Fill matrix counts
  details.forEach(({ impact, likelihood }) => {
    if (impact >= 1 && impact <= 3 && likelihood >= 1 && likelihood <= 5) {
      matrix[3 - impact][likelihood - 1] += 1;
    }
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', margin: 'auto' }}>
        <thead>
          <tr>
            <th style={{ width: '80px' }}></th>
            {likelihoodLabels.map((label, idx) => (
              <th key={idx} style={cellStyle}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th style={{ ...cellStyle, fontWeight: 'bold' }}>{impactLabels[i]}</th>
              {row.map((count, j) => {
                const impact = 3 - i;
                const likelihood = j + 1;
                const riskScore = impact * likelihood;
                const color = getRiskLevelColor(impact, likelihood);
                const tooltip = `Impact: ${impact}, Likelihood: ${likelihood}, Risk: ${impact} × ${likelihood} = ${riskScore}`;
                return (
                  <td
                    key={j}
                    title={tooltip}
                    style={{
                      ...cellStyle,
                      backgroundColor: color,
                      color: '#fff',
                      cursor: 'help',
                    }}
                  >
                    {count > 0 ? count : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #999',
  padding: '10px',
  textAlign: 'center',
  minWidth: '100px',
  fontSize: '14px',
};
