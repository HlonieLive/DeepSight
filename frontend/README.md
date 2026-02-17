
# Deep Sight 👁️

A modern, real-time system monitoring dashboard that gives you deep insights into your computer's health and performance. Built with **React**, **Node.js**, and a touch of glassmorphism.

![Deep Sight Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3) 
*(Note: Screenshot placeholder. Run the app to see the magic!)*

## ✨ Features

*   **Real-Time Monitoring**: Watch your CPU, Memory, and Network usage update live via WebSocket.
*   **Interactive Insights**: Click on any card (CPU, Storage, Network) to dive deeper.
*   **Detailed Metrics**:
    *   **CPU**: Visualizes load across *all* your CPU cores individually. plus temperature monitoring.
    *   **Processes**: See the top 5 resource-hungry apps slowing you down.
    *   **Storage**: Breakdown of all your disk partitions and space usage.
    *   **Network**: Live upload/download speeds and interface status.
    *   **System Info**: Displays your OS distro, Kernel version, and even GPU model.
*   **Responsive Design**: Looks great on your ultra-wide monitor AND your phone.
*   **Battery Status**: (Laptop users) Checks your battery health and charging status.

## 🚀 Tech Stack

*   **Frontend**: React (Vite), Framer Motion (animations), Recharts (graphs), Lucide Icons.
*   **Backend**: Node.js, Express, Socket.IO (real-time data), SystemInformation (the magic library).
*   **Styling**: Pure CSS with CSS Variables (no heavy frameworks like Tailwind, keeping it lightweight).

## 🛠️ How to Run

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/DeepSight.git
cd DeepSight
```

### 2. Start the Backend (The Brain)
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:3001
```

### 3. Start the Frontend (The Beauty)
```bash
# Open a new terminal
cd frontend
npm install
npm run dev
# Dashboard opens at http://localhost:5173
```

## 📸 Snapshots
*   **Home Dashboard**: A clean overview of system health.
*   **Process Manager**: Quickly identify what's eating your RAM.
*   **Core Visualizer**: Satisfying bars showing each CPU core working hard.

## 🤝 Contributing
Feel free to fork this, add new widgets (maybe GPU temps or Docker stats?), and submit a PR!

---
*Built by Lehlohonolo.*
