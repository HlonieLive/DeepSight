const si = require('systeminformation');

class Monitor {
    constructor() {
        this.staticData = null;
    }


    async getStaticData() {
        if (this.staticData) return this.staticData;

        try {
            const [cpu, osInfo, system, diskLayout, networkInterfaces, graphics] = await Promise.all([
                si.cpu(),
                si.osInfo(),
                si.system(),
                si.diskLayout(),
                si.networkInterfaces(),
                si.graphics()
            ]);

            this.staticData = {
                cpu,
                osInfo,
                system,
                diskLayout,
                networkInterfaces,
                graphics
            };
            return this.staticData;
        } catch (error) {
            console.error("Error fetching static data:", error);
            throw error;
        }
    }

    async getFormattedData() {
        try {
            const [currentLoad, mem, networkStats, fsSize, cpuTemperature, cpuSpeed, battery] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.networkStats(),
                si.fsSize(),
                si.cpuTemperature(),
                si.cpuCurrentSpeed(),
                si.battery()
            ]);

            // --- Processes ---
            const processesData = await si.processes();
            const topProcesses = processesData.list
                .sort((a, b) => b.cpu - a.cpu)
                .slice(0, 5)
                .map(p => ({
                    pid: p.pid,
                    name: p.name,
                    cpu: p.cpu.toFixed(1),
                    mem: p.mem.toFixed(1),
                    user: p.user
                }));

            // --- Performance ---
            const performance = {
                cpuUsage: currentLoad.currentLoad.toFixed(2),
                cpuCores: currentLoad.cpus.map(c => c.load.toFixed(1)), // Per-core load
                memoryUsage: ((mem.active / mem.total) * 100).toFixed(2),
                memoryTotal: (mem.total / 1024 / 1024 / 1024).toFixed(2) + " GB",
                memoryAvailable: (mem.available / 1024 / 1024 / 1024).toFixed(2) + " GB",
                uptime: si.time().uptime
            };

            // --- Size (Storage) ---
            // aggregating all physical drives suitable for user data (excluding loops, snaps)
            const relevantDrives = fsSize.filter(d => !d.fs.includes('loop') && !d.fs.includes('snap') && d.size > 0);
            const totalStorage = relevantDrives.reduce((acc, d) => acc + d.size, 0);
            const usedStorage = relevantDrives.reduce((acc, d) => acc + d.used, 0);

            const size = {
                total: (totalStorage / 1024 / 1024 / 1024).toFixed(2) + " GB",
                used: (usedStorage / 1024 / 1024 / 1024).toFixed(2) + " GB",
                free: ((totalStorage - usedStorage) / 1024 / 1024 / 1024).toFixed(2) + " GB",
                percentUsed: ((usedStorage / totalStorage) * 100).toFixed(2),
                details: relevantDrives.map(d => ({
                    fs: d.fs,
                    type: d.type,
                    mount: d.mount,
                    size: (d.size / 1024 / 1024 / 1024).toFixed(1) + " GB",
                    used: (d.used / 1024 / 1024 / 1024).toFixed(1) + " GB",
                    use: d.use.toFixed(1)
                }))
            };

            // --- Speed ---
            // Calculating total network throughput
            const rxSec = networkStats.reduce((acc, iface) => acc + iface.rx_sec, 0);
            const txSec = networkStats.reduce((acc, iface) => acc + iface.tx_sec, 0);

            const speed = {
                cpuCurrentSpeed: cpuSpeed.avg + " GHz",
                networkDownload: (rxSec / 1024 / 1024).toFixed(2) + " MB/s",
                networkUpload: (txSec / 1024 / 1024).toFixed(2) + " MB/s",
                interfaces: networkStats.map(iface => ({
                    iface: iface.iface,
                    rx: (iface.rx_sec / 1024).toFixed(1) + " KB/s",
                    tx: (iface.tx_sec / 1024).toFixed(1) + " KB/s",
                    operstate: iface.operstate
                }))
            };

            // --- Power (Battery) ---
            const power = {
                hasBattery: battery.hasBattery,
                percent: battery.percent,
                isCharging: battery.isCharging,
                timeRemaining: battery.timeRemaining
            };

            // --- Suggestions & Health ---
            const suggestions = [];
            let healthScore = 100;

            if (parseFloat(performance.cpuUsage) > 80) {
                suggestions.push("High CPU usage detected. Close unnecessary background processes.");
                healthScore -= 20;
            }
            if (parseFloat(performance.memoryUsage) > 90) {
                suggestions.push("Memory is running low. Consider closing tabs or applications.");
                healthScore -= 20;
            }
            if (parseFloat(size.percentUsed) > 90) {
                suggestions.push("Disk space is critical. Delete temporary files or add storage.");
                healthScore -= 10;
            }
            if (cpuTemperature.main > 80) {
                suggestions.push("CPU is running hot. Check cooling system.");
                healthScore -= 30;
            }
            if (power.hasBattery && !power.isCharging && power.percent < 20) {
                suggestions.push("Battery is low. Connect charger.");
                healthScore -= 5;
            }

            if (suggestions.length === 0) {
                suggestions.push("System is running smoothly.");
            }

            const health = {
                status: healthScore > 80 ? "Good" : (healthScore > 50 ? "Fair" : "Critical"),
                score: healthScore,
                temperature: cpuTemperature.main || "N/A",
                cores: cpuTemperature.cores,
                max: cpuTemperature.max
            };

            return {
                health,
                performance,
                size,
                speed,
                power,
                suggestions,
                processes: topProcesses
            };

        } catch (error) {
            console.error("Error fetching formatted data:", error);
            return null;
        }
    }
}

module.exports = new Monitor();
