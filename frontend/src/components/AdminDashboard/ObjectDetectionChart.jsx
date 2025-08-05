import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

// Utility: generate an HSL-based color palette for N items
const generateColors = count =>
  Array.from({ length: count }).map((_, i) =>
    `hsl(${Math.round((i * 360) / count)}, 70%, 50%)`
  );

const ObjectDetectionChart = ({ sessions, topN = 8 }) => {
  // Aggregate counts per class
  const counts = sessions.reduce((acc, session) => {
    session.allDetections.forEach(({ class: cls }) => {
      acc[cls] = (acc[cls] || 0) + 1;
    });
    return acc;
  }, {});

  // Sort classes by frequency, take top N and group the rest into "Others"
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restTotal = rest.reduce((sum, [, cnt]) => sum + cnt, 0);
  const finalEntries = restTotal > 0 ? [...top, ['Others', restTotal]] : top;

  // Prepare chart data
  const chartData = finalEntries.map(([label, value], idx) => ({
    id: idx,
    label,
    value,
  }));

  // Generate a matching color for each slice
  const colors = generateColors(chartData.length);

  return (
    <div style={{ width: '100%', height: 350, color: 'white' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 8 }}>
        Most Frequently Detected Objects
      </h3>
      <p style={{ textAlign: 'center', marginBottom: 16, opacity: 0.7 }}>
        Showing top {topN} classes plus Others
      </p>

      <PieChart
        series={[
          {
            data: chartData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, outerRadius: 100 },
            colors,
          },
        ]}
        height={250}
        legendPosition="right"
        legendProps={{
          rootProps: {
            sx: {
              maxHeight: 200,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              flexWrap: 'wrap',
            },
          },
        }}
        sx={{
          '& .MuiChartsLegend-series text': {
            fill: '#FFF',
            fontSize: '0.8rem',
          },
          '& .MuiChartsArcLabel-root': {
            fill: '#FFF',
          },
        }}
      />
    </div>
  );
};

export default ObjectDetectionChart;
