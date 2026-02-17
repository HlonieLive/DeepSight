
import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Wifi, Cpu, Thermometer, AlertCircle, RefreshCw, X, Maximize2, Battery, BatteryCharging, BatteryWarning, Layers, HardDrive, Zap } from 'lucide-react';
import useSystemData from './hooks/useSystemData';
import HistoryChart from './components/HistoryChart';
import HealthGauge from './components/HealthGauge';
import SpeedDisplay from './components/SpeedDisplay';
import StorageUsage from './components/StorageUsage';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SummaryCard from './components/SummaryCard';

// Simple Update of Card Component to be Clickable (Removed Title since TopBar handles it often, but key for widgets)
const Card = ({ title, icon: Icon, children, className = "", onClick }) => (
  <div
    className={`card glass relative group ${className} ${onClick ? 'cursor-pointer hover:border-emerald-500/50 transition-all active:scale-[0.99]' : ''}`}
    onClick={onClick}
  >
    <div className="card-header">
      {Icon && <Icon className="icon-subtle group-hover:text-emerald-400 transition-colors" size={20} />}
      <h2 className="card-title">{title}</h2>
      {onClick && <Maximize2 size={16} className="absolute top-4 right-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </div>
    <div className="card-content relative">
      {children}
    </div>
  </div>
);

function App() {
  const { staticData, dynamicData, history, lastUpdated, isConnected, connectionError } = useSystemData();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (dynamicData) {
      setLoading(false);
    }
  }, [dynamicData]);

  if (loading) {
    return (
      <div className="loading-screen">
        <Activity className={`loading-icon ${!isConnected ? 'text-danger' : ''}`} size={48} />
        <h1 className="app-title">DEEP SIGHT</h1>

        {connectionError ? (
          <div className="flex flex-col items-center mt-4">
            <span className="text-danger flex items-center gap-2 mb-2">
              <AlertCircle size={16} /> Connection Failed
            </span>
            <p className="text-secondary text-sm">Ensure backend is running on port 3001</p>
            <p className="text-secondary text-xs mt-2 font-mono bg-slate-800 p-1 rounded">{connectionError}</p>
          </div>
        ) : (
          <p className="loading-text">
            {isConnected ? "Receiving Data..." : "Connecting to System..."}
          </p>
        )}
      </div>
    );
  }

  // --- Derived Data ---
  const cpuUsage = parseFloat(dynamicData?.performance?.cpuUsage || 0);
  const memUsage = parseFloat(dynamicData?.performance?.memoryUsage || 0);
  const temp = dynamicData?.health?.temperature || 0;
  const hasBattery = dynamicData?.power?.hasBattery;

  // Format uptime for TopBar
  const formatUptimeSimple = (seconds) => {
    if (!seconds) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const currentTime = new Date().toLocaleTimeString();

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-100 font-sans">

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Top Header */}
        <TopBar
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentTime={currentTime}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto pb-10">

              {/* Row 1: Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  title="Total CPU Load"
                  value={`${cpuUsage}%`}
                  subtext={`${dynamicData?.performance?.cpuCores?.length} Cores Active`}
                  icon={<Cpu size={24} />}
                  color="emerald"
                  trend={cpuUsage > 50 ? 5 : -2} // Mock trend logic
                  onClick={() => setActiveTab('performance')}
                />
                <SummaryCard
                  title="Memory Usage"
                  value={`${memUsage}%`}
                  subtext={`${dynamicData?.performance?.memoryAvailable} Free`}
                  icon={<Layers size={24} />}
                  color="blue"
                  trend={2}
                  onClick={() => setActiveTab('performance')}
                />
                <SummaryCard
                  title="Network Traffic"
                  value={dynamicData?.speed?.networkDownload}
                  subtext={`Up: ${dynamicData?.speed?.networkUpload}`}
                  icon={<Wifi size={24} />}
                  color="amber"
                  trend={12}
                  onClick={() => setActiveTab('network')}
                />
                <SummaryCard
                  title="System Health"
                  value={`${dynamicData?.health?.score}%`}
                  subtext={dynamicData?.health?.status}
                  icon={<Activity size={24} />}
                  color={dynamicData?.health?.score < 80 ? "red" : "purple"}
                  onClick={() => setActiveTab('performance')}
                />
              </div>

              {/* Row 2: Main Chart + Top Processes (Split View) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">

                {/* Main Chart (Takes 2 cols) */}
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <AreaChartIcon /> Performance History
                    </h2>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-0">
                    <HistoryChart data={history} />
                  </div>
                </div>

                {/* Top Processes Widget (Takes 1 col) */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-0 flex flex-col shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
                    <h2 className="text-lg font-bold text-white">Top Processes</h2>
                    <span className="text-xs text-slate-400">By CPU Usage</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead className="bg-slate-800 text-xs uppercase font-semibold text-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 bg-slate-800">Name</th>
                          <th className="px-4 py-3 text-right bg-slate-800">CPU</th>
                          <th className="px-4 py-3 text-right bg-slate-800">RAM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {dynamicData?.processes?.map((p) => (
                          <tr key={p.pid} className="hover:bg-slate-700/30 transition-colors cursor-default">
                            <td className="px-4 py-3 font-medium text-white truncate max-w-[120px]" title={p.name}>{p.name}</td>
                            <td className="px-4 py-3 text-right font-mono text-emerald-400">{p.cpu}%</td>
                            <td className="px-4 py-3 text-right font-mono text-blue-400">{p.mem}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-slate-700 bg-slate-900/30 text-center">
                    <button onClick={() => setActiveTab('performance')} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium uppercase tracking-wider">View All</button>
                  </div>
                </div>

              </div>

              {/* Row 3: Bottom Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Storage */}
                <Card title="Storage Usage" icon={Database} className="h-64">
                  <StorageUsage
                    percentUsed={dynamicData?.size?.percentUsed || 0}
                    total={dynamicData?.size?.total || '0 GB'}
                    used={dynamicData?.size?.used || '0 GB'}
                    free={dynamicData?.size?.free || '0 GB'}
                  />
                </Card>

                {/* Network */}
                <div className="md:col-span-2">
                  <SpeedDisplay
                    networkDown={dynamicData.speed.networkDownload}
                    networkUp={dynamicData.speed.networkUpload}
                    cpuSpeed={dynamicData.speed.cpuCurrentSpeed}
                  />
                </div>
              </div>

            </div>
          )}

          {/* PERFORMANCE VIEW */}
          {activeTab === 'performance' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed Core Stats */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Cpu size={20} className="text-emerald-400" /> Processor Cores
                    </h3>
                    <span className="text-sm text-slate-400">{staticData?.cpu?.manufacturer} {staticData?.cpu?.brand}</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {dynamicData?.performance?.cpuCores?.map((core, i) => (
                      <div key={i} className="flex flex-col items-center justify-end h-24 bg-slate-900 rounded-lg p-2 border border-slate-700/50 relative overflow-hidden group">
                        <div
                          className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out opacity-20 ${parseFloat(core) > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ height: `${core}%` }}
                        />
                        <span className={`relative z-10 text-xs font-mono font-bold ${parseFloat(core) > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{core}%</span>
                        <div className="w-1.5 h-12 bg-slate-800 rounded-full mt-2 relative overflow-hidden">
                          <div
                            className={`absolute bottom-0 w-full rounded-full transition-all duration-300 ${parseFloat(core) > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ height: `${core}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">C{i}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Temp & Memory Details */}
                <div className="space-y-6">
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-400 uppercase text-xs font-bold mb-1">CPU Temperature</h3>
                      <p className="text-4xl font-bold text-white">{temp}°C</p>
                      <p className="text-xs text-slate-500 mt-1">Max Recorded: {staticData?.cpu?.tMax}°C</p>
                    </div>
                    <Thermometer size={64} className={`${temp > 80 ? 'text-red-500' : 'text-emerald-500'} opacity-80`} />
                  </div>

                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-slate-400 uppercase text-xs font-bold mb-4">Memory Allocation</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Active</span>
                          <span className="text-emerald-400">{memUsage}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${memUsage}%` }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-900 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="text-lg font-mono text-white">{dynamicData?.performance?.memoryTotal}</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-700">
                          <p className="text-xs text-slate-500">Available</p>
                          <p className="text-lg font-mono text-white">{dynamicData?.performance?.memoryAvailable}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STORAGE VIEW */}
          {activeTab === 'storage' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {dynamicData?.size?.details?.map((disk, i) => (
                <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-all shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                      <HardDrive size={24} />
                    </div>
                    <span className={`text-xl font-bold ${parseFloat(disk.use) > 90 ? 'text-red-500' : 'text-emerald-500'}`}>{disk.use}%</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{disk.mount}</h3>
                  <p className="text-sm text-slate-400 font-mono mb-6">{disk.type} • {disk.fs}</p>

                  <div className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${parseFloat(disk.use) > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${disk.use}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>{disk.used} Used</span>
                      <span>{disk.size} Total</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NETWORK VIEW */}
          {activeTab === 'network' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dynamicData?.speed?.interfaces?.map((iface, i) => (
                  <div key={i} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center gap-6">
                    <div className={`p-4 rounded-full ${iface.operstate === 'up' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400'}`}>
                      <Wifi size={32} />
                    </div>
                    <div className="flex-1 w-full text-center md:text-left">
                      <h3 className="text-xl font-bold text-white">{iface.iface}</h3>
                      <p className={`text-sm uppercase font-bold tracking-wider mt-1 ${iface.operstate === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{iface.operstate}</p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                          <p className="text-xs text-blue-400 mb-1">Download (RX)</p>
                          <p className="font-mono text-lg text-white">{iface.rx}</p>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                          <p className="text-xs text-emerald-400 mb-1">Upload (TX)</p>
                          <p className="font-mono text-lg text-white">{iface.tx}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for Settings */}
          {activeTab === 'settings' && (
            <div className="flex items-center justify-center h-96 text-slate-500">
              <div className="text-center">
                <SettingsIcon size={48} className="mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <p>Configuration options coming soon.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Helper Components for this file (to avoid circular deps or extra files for simple icons)
const AreaChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18.5 13.5L12 7l-4 4-4.5-4.5" />
  </svg>
);

const SettingsIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default App;
