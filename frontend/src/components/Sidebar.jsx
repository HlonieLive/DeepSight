
import React from 'react';
import { LayoutDashboard, Activity, Database, Wifi, Settings, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, isMobileOpen, setIsMobileOpen }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'performance', label: 'Performance', icon: Activity },
        { id: 'storage', label: 'Storage', icon: Database },
        { id: 'network', label: 'Network', icon: Wifi },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Activity className="text-emerald-500 mr-3" size={28} />
                    <span className="text-xl font-bold text-white tracking-wider">DEEP SIGHT</span>
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="ml-auto md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            onTabChange(item.id);
                                            setIsMobileOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center px-3 py-3 rounded-lg transition-colors
                      ${isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon size={20} className="mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer/Version */}
                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Deep Sight Pro</p>
                        <p className="text-[10px] text-slate-500">v2.4.0 • Stable</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
