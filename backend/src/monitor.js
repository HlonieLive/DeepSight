const si = require('systeminformation');

class Monitor {
    constructor() {
        this.staticData = null;
    }

    async getStaticData() {
        if (this.staticData) return this.staticData;

        try {
            const [cpu, osInfo, system, diskLayout, networkInterfaces] = await Promise.all([
                si.cpu(),
                si.osInfo(),
                si.system(),
                si.diskLayout(),
                si.networkInterfaces()
            ]);

            this.staticData = {
                cpu,
                osInfo,
                system,
                diskLayout,
                networkInterfaces
            };
            return this.staticData;
        } catch (error) {
            console.error("Error fetching static data:", error);
            throw error;
        }
    }

    async getFormattedData() {
        try {
            const [currentLoad, mem, networkStats, fsSize, cpuTemperature, cpuSpeed] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.networkStats(),
                si.fsSize(),
                si.cpuTemperature(),
                si.cpuCurrentSpeed()
            ]);

            // --- Performance ---
            const performance = {
                cpuUsage: currentLoad.currentLoad.toFixed(2),
                memoryUsage: ((mem.active / mem.total) * 100).toFixed(2),
                memoryTotal: (mem.total / 1024 / 1024 / 1024).toFixed(2) + " GB",
                memoryAvailable: (mem.available / 1024 / 1024 / 1024).toFixed(2) + " GB"
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
                percentUsed: ((usedStorage / totalStorage) * 100).toFixed(2)
            };

            // --- Speed ---
            // Calculating total network throughput
            const rxSec = networkStats.reduce((acc, iface) => acc + iface.rx_sec, 0);
            const txSec = networkStats.reduce((acc, iface) => acc + iface.tx_sec, 0);

            const speed = {
                cpuCurrentSpeed: cpuSpeed.avg + " GHz",
                networkDownload: (rxSec / 1024 / 1024).toFixed(2) + " MB/s",
                networkUpload: (txSec / 1024 / 1024).toFixed(2) + " MB/s"
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

            if (suggestions.length === 0) {
                suggestions.push("System is running smoothly.");
            }

            const health = {
                status: healthScore > 80 ? "Good" : (healthScore > 50 ? "Fair" : "Critical"),
                score: healthScore,
                temperature: cpuTemperature.main || "N/A"
            };

            return {
                health,
                performance,
                size,
                speed,
                suggestions
            };

        } catch (error) {
            console.error("Error fetching formatted data:", error);
            return null;
        }
    }
}

module.exports = new Monitor();
