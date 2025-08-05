import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const ObjectDetectionChart = ({ sessions }) => {
    const data = {};

    sessions.forEach(session => {
        session.allDetections.forEach(detection => {
            data[detection.class] = (data[detection.class] || 0) + 1;
        });
    });

    const chartData = Object.keys(data).map((key, index) => ({
        id: index,
        value: data[key],
        label: key,
    }));

    return (
        <div style={{ width: '100%', height: 300, textAlign: 'center', color: 'white' }}>
            <h3 style={{ marginBottom: '5px' }}>Most Frequently Detected Objects</h3>
            <p style={{ fontSize: '0.9em', marginBottom: '20px' }}>Distribution of object classes detected across all sessions.</p>
            <PieChart
                series={[
                    {
                        data: chartData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, outerRadius: 100, arcLabel: 'none' },
                        // Custom colors for pie slices
                        colors: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#7E57C2', '#26A69A', '#FFCA28'],
                    },
                ]}
                height={200}
                sx={{
                    // Change legend text color
                    '& .MuiChartsLegend-series text': {
                        fill: '#FFFFFF', // White text color for legend
                    },
                    // Change arc label text color
                    '& .MuiChartsArcLabel-root': {
                        fill: '#FFFFFF', // White text color for arc labels
                    },
                }}
            />
        </div>
    );
};

export default ObjectDetectionChart;
