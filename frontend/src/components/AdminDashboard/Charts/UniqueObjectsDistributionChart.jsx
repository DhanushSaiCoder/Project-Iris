import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const UniqueObjectsDistributionChart = ({ sessions }) => {
    const uniqueObjectsBins = {
        '0-5': 0,
        '6-10': 0,
        '11-15': 0,
        '16-20': 0,
        '20+': 0,
    };

    sessions.forEach(session => {
        const uniqueObjects = session.uniqueObjects;

        if (uniqueObjects >= 0 && uniqueObjects <= 5) {
            uniqueObjectsBins['0-5']++;
        } else if (uniqueObjects >= 6 && uniqueObjects <= 10) {
            uniqueObjectsBins['6-10']++;
        } else if (uniqueObjects >= 11 && uniqueObjects <= 15) {
            uniqueObjectsBins['11-15']++;
        } else if (uniqueObjects >= 16 && uniqueObjects <= 20) {
            uniqueObjectsBins['16-20']++;
        } else {
            uniqueObjectsBins['20+']++;
        }
    });

    const chartData = Object.values(uniqueObjectsBins);
    const xAxisLabels = Object.keys(uniqueObjectsBins);

    return (
        <div style={{ width: '100%', height: 300, textAlign: 'center', color: 'white' }}>
            <h3 style={{ fontSize: '1.1em', marginBottom: '8px' }}>Unique Objects Detected per Session</h3>
            <p style={{ fontSize: '0.8em', marginBottom: '25px', opacity: 0.8 }}>Distribution of the number of unique objects identified in each session.</p>
            <BarChart
                xAxis={[{ scaleType: 'band', data: xAxisLabels,
                    sx: {
                        ".MuiChartsAxis-tickLabel": {
                            fill: "#FFFFFF", // White text color for x-axis labels
                        },
                        ".MuiChartsAxis-line": {
                            stroke: "#FFFFFF", // White line color for x-axis
                        },
                    }
                }]}
                series={[{ data: chartData, label: 'Number of Sessions', color: '#66BB6A' }]}
                height={200}
                sx={{
                    ".MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF", // White text color for y-axis labels
                    },
                    ".MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#FFFFFF", // White line color for y-axis
                    },
                    '& .MuiChartsLegend-series text': {
                        fill: '#FFFFFF', // White text color for legend
                    },
                }}
            />
        </div>
    );
};

export default UniqueObjectsDistributionChart;
