
import React, { useEffect, useState } from 'react';
import { Activity, Server, Database, Wifi, Cpu, Thermometer, AlertCircle, RefreshCw } from 'lucide-react';
import useSystemData from './hooks/useSystemData';
import HistoryChart from './components/HistoryChart';
import HealthGauge from './components/HealthGauge';
import SpeedDisplay from './components/SpeedDisplay';
import StorageUsage from './components/StorageUsage';

// Simple Card Component
const Card = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`card glass ${className}`}>
    <div className="card-header">
      {Icon && <Icon className="icon-subtle" size={20} />}
      <h2 className="card-title">{title}</h2>
    </div>
    <div className="card-content relative">
      {children}
    </div>
  </div>
);

function App() {
  const { staticData, dynamicData, history, lastUpdated, isConnected, connectionError } = useSystemData();
  const [loading, setLoading] = useState(true);

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
  const cpuUsage = parseFloat(dynamicData.performance.cpuUsage);
  const memUsage = parseFloat(dynamicData.performance.memoryUsage);
  const temp = dynamicData.health.temperature;

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
            <p className="header-subtitle">{staticData?.osInfo?.distro} • {staticData?.cpu?.manufacturer} {staticData?.cpu?.brand}</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-item end">
            <span className="stat-label">System Status</span>
            <span className={`stat-value ${isConnected ? 'text-primary' : 'text-danger'}`}>
              <span className={`status-dot ${isConnected ? 'bg-primary' : 'bg-red-500'}`}></span>
              {isConnected ? 'Online' : 'Disconnected'}
            </span>
          </div>
          <div className="stat-item end">
            <span className="stat-label">Last Update</span>
            <p className="stat-value-mono">{new Date(lastUpdated).toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="main-grid">

        {/* Row 1: KPI Stats */}
        <div className="grid-section full-width">
          <SpeedDisplay
            networkDown={dynamicData.speed.networkDownload}
            networkUp={dynamicData.speed.networkUpload}
            cpuSpeed={dynamicData.speed.cpuCurrentSpeed}
          />
        </div>

        {/* Row 2: Charts & Gauges */}

        {/* Health Column */}
        <div className="grid-section col-small">
          <Card title="System Health" icon={Activity} className="h-full">
            <HealthGauge
              score={dynamicData.health.score}
              status={dynamicData.health.status}
              suggestions={dynamicData.suggestions}
            />
          </Card>
        </div>

        {/* Main Chart Column */}
        <div className="grid-section col-large">
          <Card title="Real-time Performance" icon={Cpu} className="h-full">
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
          <Card title="Storage" icon={Database} className="h-full">
            <StorageUsage
              percentUsed={dynamicData.size.percentUsed}
              total={dynamicData.size.total}
              used={dynamicData.size.used}
              free={dynamicData.size.free}
            />
          </Card>
        </div>

      </div>
    </div>
  );
}

export default App;
