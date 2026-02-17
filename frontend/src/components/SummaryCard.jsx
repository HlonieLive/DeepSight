
import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, subtext, icon, trend, color, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`
        p-6 rounded-xl border border-slate-700
        bg-gradient-to-br from-slate-800/80 to-slate-900/50 backdrop-blur-md
        flex flex-col justify-between h-40 shadow-lg cursor-pointer
        hover:border-${color}-500/50 hover:shadow-${color}-500/20
        transition-all duration-300 relative overflow-hidden group
      `}
            onClick={onClick}
        >
            {/* Background Accent Gradient */}
            <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 bg-${color}-500 pointer-events-none`}
            />

            <div className="flex justify-between items-start z-10">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <div className="mt-4 z-10">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
                <h2 className="text-3xl font-bold text-white font-mono tracking-tighter shadow-black drop-shadow-sm">
                    {value}
                </h2>
                {subtext && <p className="text-xs text-slate-500 mt-1 truncate">{subtext}</p>}
            </div>
        </motion.div>
    );
};

export default SummaryCard;
