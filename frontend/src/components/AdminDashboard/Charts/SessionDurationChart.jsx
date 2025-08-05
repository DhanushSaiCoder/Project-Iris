import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const SessionDurationChart = ({ sessions }) => {
    // Group sessions into duration bins (e.g., 0-5min, 5-10min, etc.)
    const durationBins = {
        '0-5 min': 0,
        '5-10 min': 0,
        '10-15 min': 0,
        '15-20 min': 0,
        '20+ min': 0,
    };

    sessions.forEach(session => {
        const durationInMinutes = session.duration / 60000; // duration is in milliseconds

        if (durationInMinutes >= 0 && durationInMinutes < 5) {
            durationBins['0-5 min']++;
        } else if (durationInMinutes >= 5 && durationInMinutes < 10) {
            durationBins['5-10 min']++;
        } else if (durationInMinutes >= 10 && durationInMinutes < 15) {
            durationBins['10-15 min']++;
        } else if (durationInMinutes >= 15 && durationInMinutes < 20) {
            durationBins['15-20 min']++;
        } else {
            durationBins['20+ min']++;
        }
    });

    const chartData = Object.values(durationBins);
    const xAxisLabels = Object.keys(durationBins);

    return (
        <div style={{ width: '100%', height: 300, textAlign: 'center', color: 'white' }}>
            <h3 style={{ marginBottom: '5px' }}>Session Duration Distribution</h3>
            <p style={{ fontSize: '0.9em', marginBottom: '20px' }}>Shows how long user sessions typically last.</p>
            <BarChart
                xAxis={[{ scaleType: 'band', data: xAxisLabels, 
                    // Change x-axis tick label styles
                    sx: {
                        ".MuiChartsAxis-tickLabel": {
                            fill: "#FFFFFF", // White text color for x-axis labels
                        },
                        ".MuiChartsAxis-line": {
                            stroke: "#FFFFFF", // White line color for x-axis
                        },
                    }
                }]}
                series={[{ data: chartData, label: 'Number of Sessions', color: '#42A5F5' }]}
                height={200}
                sx={{
                    // Change y-axis tick label styles
                    ".MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF", // White text color for y-axis labels
                    },
                    ".MuiChartsAxis-left .MuiChartsAxis-line": {
                        stroke: "#FFFFFF", // White line color for y-axis
                    },
                    // Change legend text color
                    '& .MuiChartsLegend-series text': {
                        fill: '#FFFFFF', // White text color for legend
                    },
                }}
            />
        </div>
    );
};

export default SessionDurationChart;
