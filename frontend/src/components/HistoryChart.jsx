
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const HistoryChart = ({ data }) => {
    return (
        <div className="history-chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="timestamp" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={5} />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                        name="CPU Usage %"
                    />
                    <Line
                        type="monotone"
                        dataKey="mem"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Memory Usage %"
                    />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={false}
                        name="Temp °C"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistoryChart;
