
import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const TopBar = ({ title, searchTerm, setSearchTerm, currentTime, setIsMobileOpen }) => {
    return (
        <header className="h-16 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between border-b border-slate-700/50">

            {/* Mobile Trigger (Hidden on Desktop) */}
            <button
                className="md:hidden text-slate-400 hover:text-white mr-4"
                onClick={() => setIsMobileOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Main Title / Search */}
            <div className="flex-1 max-w-xl flex items-center gap-4">
                <h1 className="text-xl font-bold text-white hidden md:block">{title}</h1>

                {/* Search Bar */}
                <div className="relative w-full max-w-sm ml-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search processes..."
                        className="w-full bg-slate-800 border-none outline-none text-sm text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Notification Bell */}
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Time */}
                <span className="text-sm font-mono text-emerald-400 hidden sm:block bg-emerald-500/10 px-2 py-1 rounded">
                    {currentTime}
                </span>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-slate-400">System Operator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-emerald-500 overflow-hidden">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>

        </header>
    );
};

export default TopBar;
