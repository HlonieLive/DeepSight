
import React from 'react';
import { motion } from 'framer-motion';

const HealthGauge = ({ score, status, suggestions }) => {
    const radius = 60;
    const stroke = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = '#10b981'; // Green
    let labelColorClass = 'text-success';

    if (score < 50) {
        color = '#ef4444'; // Red
        labelColorClass = 'text-danger';
    } else if (score < 80) {
        color = '#f59e0b'; // Amber
        labelColorClass = 'text-warning';
    }

    return (
        <div className="health-gauge-container">
            <div className="gauge-wrapper">
                {/* Background Circle */}
                <svg className="gauge-svg">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        className="gauge-bg"
                        strokeWidth={stroke}
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={color}
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className="gauge-progress"
                        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                </svg>
                <div className="gauge-text">
                    <span className={`gauge-score ${labelColorClass}`} style={{ color: color }}>{score}</span>
                    <span className="gauge-status">{status}</span>
                </div>
            </div>

            <div className="suggestions-container">
                <h3 className="suggestions-title">System Suggestions</h3>
                {suggestions && suggestions.length > 0 ? (
                    <ul className="suggestions-list">
                        {suggestions.map((s, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="suggestion-item"
                            >
                                {s}
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-suggestions">All good!</p>
                )}
            </div>
        </div>
    );
};

export default HealthGauge;
