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
        <div style={{ width: '100%', height: 300 }}>
            <PieChart
                series={[
                    {
                        data: chartData,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, outerRadius: 100, arcLabel: 'none' },
                    },
                ]}
                height={200}
            />
        </div>
    );
};

export default ObjectDetectionChart;
