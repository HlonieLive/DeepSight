
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StorageUsage = ({ percentUsed, total, used, free }) => {
    const data = [
        { name: 'Used', value: parseFloat(percentUsed) },
        { name: 'Free', value: 100 - parseFloat(percentUsed) },
    ];

    const COLORS = ['#ef4444', '#10b981']; // Red for used, Green for free

    return (
        <div className="storage-container">
            <div className="pie-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            formatter={(value) => `${value.toFixed(1)}%`}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-text">
                    <span className="pie-percent">{percentUsed}%</span>
                </div>
            </div>

            <div className="storage-legend">
                <div className="storage-item">
                    <span className="storage-label used">Used</span>
                    <span className="storage-value">{used}</span>
                </div>
                <div className="storage-divider" />
                <div className="storage-item">
                    <span className="storage-label free">Free</span>
                    <span className="storage-value">{free}</span>
                </div>
                <div className="storage-divider" />
                <div className="storage-item">
                    <span className="storage-label total">Total</span>
                    <span className="storage-value">{total}</span>
                </div>
            </div>
        </div>
    );
};

export default StorageUsage;
