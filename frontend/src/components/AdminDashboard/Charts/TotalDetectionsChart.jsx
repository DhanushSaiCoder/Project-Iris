import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const TotalDetectionsChart = ({ sessions }) => {
    // Prepare data for the chart
    const chartData = sessions.map((session, index) => ({
        id: session._id || index, // Use session ID or index as unique identifier
        value: session.totalDetections,
        label: `Session ${index + 1}`,
    }));

    // Sort data by totalDetections for better visualization
    chartData.sort((a, b) => a.value - b.value);

    const xAxisLabels = chartData.map(data => data.label);
    const seriesData = chartData.map(data => data.value);

    return (
        <div style={{ width: '100%', height: 300, textAlign: 'center', color: 'white' }}>
            <h3 style={{ fontSize: '1.1em', marginBottom: '8px' }}>Total Detections per Session</h3>
            <p style={{ fontSize: '0.8em', marginBottom: '25px', opacity: 0.8 }}>Visualizes the total number of objects detected in each session.</p>
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
                series={[{ data: seriesData, label: 'Total Detections', color: '#FFA726' }]}
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

export default TotalDetectionsChart;
