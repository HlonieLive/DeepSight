
import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Wifi, Cpu, Thermometer, AlertCircle, RefreshCw, X, Maximize2, Battery, BatteryCharging, BatteryWarning, Cpu as CpuIcon } from 'lucide-react';
import useSystemData from './hooks/useSystemData';
import HistoryChart from './components/HistoryChart';
import HealthGauge from './components/HealthGauge';
import SpeedDisplay from './components/SpeedDisplay';
import StorageUsage from './components/StorageUsage';
import Modal from './components/Modal';

// Simple Update of Card Component to be Clickable
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
  const [selectedFeature, setSelectedFeature] = useState(null);

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

  // Calculate averages for header or summary
  const cpuUsage = parseFloat(dynamicData?.performance?.cpuUsage || 0);
  const memUsage = parseFloat(dynamicData?.performance?.memoryUsage || 0);
  const temp = dynamicData?.health?.temperature || 'N/A';
  const hasBattery = dynamicData?.power?.hasBattery;

  // Format uptime
  const formatUptime = (seconds) => {
    if (!seconds) return "0m";
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor(seconds % (3600 * 24) / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header glass">
        <div className="header-brand">
          <div className="logo-container">
            <Activity className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="header-title">Deep Sight</h1>
            <div className="flex items-center gap-2">
              <span className="header-subtitle font-bold text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                {staticData?.osInfo?.hostname || 'Localhost'}
              </span>
              <p className="header-subtitle">{staticData?.osInfo?.distro} {staticData?.osInfo?.code}</p>
            </div>
          </div>
        </div>

        <div className="header-stats">
          {hasBattery && (
            <div className="stat-item end hidden md:flex">
              <span className="stat-label">Power</span>
              <span className={`stat-value font-mono text-xs flex items-center gap-1 ${dynamicData.power.isCharging ? 'text-emerald-400' : 'text-gray-300'}`}>
                {dynamicData.power.isCharging ? <BatteryCharging size={14} /> : <Battery size={14} />}
                {dynamicData.power.percent}%
              </span>
            </div>
          )}
          <div className="stat-item end hidden md:flex">
            <span className="stat-label">Uptime</span>
            <span className="stat-value-mono text-xs">{formatUptime(dynamicData?.performance?.uptime)}</span>
          </div>
          <div className="stat-item end">
            <span className="stat-label">System Status</span>
            <span className={`stat-value ${isConnected ? 'text-primary' : 'text-danger'}`}>
              <span className={`status-dot ${isConnected ? 'bg-primary' : 'bg-red-500'}`}></span>
              {isConnected ? 'Online' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="main-grid">

        {/* Row 1: KPI Stats (Clickable) */}
        <div className="grid-section full-width cursor-pointer" onClick={() => setSelectedFeature('Network')}>
          <SpeedDisplay
            networkDown={dynamicData.speed.networkDownload}
            networkUp={dynamicData.speed.networkUpload}
            cpuSpeed={dynamicData.speed.cpuCurrentSpeed}
          />
        </div>

        {/* Row 2: Charts & Gauges */}

        {/* Health Column */}
        <div className="grid-section col-small">
          <Card
            title="System Health"
            icon={Activity}
            className="h-full"
            onClick={() => setSelectedFeature('Health')}
          >
            <HealthGauge
              score={dynamicData?.health?.score || 0}
              status={dynamicData?.health?.status || 'Unknown'}
              suggestions={dynamicData?.suggestions || []}
            />
          </Card>
        </div>

        {/* Main Chart Column */}
        <div className="grid-section col-large">
          <Card
            title="Real-time Performance"
            icon={Cpu}
            className="h-full"
            onClick={() => setSelectedFeature('Performance')}
          >
            <div className="chart-legend-overlay">
              <span className="legend-item text-primary">CPU: {cpuUsage}%</span>
              <span className="legend-item text-accent">MEM: {memUsage}%</span>
              <span className="legend-item text-danger">TMP: {temp}°C</span>
            </div>
            <div className="chart-container">
              <HistoryChart data={history} />
            </div>
          </Card>
        </div>

        {/* Storage Column */}
        <div className="grid-section col-small">
          <Card
            title="Storage"
            icon={Database}
            className="h-full"
            onClick={() => setSelectedFeature('Storage')}
          >
            <StorageUsage
              percentUsed={dynamicData?.size?.percentUsed || 0}
              total={dynamicData?.size?.total || '0 GB'}
              used={dynamicData?.size?.used || '0 GB'}
              free={dynamicData?.size?.free || '0 GB'}
            />
          </Card>
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Performance Modal */}
      {selectedFeature === 'Performance' && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title="Performance"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature Widget */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col justify-center items-center">
                <h3 className="text-gray-400 text-sm uppercase font-bold mb-2 w-full text-left">Temperature</h3>
                <div className="flex items-center gap-3">
                  <Thermometer size={32} className="text-red-500" />
                  <div>
                    <span className="text-3xl font-bold text-white">{temp}°C</span>
                    <p className="text-xs text-gray-500">Max: {staticData?.cpu?.tMax || 100}°C</p>
                  </div>
                </div>
              </div>

              {/* Memory Widget */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="text-gray-400 text-sm uppercase font-bold mb-2">Memory</h3>
                <div className="flex justify-between border-b border-slate-700 py-1">
                  <span className="text-gray-300 text-xs">Total</span>
                  <span className="font-mono text-white text-xs">{dynamicData?.performance?.memoryTotal}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-300 text-xs">Available</span>
                  <span className="font-mono text-emerald-400 text-xs">{dynamicData?.performance?.memoryAvailable}</span>
                </div>
              </div>
            </div>

            {/* Logical Cores Grid */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-gray-400 text-sm uppercase font-bold">Logical Cores ({dynamicData?.performance?.cpuCores?.length || 0})</h3>
                <span className="text-xs text-gray-500">{staticData?.cpu?.manufacturer} {staticData?.cpu?.brand}</span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {dynamicData?.performance?.cpuCores?.map((core, i) => (
                  <div key={i} className="flex flex-col items-center bg-slate-900 p-1.5 rounded border border-slate-700/50">
                    <span className={`text-[10px] font-mono ${parseFloat(core) > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{core}%</span>
                    <div className="w-full h-1 bg-slate-800 mt-1 rounded-full">
                      <div className={`h-full rounded-full ${parseFloat(core) > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${core}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Processes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3 border-l-4 border-emerald-500 pl-3">Top Processes</h3>
              <div className="w-full overflow-hidden rounded-lg border border-slate-700">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-slate-800 text-gray-200 uppercase font-bold text-xs">
                    <tr>
                      <th className="px-4 py-3">PID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3 text-right">CPU %</th>
                      <th className="px-4 py-3 text-right">Mem %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                    {dynamicData?.processes?.map((p) => (
                      <tr key={p.pid} className="hover:bg-slate-700/50 transition">
                        <td className="px-4 py-3 font-mono text-gray-500">{p.pid}</td>
                        <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-400">{p.cpu}%</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-400">{p.mem}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Storage Modal */}
      {selectedFeature === 'Storage' && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title="Storage"
        >
          <div className="space-y-4">
            {dynamicData?.size?.details?.map((disk, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold text-lg">{disk.mount}</h3>
                    <p className="text-xs text-gray-500 font-mono">{disk.type} • {disk.fs}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${parseFloat(disk.use) > 90 ? 'text-red-500' : 'text-emerald-500'}`}>{disk.use}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${parseFloat(disk.use) > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${disk.use}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Used: <span className="text-gray-200">{disk.used}</span></span>
                  <span className="text-gray-400">Total: <span className="text-gray-200">{disk.size}</span></span>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Network Modal */}
      {selectedFeature === 'Network' && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title="Network"
        >
          <div className="grid grid-cols-1 gap-4">
            {dynamicData?.speed?.interfaces?.map((iface, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${iface.operstate === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Wifi size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{iface.iface}</h3>
                    <span className={`text-xs uppercase font-bold ${iface.operstate === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {iface.operstate}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-300">
                    <span className="text-xs text-blue-400">RX</span>
                    <span className="font-mono">{iface.rx}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-300">
                    <span className="text-xs text-emerald-400">TX</span>
                    <span className="font-mono">{iface.tx}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Health Modal */}
      {selectedFeature === 'Health' && (
        <Modal
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title="Health"
        >
          <div className="space-y-6 text-center">
            <div className="relative inline-block">
              <HealthGauge
                score={dynamicData?.health?.score || 0}
                status={dynamicData?.health?.status || 'Unknown'}
                suggestions={[]}
              />
            </div>

            {/* Report */}
            <div className="text-left bg-slate-800/30 p-4 rounded-xl border border-slate-700">
              <h3 className="text-lg font-bold text-gray-200 mb-4 border-b border-slate-700 pb-2">Analysis Report</h3>
              {dynamicData?.suggestions?.length > 0 ? (
                <ul className="space-y-3">
                  {dynamicData.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 bg-slate-900/50 p-3 rounded-lg">
                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-emerald-500">
                  <Activity size={48} className="mb-2 opacity-50" />
                  <p className="text-lg font-medium">System is healthy</p>
                  <p className="text-sm text-emerald-500/70">No critical issues detected.</p>
                </div>
              )}
            </div>

            {/* Specs Grid with Graphics */}
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs text-gray-500 uppercase">OS Distro</p>
                <p className="text-white text-sm">{staticData?.osInfo?.distro} {staticData?.osInfo?.code}</p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs text-gray-500 uppercase">Model</p>
                <p className="text-white text-sm truncate" title={staticData?.system?.model}>{staticData?.system?.model}</p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700 col-span-2">
                <p className="text-xs text-gray-500 uppercase">Graphics</p>
                {staticData?.graphics?.controllers?.map((gpu, i) => (
                  <p key={i} className="text-white text-sm truncate" title={gpu.model}>{gpu.model} ({gpu.vram}MB)</p>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

export default App;
