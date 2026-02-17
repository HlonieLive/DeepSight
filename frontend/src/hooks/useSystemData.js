
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3001";

const useSystemData = () => {
    const [staticData, setStaticData] = useState(null);
    const [dynamicData, setDynamicData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(Date.now());
    const [history, setHistory] = useState([]); // Store last 60 points (2 min)
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);

        socket.on("connect", () => {
            console.log("Connected to server");
            setIsConnected(true);
            setConnectionError(null);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
            setConnectionError(err.message);
            setIsConnected(false);
        });

        socket.on("system-info", (data) => {
            setStaticData(data);
        });

        socket.on("system-update", (data) => {
            setDynamicData(data);
            setLastUpdated(Date.now());

            setHistory(prev => {
                const point = {
                    timestamp: new Date().toLocaleTimeString(),
                    cpu: parseFloat(data.performance.cpuUsage),
                    mem: parseFloat(data.performance.memoryUsage),
                    temp: parseFloat(data.health.temperature) || 0
                };
                const newHistory = [...prev, point];
                if (newHistory.length > 60) newHistory.shift();
                return newHistory;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { staticData, dynamicData, history, lastUpdated, isConnected, connectionError };
};

export default useSystemData;
