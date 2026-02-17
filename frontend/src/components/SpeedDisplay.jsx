
import React from 'react';
import { ArrowDown, ArrowUp, Activity } from 'lucide-react';

const SpeedItem = ({ icon: Icon, label, value, color }) => (
    <div className="speed-card">
        <div className="speed-icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div className="speed-info">
            <p className="speed-label">{label}</p>
            <p className="speed-value">{value}</p>
        </div>
    </div>
);

const SpeedDisplay = ({ networkDown, networkUp, cpuSpeed }) => {
    return (
        <div className="speed-display-grid">
            <SpeedItem
                icon={ArrowDown}
                label="Download"
                value={networkDown}
                color="#3b82f6"
            />
            <SpeedItem
                icon={ArrowUp}
                label="Upload"
                value={networkUp}
                color="#10b981"
            />
            <SpeedItem
                icon={Activity}
                label="CPU Clock"
                value={cpuSpeed}
                color="#f59e0b"
            />
        </div>
    );
};

export default SpeedDisplay;
